import React, {useEffect, useState} from 'react';
import Layout from "../../hocs/Layout";
import Filter from "./Filter";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlusSquare} from "@fortawesome/free-solid-svg-icons";
import FormEquipments from "./FormEquipments";
import {useDispatch, useSelector} from "react-redux";
import {delete_physical, get_fixed, get_physical} from "../../redux/actions/assets";
import TableEquipments from "./TableEquipments";
import {MySwal} from "../../helpers/util";
import SearchBar from "../../helpers/SearchBar";
import ModalHook from "../util/hooks";
import ButtonAdd from "../util/ButtonAdd";

const Equipments = () => {
    const physical = useSelector(state => state.Assets.physical)
    const dispatch = useDispatch()
    const columns = ['', 'Fecha de compra', 'Nombre', 'Modelo', 'Ubicación', 'Imagen', 'Criticidad']
    let [isOpenPage, setIsOpenPage] = useState(true)
    const [params, setParams] = useState({name: ''});

    /*Modal*/
    const {content, setContent} = ModalHook();


    useEffect(() => {
        dispatch(get_fixed())
    }, [])

     useEffect(() => {
        dispatch(get_physical(params))
    }, [params])


    const handleAddEquipments = () => {
        setIsOpenPage(false)
        setContent(<FormEquipments close={ChangePage}/>)
    }
    const handleUpdateEquipments = (data) => {
        setIsOpenPage(false)
        setContent(<FormEquipments data={data} close={ChangePage}/>)
    }

    const handleDeleteEquipments = (data) => {
        MySwal.fire({
            title: '¿Desea eliminar este activo?',
            icon: 'warning',
            showCancelButton: true,
            cancelButtonColor: '#7DABF5',
            confirmButtonColor: '#F87171',
            confirmButtonText: 'Eliminar'
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(delete_physical(data.id))
            }
        })
    }

    const ChangePage = () => {
        setIsOpenPage((prev) => !prev)

    }
    return (<Layout>
        {isOpenPage && <ButtonAdd>
            <button onClick={() => {
                ChangePage()
                handleAddEquipments()
            }}
                    className={"text-xs space-x-4 border-b-2  flex items-center p-2 justify-around font-light hover:bg-opacity-10 hover:rounded-lg hover:bg-[#5f9cf4]"}>
                <FontAwesomeIcon className={"text-[#4687f1] bg-white rounded-full"}
                                 size={"2x"} icon={faPlusSquare}/>
                <p className={"text-[#4687f1] font-semibold"}>Añadir</p>
            </button>
        </ButtonAdd>}


        {isOpenPage ? <>
            <div className={"h-full overflow-y-auto scrollbar-hide w-full bg-white p-4 rounded-l-2xl"}>
                <SearchBar setParams={setParams} />
                <Filter/>
                <TableEquipments columns={columns} data={physical} remove={handleDeleteEquipments}
                                 update={handleUpdateEquipments}/>
            </div>


        </> : content}

    </Layout>);
};

export default Equipments;
