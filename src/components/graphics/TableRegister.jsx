import React from 'react';
import {map, size} from "lodash";
import Humanize from "humanize-plus";
import {DocumentIcon} from "@heroicons/react/24/outline";
import {CheckCircleIcon, XCircleIcon} from "@heroicons/react/24/solid";

const TableRegister = ({data, view, validated, update}) => {

    const columns = [' ', 'Fecha', 'Origen de falla', 'Tipo de mantenimiento', 'Equipo', 'Descripción', 'Costo']

    return (<table className="w-full rounded-full text-sm text-left text-gray-500 ">
        <thead className="text-xs text-gray-700 bg-white w-max">
        <tr className="w-max  rounded-lg bg-white">
            {map(columns, (column, index) => (<th key={index} className="px-2  font-medium  whitespace-wrap
                   text-center">{column}</th>))}
        </tr>
        </thead>
        <tbody>
        {data && size(data) > 0 && map(data, (row, index) => {
            return (<tr className="border-gray-300 border-b" key={index}>
                <td className=" w-max text-sm whitespace-no-wrap text-gray-800 tracking-normal leading-4">
                    <div className={"flex flex-row"}>
                        <DocumentIcon onClick={() => view(row)}
                                      className={`w-5 h-5 text-gray-500  hover:text-blue-400 cursor-pointer`}/>
                        {row?.validated ? <CheckCircleIcon onClick={() => validated(row)}
                                                           className={`w-5 h-5 text-green-400  hover:text-green-600 cursor-pointer`}/> :
                            <XCircleIcon onClick={() => validated(row)}
                                         className={`w-5 h-5 text-red-400  hover:text-red-600 cursor-pointer`}/>}


                    </div>
                </td>
                <td className="py-2 px-2 text-center text-xs font-light">
                    <div onClick={() => update(row)}
                         className={"flex flex-col hover:text-blue-400 cursor-pointer hover:font-bold whitespace-nowrap"}>
                        <p className={"w-full "}>
                            {new Date(row?.date_start).toLocaleDateString('es-PE', {
                                timeZone: 'America/Lima',
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true
                            })}
                        </p>
                        <p>
                            {new Date(row?.date_finish).toLocaleDateString('es-PE', {
                                timeZone: 'America/Lima',
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true
                            })}
                        </p>

                    </div>

                </td>
                <td className="py-2 px-2 text-center text-xs font-light">{row?.failure_name}</td>
                <td className="py-2 px-2 text-center text-xs font-light">{row?.type_name}</td>
                <td className="py-2 px-2 text-center text-xs font-light">{row?.physical_name}</td>
                <td className="py-2 px-2 text-center text-xs font-light">
                    {row?.description}
                </td>
                <td className="py-2 px-2 text-center text-xs font-light"> S/{Humanize.formatNumber(row?.cost, 2)}</td>

            </tr>)
        })}


        </tbody>
    </table>);
};

export default TableRegister;