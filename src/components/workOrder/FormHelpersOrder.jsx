import React, {useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {filter, map} from "lodash";
import Skeleton from "react-loading-skeleton";
import {add_helper_ot, delete_helper_ot} from "../../redux/actions/management";
import {TrashIcon} from "@heroicons/react/20/solid";
import HeaderForm from "../util/HeaderForm";


const FormHelpersOrder = ({id, close, params}) => {
    const users = useSelector(state => state.Auth.users)
    const work = useSelector(state => state.Management.works)

    const info = filter(work, (item) => item.id === id)[0]

    const [data, setData] = useState({'helper': '', 'date_start': info?.date_start, 'date_finish': info?.date_finish});
    const dispatch = useDispatch()


    const handleSubmit = () => {
        dispatch(add_helper_ot(data, id, params))
    }
    const handleDelete = (id) => {
        dispatch(delete_helper_ot(id, params))
    }

    const columns = ['', 'Personal', 'Inicio', 'Final'];
    return (<div className="bg-white   px-2  pb-8 mb-4  ">
        <HeaderForm close={close}/>
        <p className={"text-[8px] flex justify-between  top-4 right-4"}>
            <span>
                {new Date(info?.date_start).toLocaleDateString('es-PE', {
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    second: 'numeric',
                    timeZone: 'America/Lima'
                })}
            </span>

            <span>
                {new Date(info?.date_finish).toLocaleDateString('es-PE', {
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    second: 'numeric',
                    timeZone: 'America/Lima'
                })}
            </span>

        </p>

        <div className={"h-40 overflow-y-auto scrollbar-hide"}>
            <table className="w-full rounded-full text-sm text-left text-gray-500  relative ">
                <thead className="text-xs text-gray-700  bg-white w-max ">

                <tr className={"w-max rounded-lg wg-white sticky "}>
                    {map(columns, (column, index) => (<th key={index} className="px-6 font-medium
                   text-center">{column}</th>))}
                </tr>
                </thead>
                <tbody>


                {info ? map(info?.helpers, (row, index) => (

                    <tr key={index} className="bg-white border-y hover:bg-[#4687f1] hover:bg-opacity-10 ">

                        <td className="py-2 text-center text-xs font-light ">
                            <TrashIcon onClick={() => handleDelete(row?.id)}
                                       className={"text-red-400 cursor-pointer w-4 h-4 bg-red-600 bg-opacity-10 p-0.5 rounded-full"}/>
                        </td>
                        <td className="py-2 text-center text-xs font-light ">{row?.helper?.first_name}</td>

                        <td className="py-2 text-center text-xs font-light ">{new Date(row?.date_start).toLocaleDateString('es-PE', {
                            year: 'numeric',
                            month: 'numeric',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: 'numeric',
                            second: 'numeric',
                            hour12: false,
                            timeZone: 'America/Lima'
                        })}</td>
                        <td className="py-2 text-center text-xs font-light ">{new Date(row?.date_finish).toLocaleDateString('es-PE', {
                            year: 'numeric',
                            month: 'numeric',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: 'numeric',
                            second: 'numeric',
                            hour12: false,
                            timeZone: 'America/Lima'
                        })}</td>

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
            {/*Helper*/}
            <div>
                {data.helper !== '' &&
                    <p className={`text-[10px]  font-extralight leading-none text-blue-400 `}>Personal</p>}
                <select onChange={(value) => setData({...data, 'helper': value.target.value})}
                        value={data.helper}
                        className={`text-black w-full focus:border-blue-300 p-3 mt-4 border border-gray-300 rounded outline-none focus:bg-gray-50 font-light text-xs`}
                >
                    <option value={''}>{'Seleccione un personal'}</option>
                    {users && map(filter(users, (user) => (user.role === 'T' || user.role === 'O')), (item, index) => (
                        <option key={index} value={item?.id}>{item?.get_full_name}</option>
                    ))}
                </select>
                {data.helper === '' &&
                    <p className={` text-[10px] mt-1  font-extralight leading-none text-red-400`}>{"Seleccione un personal válido"}</p>
                }
            </div>

            {/*StartDate*/}
            <div>
                {data.date_start !== '' &&
                    <p className={`text-[10px] font-extralight leading-none text-blue-400 `}>Fecha/Hora de inicio</p>}
                <input type={"datetime-local"}
                       className={`${data.date_start && "border-red-300"} text-black w-full focus:border-blue-300 p-3 mt-4 border border-gray-300 rounded outline-none focus:bg-gray-50 font-light text-xs`}
                       value={`${data.date_start}`}
                       onChange={text => setData({
                           ...data, 'date_start': text.target.value
                       })}/>
                {data.date_start === '' &&
                    <p className={` text-[10px] mt-1  font-extralight leading-none text-red-400`}>{"Seleccione un Fecha/Hora válida"}</p>
                }
            </div>

            {/*EndDate*/}
            <div>
                {data.date_finish !== '' &&
                    <p className={`text-[10px] font-extralight leading-none text-blue-400 `}>Fecha/Hora fin</p>}
                <input type={"datetime-local"}
                       className={`${data.date_finish && "border-red-300"} text-black w-full focus:border-blue-300 p-3 mt-4 border border-gray-300 rounded outline-none focus:bg-gray-50 font-light text-xs`}
                       value={`${data.date_finish}`}
                       onChange={text => setData({
                           ...data, 'date_finish': text.target.value
                       })}/>
                {data.date_finish === '' &&
                    <p className={` text-[10px] mt-1  font-extralight leading-none text-red-400`}>{"Seleccione un Fecha/Hora válida"}</p>
                }
            </div>

            <button type={"button"} onClick={() => handleSubmit()}
                    className={"flex items-center space-x-2 bg-[#4687f1] bg-opacity-70 p-2  w-max rounded-lg text-white"}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                     stroke="currentColor" className="w-4 h-4 text-white">
                    <path strokeLinecap="round" strokeLinejoin="round"
                          d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"/>

                </svg>
                <span className={"text-xs"}>Guardar</span>
            </button>


        </form>


    </div>);
};


export default FormHelpersOrder;
