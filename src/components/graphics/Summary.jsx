import React from 'react';
import {BellIcon} from "@heroicons/react/20/solid";
import {CheckIcon} from "@heroicons/react/24/outline";

const Summary = ({title, value, icon}) => {
    return (<div
        className={"md:w-3/12 w-full bg-white hover:translate-y-1 text-white shadow-lg h-max rounded-lg p-2 flex flex-col gap-2 border border-gray-200 bg-gradient-to-r from-cyan-500 to-blue-500"}>
        <span className={" text-xs font-sans"}>{title}</span>
        <div className={"flex items-center justify-between"}>
            <span className={""}>{value}</span>
            {icon ? <BellIcon className={"h-5 w-5  bg-blue-700 bg-opacity-10 rounded-full p-0.5"}/> :
                <CheckIcon className={"h-5 w-5  bg-blue-700 bg-opacity-10 rounded-full p-0.5"}/>}

        </div>

    </div>);
};

export default Summary;
