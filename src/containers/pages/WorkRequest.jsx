import React, {useEffect, useState} from 'react';
import Layout from "../../hocs/Layout";
import SearchBar from "../../helpers/SearchBar";
import {get_physical} from "../../redux/actions/assets";
import Table from "../../components/workRequest/Table";
import FormRequest from "../../components/workRequest/FormRequest";
import {PencilIcon, XMarkIcon} from "@heroicons/react/20/solid";
import {get_work_request} from "../../redux/actions/management";
import {useDispatch, useSelector} from "react-redux";
import Modal from "../../components/util/Modal";
import FormOT from "../../components/workRequest/FormOT";
import ModalHook from "../../components/util/hooks";
import Header from "../../components/navigation/Header";

const WorkRequest = () => {
    const request = useSelector(state => state.Management.work_request)


    /*Modal*/
    const {content, setContent, isOpen, setIsOpen, openModal} = ModalHook();

    const [isOpen2, setIsOpen2] = useState(false);
    const openForm2 = () => {
        setIsOpen2((prev) => !prev)
    }


    const dispatch = useDispatch();
    const [params, setParams] = useState({name: ''});


    useEffect(() => {
        dispatch(get_physical())
        dispatch(get_work_request(params))
    }, []);

    const handleAddOT = (data) => {
        setIsOpen(true)
        setContent(<FormOT data={data} close={openModal}/>)
    }

    return (<Layout>
        <Modal isOpen={isOpen} close={openModal} children={content}/>
        <button title={"Añadir"}
                className={"absolute z-30 right-2 bottom-4 h-14 w-14 rounded-full bg-[#4687f1] text-lg"}>
            {isOpen2 ? <XMarkIcon className={"text-white rounded-full bg-red-400 "} onClick={() => openForm2()}/> :
                <PencilIcon className={"text-white rounded-full bg-blue-400 p-2"} onClick={() => openForm2()}/>}
        </button>


        <div className={"h-full overflow-y-auto scrollbar-hide w-full bg-white p-4 rounded-l-2xl"}>
            <Header/>
            <SearchBar action={get_work_request} setParams={setParams}/>
            {isOpen2 ? <FormRequest close={openForm2}/> : null}
            <div className={"w-full overflow-auto scrollbar-hide"}>
                <Table data={request} add={handleAddOT}/>
            </div>
        </div>

    </Layout>);
};

export default WorkRequest;
