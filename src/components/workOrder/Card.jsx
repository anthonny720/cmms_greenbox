import React from 'react';
import {useSelector} from "react-redux";
import {map, size} from "lodash";
import Humanize from "humanize-plus";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircle, faClipboardCheck, faEye, faTrash, faUser} from "@fortawesome/free-solid-svg-icons";
import ReactStars from "react-rating-stars-component/dist/react-stars";
import {ClockIcon} from "@heroicons/react/20/solid";
import {UserIcon, UserPlusIcon} from "@heroicons/react/24/outline";

const Card = ({
                  work,
                  action_supervisor,
                  action_view,
                  action_delete,
                  action_update,
                  action_update_order,
                  action_helpers
              }) => {
    const me = useSelector(state => state.Auth.user)

    return (<div className={"h-44 lg:h-screen scrollbar-hide overflow-y-auto"}>
        {work && size(work) > 0 && true && map(work, (item, index) => {
            return (<div key={index}
                         className={"flex flex-col items-start bg-white w-full p-2 rounded-xl border border-gray-200 mt-2 px-4"}>
                <div className={"flex items-center relative w-full"}>

                    {me && true && true && me?.role === "S" && <FontAwesomeIcon
                        onClick={() => action_supervisor(item)}
                        className={"cursor-pointer text-cyan-400 bg-cyan-700 bg-opacity-10 p-2 rounded-full absolute right-0 top-0"}
                        size={"2xs"} icon={faClipboardCheck}/>}
                    {item.status === true && <FontAwesomeIcon onClick={() => action_view(item)}
                                                              className={"cursor-pointer text-gray-400 bg-gray-700 bg-opacity-10 p-2 rounded-full absolute right-8 top-0"}
                                                              size={"2xs"} icon={faEye}/>}

                    {me && true && true && (me?.role === 'B' || me?.role === 'P') &&
                        <FontAwesomeIcon
                            onClick={() => action_delete(item)}
                            className={"cursor-pointer text-red-400 bg-red-700 bg-opacity-10 p-2 rounded-full absolute right-0 top-0"}
                            size={"2xs"} icon={faTrash}/>}
                    <FontAwesomeIcon
                        className={"text-gray-500 bg-gray-700 bg-opacity-10 p-2 rounded-full"}
                        size={"lg"} icon={faUser}/>
                    <div>
                        <p key={index}
                           className={"text-gray-400 font-semibold text-xs ml-2"}>{item?.technical_name}</p>
                        <div className={"flex items-center ml-2"}>
                                    <span
                                        className={"text-gray-400 font-light  text-[10px] "}>{new Date(item.date_start).toLocaleDateString('es-PE', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: 'numeric',
                                        minute: 'numeric',
                                        hour12: true
                                    })}</span>
                            {item?.status && <span
                                className={"text-gray-400 font-light  text-[10px] ml-2"}>S/ {Humanize.formatNumber(item?.cost, 2)}</span>}

                        </div>
                    </div>
                </div>
                <span
                    className={`${item?.validated ? 'bg-blue-400 text-blue-400 w-full' : 'bg-yellow-400 text-yellow-400 w-10/12'} h-2  text-end rounded-xl text-[8px]  mt-2`}><p
                    className={"p-2"}>{item?.validated ? "100%" : "80%"}</p></span>
                <p
                    className={"text-black text-xs flex gap-2 mt-2 hover:text-gray-600 items-center font-bold"}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                         onClick={() => (me?.role === 'B' || me?.role === 'P' || me?.role === 'T') && action_update(item?.id)}
                         strokeWidth={1.5}
                         stroke="currentColor" className="w-6 h-6 cursor-pointer">
                        <path strokeLinecap="round" strokeLinejoin="round"
                              d="M21.75 6.75a4.5 4.5 0 01-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 11-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 016.336-4.486l-3.276 3.276a3.004 3.004 0 002.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852z"/>
                        <path strokeLinecap="round" strokeLinejoin="round"
                              d="M4.867 19.125h.008v.008h-.008v-.008z"/>
                    </svg>
                    {size(item?.helpers) > 0 ? map(item?.helpers, (helper, index) => <UserIcon
                        title={helper?.helper?.first_name} key={index}
                        onClick={() =>(me?.role === 'B' || me?.role === 'P' ||  me?.role === 'T') && action_helpers(item?.id)}
                        className="w-4 h-4 cursor-pointer hover:text-blue-400"/>) : <UserPlusIcon
                        onClick={() => (me?.role === 'B' || me?.role === 'P' ||  me?.role === 'T') && action_helpers(item?.id)}

                        className={"w-4 h-4 cursor-pointer hover:text-blue-400"}/>}

                    <ReactStars
                        value={item?.criticality === 'Baja' ? 1 : item?.criticality === 'Media' ? 2 : 3}
                        count={3}
                        size={20}
                        edit={false}
                        activeColor="#5F9CF4"
                    />
                    <span>{item?.physical_name}</span>

                </p>
                <hr className={"w-full mt-2"}/>
                <div className={"flex flex-row justify-between w-full"}>
                    <p onClick={() => (me?.role === 'B' || me?.role === 'P' ||  me?.role === 'T') && action_update_order(item)}
                       className={"text-xs  text-center text-normal text-black cursor-pointer flex items-center gap-1"}>{item?.code_ot}
                        {item?.status && <><span><ClockIcon className={"w-4 h-4 text-gray-400 "}/></span><span
                            className={"text-xs font-extralight"}> {item?.time} </span></>}
                    </p>
                    <div className={"flex items-center justify-center"}>
                        <FontAwesomeIcon className={"text-blue-500  p-2 rounded-full"}
                                         size={"2xs"} icon={faCircle}/>
                        <p className={"text-xs font-light text-blue-400 text-end"}>
                            <span>{item?.type_name}</span>
                        </p>

                    </div>
                </div>


            </div>)
        })}
    </div>)

};

export default Card;
