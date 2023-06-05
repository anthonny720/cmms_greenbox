import React from 'react';
import {map, size} from "lodash";
import {useSelector} from "react-redux";

const Table = () => {
    const total_days = useSelector(state => state.Graphics.total_days)

    return (<table className="w-full rounded-full text-sm text-left text-gray-500 ">
        <thead className="text-xs text-gray-700 bg-white">
        <tr className={"w-max  bg-opacity-10 bg-blue-400  rounded-l-md "}>
            <th className={"w-max text-xs font-bold text-center text-[#4687f1] whitespace-nowrap "}>Personal</th>
            {total_days !== null && size(total_days) > 0 && map(total_days[0].data, (column, index) => (<th key={index}
                                                                                                            className={"px-6 whitespace-nowrap  font-medium text-center text-[#4687f1]"}>
                {new Date(column?.label).toLocaleDateString('es-PE', {timeZone: 'UTC'})}
            </th>))}
        </tr>
        </thead>
        <tbody>

        {total_days !== null && size(total_days) > 0 && map(total_days, (row, index) => (<tr key={index}
                                                                                             className={"bg-white border-b hover:bg-[#4687f1] hover:bg-opacity-10"}>
            <td className={" px-4 text-center text-xs font-light whitespace-nowrap"}>
                {row?.label}
            </td>
            {map(row?.data, (column, index) => (<td key={index}
                                                    className={"px-4 text-center text-xs font-light whitespace-nowrap"}>
                {column?.data}
            </td>))}
        </tr>))}
        </tbody>
    </table>);
};

export default Table;
