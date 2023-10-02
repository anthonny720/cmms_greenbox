import Skeleton from "react-loading-skeleton";
import {map, size} from "lodash";
import React from "react";
import {Switch} from "@headlessui/react";
import {TrashIcon} from "@heroicons/react/24/outline";
import {useDispatch, useSelector} from "react-redux";
import {update_fixed} from "../../redux/actions/assets";
import {setAlert} from "../../redux/actions/alert";

const TableFixes = ({data, update, columns, remove}) => {
    const dispatch = useDispatch()
    const me = useSelector(state => state.Auth.user)
    const handleChange = (e, item) => {
        const data = new FormData()
        data.append("enabled", e)
        (me?.role === "B" || me?.role === "P")  ? dispatch(update_fixed(data, item?.id)) : dispatch(setAlert("No tienes permisos para realizar esta acción", "error"))
    }


    return (<table className="w-full rounded-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 bg-white">
        <tr className="w-max rounded-lg wg-white">
            {columns.map((column, index) => (<th key={index} className="px-6 font-medium text-center">
                {column}
            </th>))}
        </tr>
        </thead>
        <tbody>

        {data !== null && size(data) > 0 ? map(data, (item, index) => (
            <tr key={index} className="bg-white border-b hover:bg-[#4687f1] hover:bg-opacity-10">
                <td className="py-2 px-4 text-center text-xs font-light">
                    {(me?.role === 'P' || me?.role === 'B') ? (
                        <TrashIcon onClick={() => remove(item)}
                                   className="w-5 p-0.5 text-red-400 bg-red-500 bg-opacity-10 rounded-full cursor-pointer"/>) : (
                        <button
                            disabled={true}
                            className="w-5 p-0.5 text-red-400 bg-red-500 bg-opacity-10 rounded-full cursor-not-allowed">
                            <TrashIcon/>
                        </button>)}
                </td>
                <td className=" py-2 px-4 text-center text-xs font-light "><Switch
                    checked={item.enabled}
                    onChange={(e) => handleChange(e, item)}
                    className={`${item.enabled ? 'bg-green-400' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full`}>
                    <span className={`${item.enabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition`}/>
                </Switch></td>

                <td className=" py-2 px-4 text-center text-xs font-light cursor-pointer hover:text-blue-400 hover:font-bold "
                    onClick={() => (me?.role === "B" || me?.role === "P") ? update(item) : dispatch(setAlert("No tienes permisos para realizar esta acción", 'error'))}>{item.name}</td>
                <td className=" py-2 px-4 text-center text-xs font-light ">{item.description}</td>


            </tr>)) : <tr>
            {columns.map((column, index) => (<td key={index} className="py-2 px-4 text-center text-xs font-light">
                <Skeleton className="bg-red-500" count={10}/>
            </td>))}
        </tr>}

        </tbody>
    </table>)

};
export default TableFixes;