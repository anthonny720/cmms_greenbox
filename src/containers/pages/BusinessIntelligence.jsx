import React, {useEffect, useState} from 'react';
import Layout from "../../hocs/Layout";
import {
    get_graphics_cost_day,
    get_graphics_indicators,
    get_graphics_ot,
    get_graphics_personnel,
    get_graphics_total_cost,
    get_graphics_total_ot,
    get_total_ot
} from "../../redux/actions/graphics";
import {useDispatch} from "react-redux";
import Filter from "../../components/graphics/Filter";
import KPI from "../../components/graphics/KPI";
import Cost from "../../components/graphics/Cost";
import RangeDate from "../../components/util/RangeDate";
import Header from "../../components/navigation/Header";

const BusinessIntelligence = () => {
    const dispatch = useDispatch();
    const [openPage, setOpenPage] = useState(true);


    // Filter state
    const [params, setParams] = useState()
    const [checked, setChecked] = useState(false)

    useEffect(() => {
        const data = {
            'date_start': params ? new Date(params?.[0]).toLocaleDateString('es-PE', {timeZone: 'UTC'}) : '',
            'date_end': params ? new Date(params?.[1]).toLocaleDateString('es-PE', {timeZone: 'UTC'}) : '',
            'planned': checked
        }

        dispatch(get_graphics_personnel(data))
        dispatch(get_graphics_ot(data))
        dispatch(get_graphics_total_ot(data))
        dispatch(get_graphics_indicators(data))
        dispatch(get_graphics_cost_day(data))
        dispatch(get_graphics_total_cost(data))
        dispatch(get_total_ot(data))
    }, [params, checked]);


    return (<Layout>
        <div className={"h-full overflow-y-auto scrollbar-hide w-full bg-white p-4 rounded-l-2xl"}>
            <Header/>
            <Filter setOpenPage={setOpenPage}/>
            <div className={"flex w-full justify-start gap-4 items-center my-4 flex-col sm:flex-row "}>
                <RangeDate onChange={setParams} value={params}/>
                <div className="flex items-center mb-4 justify-center gap-2">
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={checked} onChange={
                            (e) => {
                                setChecked(e.target.checked)
                            }
                        } className="sr-only peer"/>
                        <div
                            className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">Planificado</span>
                    </label>

                </div>
            </div>

            {openPage ? <KPI/> : <Cost/>}
        </div>


    </Layout>);
};

export default BusinessIntelligence;
