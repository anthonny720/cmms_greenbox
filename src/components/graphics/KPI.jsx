import React from 'react';
import {useSelector} from "react-redux";
import StackedBar from "../../components/graphics/Chartjs";
import PieChart from "../../components/graphics/Pie";
import {map, size} from "lodash";
import {HorizontalBar} from "./HorizontalBar";
import Table from "./Table";
import Humanize from "humanize-plus";
import Summary from "./Summary";

const KPI = () => {
    const count_failures = useSelector(state => state.Graphics.count_failure)
    const count_physical = useSelector(state => state.Graphics.count_equipment)
    const count_fixed = useSelector(state => state.Graphics.count_facilities)
    const count_type = useSelector(state => state.Graphics.count_type)
    const finished = useSelector(state => state.Graphics.ot_finished)
    const pending = useSelector(state => state.Graphics.ot_pending)
    const compliance = useSelector(state => state.Graphics.ot_compliance)

    const count_total_ot = useSelector(state => state.Graphics.count_total_ot)
    const total_hours = useSelector(state => state.Graphics.total_hours)
    const indicators = useSelector(state => state.Graphics.indicators)


    return (


        <div className={"grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"}>
            <div
                className={" w-full col-span-1 sm:col-span-2 md:col-span-3  rounded-xl p-2  scrollbar-hide   gap-6  flex justify-center items-center flex-wrap "}>
                <Summary title={"OTs pendientes"} value={pending} icon={true}/>
                <Summary title={"OTs finalizados"} value={finished} icon={false}/>
                <Summary title={"Cumplimiento"} value={Humanize.formatNumber(compliance, 2) + " %"} icon={false}/>
            </div>
            <div
                className={"w-full  shadow-lg col-span-1 sm:col-span-2 md:col-span-3  rounded-lg  h-max overflow-scroll scrollbar-hide"}>
                <Table/>
            </div>

            <div className={"w-full sm:col-span-2 shadow-lg rounded-lg   h-full "}>
                {count_total_ot !== null && size(count_total_ot) > 0 &&
                    <StackedBar labels={['Personal']} data={count_total_ot} title={"OT por trabajador"}/>}
            </div>
            <div className={"w-full shadow-lg  rounded-lg p-2 h-max"}>
                {count_total_ot !== null && size(total_hours) > 0 &&
                    <PieChart labels={map(total_hours, item => item?.label)}
                              data={map(total_hours, item => item?.data)}
                              background={map(total_hours, item => item?.backgroundColor)}
                              title={"Horas por trabajador"}/>}
            </div>
            <div className={"w-full  shadow-lg  rounded-lg p-2 h-max "}>
                {count_failures !== null && size(count_failures) > 0 &&
                    <PieChart labels={map(count_failures, item => item?.label)}
                              data={map(count_failures, item => item?.data)}
                              background={map(count_failures, item => item?.backgroundColor)}
                              title={"Origen de fallas"}/>}
            </div>
            <div className={"w-full  shadow-lg  rounded-lg p-2 h-max "}>
                {count_type !== null && size(count_type) > 0 && <PieChart labels={map(count_type, item => item?.label)}
                                                                          data={map(count_type, item => item?.data)}
                                                                          background={map(count_type, item => item?.backgroundColor)}
                                                                          title={"Tipo de mantenimiento"}/>}
            </div>
            <div className={"w-full  shadow-lg  rounded-lg p-2 h-max "}>
                {count_physical !== null && size(count_physical) > 0 &&
                    <PieChart labels={map(count_physical, item => item?.label)}
                              data={map(count_physical, item => item?.data)}
                              background={map(count_physical, item => item?.backgroundColor)}
                              title={"OT por equipos"}/>}
            </div>
            <div className={"w-full  shadow-lg  rounded-lg p-2 h-max "}>
                {count_fixed !== null && size(count_fixed) > 0 &&
                    <PieChart labels={map(count_fixed, item => item?.label)}
                              data={map(count_fixed, item => item?.data)}
                              background={map(count_fixed, item => item?.backgroundColor)}
                              title={"OT por ubicaciones"}/>}
            </div>


            <div className={"w-full grid grid-cols-1 col-span-1 md:col-span-2 lg:grid-cols-2"}>
                <div className={"w-full  shadow-lg   rounded-lg p-2 h-full"}>
                    {indicators !== null && size(indicators) > 0 && <HorizontalBar title={"MTTR"}
                                                                                   labels={map(indicators, item => item.label_mttr)}
                                                                                   data={map(indicators, item => item?.data_mttr)}
                                                                                   background={map(indicators, item => item?.backgroundColor)}
                    />}
                </div>
                <div className={"w-full  shadow-lg   rounded-lg p-2 h-full "}>
                    {indicators !== null && size(indicators) > 0 && <HorizontalBar title={"MTBF"}
                                                                                   labels={map(indicators, item => item.label_mtbf)}
                                                                                   data={map(indicators, item => item?.data_mtbf)}
                                                                                   background={map(indicators, item => item?.backgroundColor)}
                    />}
                </div>
                <div className={"w-full  shadow-lg   rounded-lg p-2 h-full "}>
                    {indicators !== null && size(indicators) > 0 && <HorizontalBar title={"Disponibilidad"}
                                                                                   labels={map(indicators, item => item.label_available)}
                                                                                   data={map(indicators, item => item?.data_available)}
                                                                                   background={map(indicators, item => item?.backgroundColor)}
                    />}
                </div>
                <div className={"w-full  shadow-lg   rounded-lg p-2 h-full "}>
                    {indicators !== null && size(indicators) > 0 && <HorizontalBar title={"Fiabilidad"}
                                                                                   labels={map(indicators, item => item.label_reliability)}
                                                                                   data={map(indicators, item => item?.data_reliability)}
                                                                                   background={map(indicators, item => item?.backgroundColor)}
                    />}
                </div>

            </div>


        </div>);
};


export default KPI;
