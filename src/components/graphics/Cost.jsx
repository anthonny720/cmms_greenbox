import React from 'react';
import {useSelector} from "react-redux";
import StackedBar from "../../components/graphics/Chartjs";
import PieChart from "../../components/graphics/Pie";
import {map, size} from "lodash";
import Summary from "./Summary";
import Humanize from "humanize-plus";

const Cost = () => {

    const count_failures = useSelector(state => state.Graphics.count_failure)
    const count_physical = useSelector(state => state.Graphics.count_equipment)
    const count_fixed = useSelector(state => state.Graphics.count_facilities)
    const count_type = useSelector(state => state.Graphics.count_type)


    const cost_day = useSelector(state => state.Graphics.cost_day)
    const cost_user = useSelector(state => state.Graphics.cost_user)
    const cost_material = useSelector(state => state.Graphics.cost_material)


    return (

        <div className={"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-4 flex-wrap"}>
            <div
                className={" w-full col-span-1 sm:col-span-2 md:col-span-3  rounded-xl p-2  scrollbar-hide   gap-6  flex justify-center items-center flex-wrap "}>
                <Summary title={"Costo MOD"} value={"S/" + Humanize.formatNumber(cost_user, 2)} icon={true}/>
                <Summary title={"Costo Material"} value={"S/" + Humanize.formatNumber(cost_material, 2)} icon={false}/>
                <Summary title={"Costo total"} value={"S/" + Humanize.formatNumber(cost_user + cost_material, 2)}
                         icon={false}/>
            </div>
            <div className={"w-full  shadow-lg  rounded-lg p-2 h-full "}>
                {count_failures && size(count_failures) > 0 && count_failures !== null && size(count_failures) > 0 &&
                    <PieChart labels={map(count_failures, item => item?.label)}
                              data={map(count_failures, item => item?.cost)}
                              background={map(count_failures, item => item?.backgroundColor)}
                              title={"Origen de fallas"}/>}
            </div>
            <div className={"w-full shadow-lg    rounded-lg p-2 h-full"}>
                {count_type && size(count_type) > 0 && count_type !== null && size(count_type) > 0 &&
                    <PieChart labels={map(count_type, item => item?.label)}
                              data={map(count_type, item => item?.cost)}
                              background={map(count_type, item => item?.backgroundColor)}
                              title={"Costo de mantenimiento"}/>}
            </div>
            <div className={"w-full shadow-lg   rounded-lg p-2 h-full"}>
                {count_physical && size(count_physical) > 0 && count_physical !== null && size(count_physical) > 0 &&
                    <PieChart labels={map(count_physical, item => item?.label)}
                              data={map(count_physical, item => item?.cost)}
                              background={map(count_physical, item => item?.backgroundColor)}
                              title={"Costo por equipos"}/>}
            </div>
            <div className={"w-full shadow-lg   rounded-lg p-2 h-full"}>
                {count_fixed && size(count_fixed) > 0 && count_fixed !== null && size(count_fixed) > 0 &&
                    <PieChart labels={map(count_fixed, item => item?.label)}
                              data={map(count_fixed, item => item?.cost)}
                              background={map(count_fixed, item => item?.backgroundColor)}
                              title={"Costo por ubicaciones"}/>}
            </div>
            <div className={"w-full shadow-lg lg:col-span-2  rounded-lg p-2 h-full"}>
                <StackedBar labels={['Dia']} data={cost_day} title={"Costo por dia"}/>
            </div>


        </div>

    );
};

export default Cost;
