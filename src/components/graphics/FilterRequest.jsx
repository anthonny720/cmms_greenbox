import React, {useState} from 'react';
import {Switch} from "@headlessui/react";
import RangeDate from "../util/RangeDate";

const FilterRequest = () => {
    const [startDate, setStartDate] = useState()
    const [endDate, setEndDate] = useState()
    const [enabled, setEnabled] = useState()

    return (<div className={"max-w-full overflow-hidden flex flex-col md:flex-row gap-4 items-center"}>
            <p className={`flex flex-col justify-center items-center text-xs mt-4 text-gray-400 gap-1 ${enabled && 'text-blue-600'}`}>
                Planificado
                <Switch
                    checked={enabled}
                    onChange={setEnabled}
                    className={`${enabled ? 'bg-blue-400' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full`}
                >
                    <span className="sr-only">Planificado</span>
                    <span
                        className={`${enabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition`}
                    />
                </Switch>
            </p>
            <RangeDate endDate={endDate} setEndDate={setEndDate} setStartDate={setStartDate} startDate={startDate}/>
        </div>


    );
};

export default FilterRequest;
