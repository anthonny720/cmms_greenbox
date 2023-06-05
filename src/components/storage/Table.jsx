import Skeleton from "react-loading-skeleton";
import {map, size} from "lodash";
import React from "react";
import {TrashIcon} from "@heroicons/react/24/outline";
import {useDispatch, useSelector} from "react-redux";

const Table = ({data, remove, viewer}) => {
    const dispatch = useDispatch()
    const me = useSelector(state => state.Auth.user)
    const columns = [' ', 'Nombre', 'Tamaño', 'Fecha de creación',];

    return (<table className="w-full rounded-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 bg-white">
        <tr className="w-max rounded-lg wg-white px-4 whitespace-wrap">
            {map(columns, (column, index) => (<th key={index} className="px-6 font-medium
                   text-center">{column}</th>))}
        </tr>
        </thead>
        <tbody>


        {data !== null && size(data) > 0 ? map(data, (item, index) => (

            <tr key={index} className="bg-white border-y hover:bg-[#4687f1] hover:bg-opacity-10 ">
                <td className="py-2 px-4 text-center text-xs font-light">
                    {me?.permissions === 'EDITOR' && (me?.role === 'P' || me?.role === 'B') ? (
                        <TrashIcon onClick={() => remove(item)}
                                   className="w-5 p-0.5 text-red-400 bg-red-500 bg-opacity-10 rounded-full cursor-pointer"/>) : (
                        <button
                            disabled={true}
                            className="w-5 p-0.5 text-red-400 bg-red-500 bg-opacity-10 rounded-full cursor-not-allowed">
                            <TrashIcon/>
                        </button>)}
                </td>
                <td className="py-2 whitespace-wrap px-4 text-center text-xs font-light cursor-pointer hover:text-blue-400 hover:font-bold"
                    onClick={() => viewer(item?.file)}>{item?.file?.split('/')[3]}</td>
                <td className="py-2 px-4 text-center text-xs font-light ">{item?.size}</td>
                <td className="py-2 px-4 text-center text-xs font-light ">{new Date(item?.created_at).toLocaleDateString('es-PE', {
                    timeZone: 'UTC', year: 'numeric', month: 'long', day: 'numeric'
                })}</td>
            </tr>)) : <tr>
            {map(columns, (column, index) => (

                <th key={index} className="px-6 py-3 text-center"><Skeleton className={"bg-red-500"} count={10}/>
                </th>))}
        </tr>}

        </tbody>
    </table>)

};
export default Table;