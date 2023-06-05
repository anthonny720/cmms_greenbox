import React, {useEffect, useState} from 'react';
import Layout from "../../hocs/Layout";
import {useDispatch, useSelector} from "react-redux";
import {delete_requirements, get_requirements} from "../../redux/actions/store";
import TableRequirements from "../../components/store/TableRequirements";
import Modal from "../../components/util/Modal";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlusSquare} from "@fortawesome/free-solid-svg-icons";
import FormRequirements from "../../components/store/FormRequirements";
import {MySwal} from "../../helpers/util";
import DocumentViewerRequirement from "../../components/store/Document";
import ModalHook from "../../components/util/hooks";
import ButtonAdd from "../../components/util/ButtonAdd";
import RangeDate from "../../components/util/RangeDate";
import {DocumentIcon} from "@heroicons/react/24/outline";
import Header from "../../components/navigation/Header";

const Requirements = () => {
    const requirements = useSelector(state => state.Store.requirements)
    const dispatch = useDispatch()
    // Filter state
    const [params, setParams] = useState()

    /*Modal*/
    const {content, setContent, isOpen, setIsOpen, openModal} = ModalHook();

    const handleAddRequirement = () => {
        setIsOpen(true)
        setContent(<FormRequirements close={openModal}/>)
    }
    const handleUpdateRequirement = (data) => {
        setIsOpen(true)
        setContent(<FormRequirements data={data} close={openModal}/>)
    }
    const handleDeleteRequirement = (data) => {
        MySwal.fire({
            title: '¿Desea eliminar este requerimiento?',
            icon: 'warning',
            showCancelButton: true,
            cancelButtonColor: '#7DABF5',
            confirmButtonColor: '#F87171',
            confirmButtonText: 'Eliminar'
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(delete_requirements(data.id))

            }
        })
    }


    useEffect(() => {
        const filter = {
            'date_start': params?.[0] ? new Date(params?.[0]).toLocaleDateString('es-PE', {
                year: 'numeric', month: 'numeric', day: 'numeric', timeZone: 'America/Lima'
            }) : '', 'date_end': params?.[1] ? new Date(params?.[1]).toLocaleDateString('es-PE', {
                year: 'numeric', month: 'numeric', day: 'numeric', timeZone: 'America/Lima'
            }) : ''
        };
        dispatch(get_requirements(filter))
    }, [dispatch, params]);

    const handleViewTask = () => {
        setIsOpen(true)
        setContent(<div className={"h-full md:h-screen"}><DocumentViewerRequirement data={requirements}/></div>)
    }


    return (<Layout>
        <Modal isOpen={isOpen} close={openModal} children={content}/>


        <ButtonAdd>
            <button onClick={() => handleAddRequirement()}
                    className={"text-xs space-x-4 border-b-2  flex items-center p-2 justify-around font-light hover:bg-opacity-10 hover:rounded-lg hover:bg-[#5f9cf4]"}>
                <FontAwesomeIcon className={"text-[#4687f1] bg-white rounded-full"}
                                 size={"2x"} icon={faPlusSquare}/>
                <p className={"text-[#4687f1] font-semibold"}>Añadir</p>
            </button>
        </ButtonAdd>

        <div className={"h-full overflow-y-auto scrollbar-hide w-full bg-white p-4 rounded-l-2xl"}>
            <Header/>
            <div className={"flex justify-start gap-4 items-center mb-4"}>
                <RangeDate onChange={setParams} value={params}/>
                <DocumentIcon onClick={handleViewTask}
                              className={"h-6 w-6 mb-2 text-black hover:text-blue-400 cursor-pointer"}/>
            </div>

            <div className={"w-full overflow-auto scrollbar-hide"}>
                <TableRequirements data={requirements} update={handleUpdateRequirement}
                                   remove={handleDeleteRequirement}/>
            </div>
        </div>
    </Layout>);
};

export default Requirements;
