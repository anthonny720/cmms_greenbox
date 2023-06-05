import React, {useEffect, useState} from 'react';
import Layout from "../../hocs/Layout";
import Table from "../../components/storage/Table";
import {useDispatch, useSelector} from "react-redux";
import {delete_file, get_files} from "../../redux/actions/assets";
import {MySwal} from "../../helpers/util";
import Modal from "../../components/util/Modal";
import FormStorage from "../../components/storage/FormStorage";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlusSquare} from "@fortawesome/free-solid-svg-icons";
import SearchBar from "../../helpers/SearchBar";
import ModalHook from "../../components/util/hooks";
import ButtonAdd from "../../components/util/ButtonAdd";
import Header from "../../components/navigation/Header";

const Storage = () => {
    const dispatch = useDispatch()
    const files = useSelector(state => state.Assets.files)
    const [params, setParams] = useState({name: ''});

    /*Modal*/
    const {content, setContent, isOpen, setIsOpen, openModal} = ModalHook();

    const handleOpenModalViewer = (doc) => {
        setIsOpen(true)
        setContent(<iframe className={"h-full w-full"} title={"Guias"}
                           src={`https://docs.google.com/viewerng/viewer?url=${process.env.REACT_APP_API_URL + doc}&embedded=true`}></iframe>)
    }

    const handleAddFile = () => {
        setIsOpen(true)
        setContent(<FormStorage close={openModal}/>)
    }
    const handleDeleteFile = (data) => {
        MySwal.fire({
            title: '¿Desea eliminar este documento?',
            icon: 'warning',
            showCancelButton: true,
            cancelButtonColor: '#7DABF5',
            confirmButtonColor: '#F87171',
            confirmButtonText: 'Eliminar'
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(delete_file(data.id))

            }
        })
    }
    useEffect(() => {
        dispatch(get_files(params))
    }, []);

    return (<Layout>
        <ButtonAdd>
            <button onClick={() => handleAddFile()}
                    className={"text-xs space-x-4 border-b-2  flex items-center p-2 justify-around font-light hover:bg-opacity-10 hover:rounded-lg hover:bg-[#5f9cf4]"}>
                <FontAwesomeIcon className={"text-[#4687f1] bg-white rounded-full"}
                                 size={"2x"} icon={faPlusSquare}/>
                <p className={"text-[#4687f1] font-semibold"}>Añadir</p>
            </button>
        </ButtonAdd>


        <Modal isOpen={isOpen} close={openModal} children={content}/>

        <div className={"h-full overflow-y-auto scrollbar-hide w-full bg-white p-4 rounded-l-2xl"}>
            <Header/>
            <SearchBar action={get_files} setParams={setParams}/>
            <div className={"w-full overflow-auto scrollbar-hide"}>
                <Table data={files} remove={handleDeleteFile} viewer={handleOpenModalViewer}/>
            </div>
        </div>
    </Layout>);
};

export default Storage;
