import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {get_articles} from "../../redux/actions/store";
import SearchBar from "../../helpers/SearchBar";
import {filter, map, size} from "lodash";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlusCircle} from "@fortawesome/free-solid-svg-icons";
import Skeleton from "react-loading-skeleton";
import {add_resource_ot, delete_resource_ot} from "../../redux/actions/management";
import {TrashIcon} from "@heroicons/react/20/solid";
import HeaderForm from "../util/HeaderForm";


const FormResourcesOrder = ({id, close, params}) => {
    const articles = useSelector(state => state.Store.articles)
    const work = useSelector(state => state.Management.works)
    const info = filter(work, (item) => item.id === id)[0]

    const dispatch = useDispatch()

    const [filt, setFilter] = useState({'name': ''});

    useEffect(() => {
        dispatch(get_articles(filt))
    }, [filt]);


    const handleSubmit = (values) => {
        dispatch(add_resource_ot({'article': values}, id, params))
    }
    const handleDelete = (id) => {
        dispatch(delete_resource_ot(id, params))
    }

    const columns = ['', 'Artículo', 'Cantidad', 'Precio'];
    return (<div className="bg-white   px-2  pb-8 mb-4  ">
        <HeaderForm close={close}/>
        <div className={"h-40 overflow-y-auto scrollbar-hide"}>
            <table className="w-full rounded-full text-sm text-left text-gray-500  relative ">
                <thead className="text-xs text-gray-700  bg-white w-max ">

                <tr className={"w-max rounded-lg wg-white sticky "}>
                    {map(columns, (column, index) => (<th key={index} className="px-6 font-medium
                   text-center">{column}</th>))}
                </tr>
                </thead>
                <tbody>


                {info ? map(info?.resources_used, (row, index) => (

                    <tr key={index} className="bg-white border-y hover:bg-[#4687f1] hover:bg-opacity-10 ">

                        <td className="py-2 text-center text-xs font-light ">
                            <TrashIcon onClick={() => handleDelete(row?.id)}
                                       className={"text-red-400 cursor-pointer w-4 h-4 bg-red-600 bg-opacity-10 p-0.5 rounded-full"}/>
                        </td>
                        <td className="py-2 text-center text-xs font-light ">{row?.name}</td>
                        <td className="py-2 text-center text-xs font-light ">{row?.quantity}</td>
                        <td className="py-2 text-center text-xs font-light ">{row?.price}</td>

                    </tr>)) : <tr>
                    {map(columns, (column, index) => (

                        <th key={index} className="px-6 py-3 text-center"><Skeleton className={"bg-red-500"}
                                                                                    count={10}/>
                        </th>))}
                </tr>}

                </tbody>
            </table>
        </div>

        <hr className={"bg-gray-500 my-2"}/>
        <form className={`grid grid-cols-1 gap-2`}>
            <SearchBar setParams={setFilter}/>

            <div className="h-20  overflow-y-auto scrollbar-hide">
                {articles !== null && size(articles) > 0 && map(articles, (row, index) => {
                        return (
                            <p className={"text-black p-2 font-sans text-xs space-x-2 hover:bg-blue-600 hover:bg-opacity-10"}
                               key={row?.id}><FontAwesomeIcon icon={faPlusCircle}
                                                              onClick={(e) => handleSubmit(row?.id)}
                                                              className={"text-green-500 cursor-pointer"}/><span>{row?.description}</span>
                            </p>
                        )
                    }
                )}
            </div>


        </form>


    </div>);
};


export default FormResourcesOrder;
