import React, {Fragment, useState} from 'react';
import {useFormik} from "formik";
import * as Yup from "yup";
import {Combobox, Transition} from "@headlessui/react";
import {useDispatch, useSelector} from "react-redux";
import {CheckIcon, ChevronUpDownIcon} from "@heroicons/react/24/outline";
import {filter, size} from "lodash";
import {setAlert} from "../../redux/actions/alert";
import {generate_ot} from "../../redux/actions/management";
import HeaderForm from "../util/HeaderForm";

const FormOT = ({data, close}) => {
    const dispatch = useDispatch();
    const physical = useSelector(state => state.Assets.physical)
    const users = useSelector(state => state.Auth.users)

    /*Formik*/
    const formik = useFormik({
        initialValues: initialValues(data),
        validationSchema: Yup.object(newSchema()),
        validateOnChange: true,
        onSubmit: (form,) => {
            if (size(selectedEquipment) > 0) {
                form.asset = selectedEquipment.id
                form.work_request = data?.id
                dispatch(generate_ot(form))
                close()
            } else {
                dispatch(setAlert('Debe seleccionar al menos un elemento de cada lista', 'error'))
            }
        }
    })

    const [selectedEquipment, setSelectedEquipment] = useState(data ? filter(physical, (item) => item.id === data?.asset)[0] : physical[0])
    const [queryEquipment, setQueryEquipment] = useState('')

    const filteredEquipment = queryEquipment === '' ? physical : physical.filter((person) => person.name
        .toLowerCase()
        .replace(/\s+/g, '')
        .includes(queryEquipment.toLowerCase().replace(/\s+/g, '')))


    return (<form className="bg-white   px-2  pb-8 mb-4 h-max ">
        <HeaderForm close={close} submit={formik.handleSubmit}/>
        <div className={`grid grid-cols-1 gap-2`}>

            {/*ReportDate*/}
            <div>
                <p className={`text-[10px]  font-extralight leading-none text-blue-400 `}>Fecha/Hora de reporte</p>
                <input type={"datetime-local"}
                       className={`${formik.errors.date_report && "border-red-300"} text-black w-full focus:border-blue-300 p-3 mt-4 border border-gray-300 rounded outline-none focus:bg-gray-50 font-light text-xs`}
                       value={`${formik.values.date_report}`}
                       onChange={text => formik.setFieldValue('date_report', text.target.value)}/>
                <p className={` text-[10px] mt-1  font-extralight leading-none ${formik.errors.date_report ? "text-red-400" : " text-gray-800"}`}>{formik.errors.date_report}</p>

            </div>
            {/*StartDate*/}
            <div>
                <p className={`text-[10px]  font-extralight leading-none text-blue-400 `}>Fecha/Hora de inicio</p>
                <input type={"datetime-local"}
                       className={`${formik.errors.date_start && "border-red-300"} text-black w-full focus:border-blue-300 p-3 mt-4 border border-gray-300 rounded outline-none focus:bg-gray-50 font-light text-xs`}
                       value={`${formik.values.date_start}`}
                       onChange={text => formik.setFieldValue('date_start', text.target.value)}/>
                <p className={` text-[10px] mt-1  font-extralight leading-none ${formik.errors.date_start ? "text-red-400" : " text-gray-800"}`}>{formik.errors.date_start}</p>

            </div>
            {/*Asset*/}
            <div>
                <p className={`text-[10px]  font-extralight leading-none text-blue-400 `}>Equipo</p>
                <Combobox value={selectedEquipment} onChange={setSelectedEquipment}>
                    <div className="relative mt-1">
                        <div
                            className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                            <Combobox.Input
                                className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                                displayValue={(equipment) => equipment.name}
                                onChange={(event) => setQueryEquipment(event.target.value)}
                            />
                            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                                <ChevronUpDownIcon
                                    className="h-5 w-5 text-gray-400"
                                    aria-hidden="true"
                                />
                            </Combobox.Button>
                        </div>
                        <Transition
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                            afterLeave={() => setQueryEquipment('')}
                        >
                            <Combobox.Options
                                className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                {filteredEquipment.length === 0 && queryEquipment !== '' ? (
                                    <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                                        Nothing found.
                                    </div>) : (filteredEquipment.map((equipment) => (<Combobox.Option
                                    key={equipment.id}
                                    className={({active}) => `z-50 relative bg-white cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-blue-300 text-white' : 'text-gray-900'}`}
                                    value={equipment}
                                >
                                    {({selected, active}) => (<>
                        <span
                            className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}
                        >
                          {equipment.name}
                        </span>
                                        {selected ? (<span
                                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active ? 'text-white' : 'text-blue-300'}`}
                                        >
                            <CheckIcon className="h-5 w-5" aria-hidden="true"/>
                          </span>) : null}
                                    </>)}
                                </Combobox.Option>)))}
                            </Combobox.Options>
                        </Transition>
                    </div>
                </Combobox>
            </div>


            {/*Description*/}
            <div>
                <p className={`text-[10px]  font-extralight leading-none text-blue-400 `}>Descripción</p>
                <textarea
                    className={`${formik.errors.description && "border-red-300"} text-black w-full focus:border-blue-300 p-3 mt-4 border border-gray-300 rounded outline-none focus:bg-gray-50 font-light text-xs`}
                    value={`${formik.values.description}`}
                    onChange={text => formik.setFieldValue('description', text.target.value)}/>
                <p className={` text-[10px] mt-1  font-extralight leading-none ${formik.errors.description ? "text-red-400" : " text-gray-800"}`}>{formik.errors.description}</p>

            </div>
            {/*Users*/}
            <div className={"w-full "}>
                <p className={`${formik.errors.technical && "text-red-500"} text-[10px]  font-extralight leading-none text-blue-400 `}>Responsable:</p>
                <select value={formik.values.technical}
                        onChange={(value) => formik.setFieldValue('technical', value.target.value)}
                        className="w-full p-3 mt-4 border border-gray-300 rounded outline-none focus:bg-gray-50  focus:outline-none focus-visible:border-blue-500  sm:text-sm">
                    <option value="">-----</option>
                    {users && users.filter((user) => (user.role === 'T' || user.role === 'O')).map((item, index) =>
                        <option key={index}
                                value={item.id}>{item.get_full_name}</option>)}
                </select>
            </div>


        </div>


    </form>);
};
const initialValues = (data) => {
    return {
        date_start: data?.date_start || '',
        date_report: data?.date_report || '',
        description: data?.description || '',
        technical: data?.technical || '',


    }
}
const newSchema = () => {
    return {
        date_report: Yup.string().min(10).required("Fecha de reporte no puede estar en blanco"),
        date_start: Yup.string().min(10).required("Fecha de inicio no puede estar en blanco"),
        description: Yup.string().required("Descripción no puede estar en blanco"),
        technical: Yup.number().required("Responsable no puede estar en blanco"),


    }
}

export default FormOT;
