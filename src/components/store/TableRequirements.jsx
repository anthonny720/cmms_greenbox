import React from "react";
import {TrashIcon} from "@heroicons/react/24/outline";
import {useSelector} from "react-redux";
import Skeleton from "react-loading-skeleton";

const TableRequirements = ({data, remove, update}) => {
    const me = useSelector(state => state.Auth.user)


    const columns = ['', 'Estado', 'Solicitante', 'Fecha', 'Producto', 'Descripción', 'Tipo de trabajo', 'Cantidad', 'U.M.'];

    return (<table className="w-full rounded-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 bg-white">
        <tr className="w-max rounded-lg wg-white">
            {columns.map((column, index) => (<th key={index} className="px-6 font-medium text-center">
                {column}
            </th>))}
        </tr>
        </thead>
        <tbody>
        {data ? (data.map((item, index) => (<tr
            key={index}
            className="bg-white border-b hover:bg-[#4687f1] hover:bg-opacity-10"
        >
            <td className="py-2 px-4 text-center text-xs font-light ">
                {me?.permissions === 'EDITOR' && (me?.role === 'P' || me?.role === 'B') ? (
                    <TrashIcon onClick={() => remove(item)}
                               className="w-5 p-0.5 text-red-400 cursor-pointer bg-red-500 bg-opacity-10 rounded-full"/>) : (
                    <button
                        disabled={true}
                        className="w-5 p-0.5 text-red-400 bg-red-500 bg-opacity-10 rounded-full cursor-not-allowed">
                        <TrashIcon/>
                    </button>)}
            </td>
            <td className={'py-2 px-4 text-center text-xs font-light flex justify-center'}>
                <p className={`p-2 text-center text-xs font-bold rounded-lg w-max bg-opacity-10 ${item?.status === "Pendiente" ? "bg-blue-400 text-blue-400" : item?.status === "Aprobado" ? "bg-green-400 text-green-400" : item?.status === "Rechazado" ? "bg-red-400 text-red-400" : item?.status === "Parcial" ? "bg-yellow-400 text-yellow-400" : item?.status === "Finalizado" ? "bg-gray-400 text-gray-400" : "bg-gray-400 text-gray-400"}`}>
                    {item?.status}
                </p>

            </td>
            <td className="py-2 px-4 text-center text-xs font-light ">{item?.user_name}</td>
            <td className="py-2 px-4 text-center text-xs font-light ">{new Date(item?.date).toLocaleDateString('es-PE', {
                year: 'numeric', month: 'numeric', day: 'numeric', timeZone: 'UTC'
            })}</td>
            <td className="py-2 px-4 text-center text-xs font-light hover:text-blue-400 hover:font-bold cursor-pointer capitalize"
                onClick={() => me?.permissions === "EDITOR" && (me?.role === "P" || me?.role === "S" || me?.role === 'B') && update(item)}>
                {item?.product}
            </td>
            <td className="py-2 px-4 text-center text-xs font-light capitalize">
                {item?.description}
            </td>
            <td className="py-2 px-4 text-center text-xs font-light capitalize">
                {item?.work}
            </td>
            <td className="py-2 px-4 text-center text-xs font-light ">
                {item?.quantity}
            </td>
            <td className="py-2 px-4 text-center text-xs font-light uppercase">
                {item?.unit_measurement}
            </td>
        </tr>))) : (<tr>
            {columns.map((column, index) => (<td key={index} className="py-2 px-4 text-center text-xs font-light">
                <Skeleton className="bg-red-500" count={10}/>
            </td>))}
        </tr>)}
        </tbody>
    </table>);
};
export default TableRequirements;