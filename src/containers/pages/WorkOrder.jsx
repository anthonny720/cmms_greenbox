import React, {useEffect, useState} from 'react';
import Layout from "../../hocs/Layout";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faHourglass, faPlusSquare} from "@fortawesome/free-solid-svg-icons";
import FormTasks from "../../components/workOrder/FormTasks";
import Modal from "../../components/util/Modal";
import {useDispatch, useSelector} from "react-redux";
import {get_physical, get_tools} from "../../redux/actions/assets";
import {get_failures, get_types} from "../../redux/actions/config";
import {get_users} from "../../redux/actions/auth";
import {delete_work, get_works} from "../../redux/actions/management";
import {MySwal} from "../../helpers/util";
import DocumentViewer from "../../components/workOrder/Document";
import FormResourcesOrder from "../../components/workOrder/FormResourcesOrder";
import {get_articles} from "../../redux/actions/store";
import ButtonAdd from "../../components/util/ButtonAdd";
import Card from "../../components/workOrder/Card";
import ModalHook from "../../components/util/hooks";
import RangeDate from "../../components/util/RangeDate";
import FormHelpersOrder from "../../components/workOrder/FormHelpersOrder";
import Header from "../../components/navigation/Header";


const WorkOrder = () => {
    const dispatch = useDispatch()
    const work = useSelector(state => state.Management.works)


    // Filter state
    const [params, setParams] = useState()

    /*Modal*/
    const {content, setContent, isOpen, setIsOpen, openModal} = ModalHook();

    const handleAddTask = () => {
        setIsOpen(true)
        const filter = {
            'date_start': params ? new Date(params?.[0]).toLocaleDateString('es-PE', {timeZone: 'UTC'}) : '',
            'date_end': params ? new Date(params?.[1]).toLocaleDateString('es-PE', {timeZone: 'UTC'}) : ''
        }
        setContent(<FormTasks close={openModal} params={filter}/>)
    }
    const handleViewTask = (data) => {
        setIsOpen(true)
        setContent(<div className={"h-full md:h-screen"}><DocumentViewer data={data}/></div>)
    }
    const handleUpdateTask = (data) => {
        setIsOpen(true)
        const filter = {
            'date_start': params ? new Date(params?.[0]).toLocaleDateString('es-PE', {timeZone: 'UTC'}) : '',
            'date_end': params ? new Date(params?.[1]).toLocaleDateString('es-PE', {timeZone: 'UTC'}) : ''
        }
        setContent(<FormTasks params={filter} id={data.id} close={openModal} data={data}/>)
    }

    const handleUpdateResource = (id) => {
        setIsOpen(true)
        const filter = {
            'date_start': params ? new Date(params?.[0]).toLocaleDateString('es-PE', {timeZone: 'UTC'}) : '',
            'date_end': params ? new Date(params?.[1]).toLocaleDateString('es-PE', {timeZone: 'UTC'}) : ''
        }
        setContent(<FormResourcesOrder close={openModal} id={id} params={filter}/>)
    }

    const handleUpdateHelpers = (id) => {
        setIsOpen(true)
        const filter = {
            'date_start': params ? new Date(params?.[0]).toLocaleDateString('es-PE', {timeZone: 'UTC'}) : '',
            'date_end': params ? new Date(params?.[1]).toLocaleDateString('es-PE', {timeZone: 'UTC'}) : ''
        }
        setContent(<FormHelpersOrder close={openModal} id={id} params={filter}/>)
    }

    const handleDeleteWork = (data) => {
        MySwal.fire({
            title: '¿Desea eliminar esta OT?',
            icon: 'warning',
            showCancelButton: true,
            cancelButtonColor: '#7DABF5',
            confirmButtonColor: '#F87171',
            confirmButtonText: 'Eliminar'
        }).then((result) => {
            const filter = {
                'date_start': params ? new Date(params?.[0]).toLocaleDateString('es-PE', {timeZone: 'UTC'}) : '',
                'date_end': params ? new Date(params?.[1]).toLocaleDateString('es-PE', {timeZone: 'UTC'}) : ''
            }
            if (result.isConfirmed) {
                dispatch(delete_work(data.id, filter))
            }
        })
    }
    useEffect(() => {
        dispatch(get_physical())
        dispatch(get_tools())
        dispatch(get_types())
        dispatch(get_failures())
        dispatch(get_users())
        dispatch(get_articles())
    }, []);

    useEffect(() => {
        const data = {
            'date_start': params ? new Date(params?.[0]).toLocaleDateString('es-PE', {timeZone: 'UTC'}) : '',
            'date_end': params ? new Date(params?.[1]).toLocaleDateString('es-PE', {timeZone: 'UTC'}) : ''
        }
        dispatch(get_works(data))
    }, [params]);


    return (<Layout>
            <Modal isOpen={isOpen} close={openModal} children={content}/>


            <ButtonAdd>
                <button type={"button"} onClick={() => handleAddTask()}
                        className={"text-xs space-x-4 border-b-2  flex items-center p-2 justify-around font-light hover:bg-opacity-10 hover:rounded-lg hover:bg-[#5f9cf4]"}>
                    <FontAwesomeIcon className={"text-[#4687f1] bg-white rounded-full"}
                                     size={"2x"} icon={faPlusSquare}/>
                    <p className={"text-[#4687f1] font-semibold"}>Añadir</p>
                </button>
            </ButtonAdd>
            <div className={"h-full overflow-y-auto scrollbar-hide w-full bg-white p-4 rounded-l-2xl"}>
                <Header/>
                <div className={"flex w-full justify-start gap-4 items-center my-4"}>
                    <RangeDate onChange={setParams} value={params}/>

                </div>

                <div
                    className="grid grid-cols-1 lg:grid-cols-2 lg:space-x-12 lg:p-6    w-full h-screen scrollbar-hide overflow-y-auto  ">


                    {/*earring*/}
                    <div className={"mt-4  "}>
                        <div className={"flex items-center bg-white w-full p-2 rounded-xl border border-gray-200 "}>
                            <FontAwesomeIcon className={"text-red-400 bg-red-600 bg-opacity-10 p-2 rounded-full "}
                                             icon={faHourglass}/>
                            <span className={"text-red-400 font-normal text-sm p-2"}>Tareas pendientes</span>
                        </div>
                        <Card work={work && work.filter((item) => item?.status === false)}
                              action_delete={handleDeleteWork}
                              action_view={handleViewTask}
                              action_update_order={handleUpdateTask} action_update={handleUpdateResource}/>


                    </div>

                    {/*finished*/}
                    <div className={"mt-4"}>
                        <div className={"flex items-center bg-white w-full p-2 rounded-xl border border-gray-200 "}>
                            <FontAwesomeIcon
                                className={"text-green-400 bg-green-600 bg-opacity-10 p-2 rounded-full z-10"}
                                icon={faCheck}/>
                            <span className={"text-green-400 font-normal text-sm p-2"}>Tareas finalizadas</span>
                        </div>
                        <Card work={work && work.filter((item) => item?.status === true)}
                              action_delete={handleDeleteWork}
                              action_view={handleViewTask}
                              action_update_order={handleUpdateTask} action_update={handleUpdateResource}
                              action_helpers={handleUpdateHelpers}/>
                    </div>

                </div>
            </div>

        </Layout>
    );
};

export default WorkOrder;
