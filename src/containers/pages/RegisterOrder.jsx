import React, {useEffect, useState} from 'react';
import Layout from "../../hocs/Layout";
import FormTasks from "../../components/workOrder/FormTasks";
import Modal from "../../components/util/Modal";
import {useDispatch, useSelector} from "react-redux";
import {get_works} from "../../redux/actions/management";
import DocumentViewer from "../../components/workOrder/Document";
import ModalHook from "../../components/util/hooks";
import RangeDate from "../../components/util/RangeDate";
import TableRegister from "../../components/graphics/TableRegister";
import {map} from "lodash";
import FormSupervisor from "../../components/workOrder/FormSupervisor";
import Header from "../../components/navigation/Header";
import DownloadOT from "../../components/workOrder/DownloadOT";
import {ArrowDownTrayIcon} from "@heroicons/react/24/outline";


const RegisterOrder = () => {
    const dispatch = useDispatch()
    const work = useSelector(state => state.Management.works)
    const physical = useSelector(state => state.Assets.physical)
    const users = useSelector(state => state.Auth.users)
    const types = useSelector(state => state.Configuration.types)


    // Filter state
    const [params, setParams] = useState()
    const [filt, setFilter] = useState({
        'planned': false, 'user': null, 'type': null, 'physical': null
    })

    const [filterParams, setFilterParams] = useState({
        'date_start': params ? new Date(params?.[0]).toLocaleDateString('es-PE', {timeZone: 'UTC'}) : '',
        'date_end': params ? new Date(params?.[1]).toLocaleDateString('es-PE', {timeZone: 'UTC'}) : '',
        'physical': filt.physical,
        'type': filt.type,
        'user': filt.user,
        'planned': filt.planned
    });

    /*Modal*/
    const {content, setContent, isOpen, setIsOpen, openModal} = ModalHook();

    const handleUpdateTask = (data) => {
        setIsOpen(true)
        setContent(<FormTasks params={filterParams} id={data.id} close={openModal} data={data}/>)
    }
    const handleValidatedSupervisor = (data) => {

        setIsOpen(true)
        setContent(
            <FormSupervisor params={filterParams} data={data} close={openModal}/>)
    }

    const handleViewTask = (data) => {
        setIsOpen(true)
        setContent(<div className={"h-full md:h-screen"}><DocumentViewer data={data}/></div>)
    }
    const handleDownloadTask = () => {
        setIsOpen(true)
        setContent(<div className={"h-full md:h-screen"}><DownloadOT
            item={work && work.filter((item) => item?.status === true)}/></div>)
    }


    useEffect(() => {
        const data = {
            'date_start': params ? new Date(params?.[0]).toLocaleDateString('es-PE', {timeZone: 'UTC'}) : '',
            'date_end': params ? new Date(params?.[1]).toLocaleDateString('es-PE', {timeZone: 'UTC'}) : '',
            'physical': filt.physical,
            'type': filt.type,
            'user': filt.user,
            'planned': filt.planned
        }
        setFilterParams(data)
        dispatch(get_works(data))
    }, [params, filt]);


    return (<Layout>
            <Modal isOpen={isOpen} close={openModal} children={content}/>

            <div className={"h-full  overflow-y-auto scrollbar-hide w-full bg-white p-4 rounded-l-2xl"}>
                <Header/>
                <ArrowDownTrayIcon className={"h-6 w-6 text-blue-400 cursor-pointer absolute right-4 bottom-4"}
                                   onClick={() => handleDownloadTask()}/>
                <div className={"w-full grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 flex items-center"}>
                    <div className={""}>
                        <RangeDate w={true} onChange={setParams} value={params}/>

                    </div>

                    <div>
                        <select onChange={(value) => setFilter({...filt, 'physical': value.target.value})}
                                value={filt.physical}
                                className={`z-[100] rounded-2xl bg-white w-full text-gray-400 text-xs p-1 mb-2  flex flex-col border-2 border-blue-400`}
                        >
                            <option value={''}>{"Equipo"}</option>
                            {map(physical, (item, index) => {
                                return <option key={index} value={item.id}>{item.name}</option>
                            })}
                        </select>
                    </div>
                    <div>
                        <select onChange={(value) => setFilter({...filt, 'type': value.target.value})}
                                value={filt.type}
                                className={`z-[100] rounded-2xl bg-white w-full text-gray-400 text-xs p-1 mb-2  flex flex-col border-2 border-blue-400`}
                        >
                            <option value={''}>{"Tipo de mantenimiento"}</option>
                            {map(types, (item, index) => {
                                return <option key={index} value={item.id}>{item.name}</option>
                            })}
                        </select>
                    </div>
                    <div>
                        <select onChange={(value) => setFilter({...filt, 'user': value.target.value})}
                                value={filt.user}
                                className={`z-[100] rounded-2xl bg-white w-full text-gray-400 text-xs p-1 mb-2  flex flex-col border-2 border-blue-400`}
                        >
                            <option value={''}>{"Técnico/Operario"}</option>
                            {map(users.filter((user) => (user?.role === 'T' || user?.role === 'O')), (item, index) => {
                                return <option key={index} value={item?.id}>{item?.first_name}</option>
                            })}
                        </select>
                    </div>
                    <div className="flex items-center mb-4 justify-center gap-2 mt-2 w-max">
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={filt.planned} onChange={
                                (e) => {
                                    setFilter({...filt, 'planned': e.target.checked})
                                }
                            } className="sr-only peer"/>
                            <div
                                className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                            <span
                                className="ml-3 text-gray-400 text-xs">Planificado</span>
                        </label>
                    </div>


                </div>
                <div className={"w-full overflow-auto scrollbar-hide"}>
                    <TableRegister data={work && work.filter((item) => item?.status === true)} view={handleViewTask}
                                   validated={handleValidatedSupervisor}
                                   update={handleUpdateTask}/>
                </div>

            </div>

        </Layout>
    );
};

export default RegisterOrder;
