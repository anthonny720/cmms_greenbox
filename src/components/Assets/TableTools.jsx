import Skeleton from "react-loading-skeleton";
import {map, size} from "lodash";
import React from "react";
import {TrashIcon} from "@heroicons/react/24/outline";
import {useDispatch, useSelector} from "react-redux";
import {setAlert} from "../../redux/actions/alert";

const TableTools = ({data, update, columns, remove}) => {
    const dispatch = useDispatch()
    const me = useSelector(state => state.Auth.user)

    return (<table className="w-full rounded-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 bg-white">
        <tr className="w-max rounded-lg wg-white">
            {map(columns, (column, index) => (<th key={index} className="px-6 font-medium
                   text-center">{column}</th>))}
        </tr>
        </thead>
        <tbody>

        {data !== null && size(data) > 0 ? map(data, (item, index) => (
            <tr key={index} className="bg-white border-b hover:bg-[#4687f1] hover:bg-opacity-10">

                <td className="py-2 px-4 text-center text-xs font-light">
                    {(me?.role === 'P' || me?.role === 'B') ? (
                        <TrashIcon onClick={() => remove(item)}
                                   className="w-5 p-0.5 text-red-400 bg-red-500 bg-opacity-10 rounded-full"/>) : (
                        <button
                            disabled={true}
                            className="w-5 p-0.5 text-red-400 bg-red-500 bg-opacity-10 rounded-full cursor-not-allowed">
                            <TrashIcon/>
                        </button>)}
                </td>
                <td className=" py-2 px-4 text-center text-xs font-light  cursor-pointer hover:text-blue-400 hover:font-bold"
                    onClick={() => (me?.role === "B" || me?.role === "P") ? update(item) : dispatch(setAlert("No tienes permisos para realizar esta accion", "error"))}>{item?.name}</td>
                <td className=" py-2 px-4 text-center text-xs font-light  ">{item?.description}</td>
                <td className=" py-2 px-4 text-center text-xs font-light  ">{item?.model}</td>
                <td className=" py-2 px-4 text-center text-xs font-light  ">{item?.maker}</td>

            </tr>)) : <tr>
            {columns.map((column, index) => (<td key={index} className="py-2 px-4 text-center text-xs font-light">
                <Skeleton className="bg-red-500" count={10}/>
            </td>))}
        </tr>}

        </tbody>
    </table>);
};
export default TableTools;