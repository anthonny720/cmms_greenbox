import React, {Fragment, useState} from 'react';
import {useFormik} from "formik";
import * as Yup from "yup";
import {Listbox, Switch, Transition} from "@headlessui/react";
import {useDispatch, useSelector} from "react-redux";
import {CheckIcon, ChevronUpDownIcon} from "@heroicons/react/24/outline";
import {filter, map, size} from "lodash";
import {setAlert} from "../../redux/actions/alert";
import {add_work, update_work} from "../../redux/actions/management";
import HeaderForm from "../util/HeaderForm";
import CBox from "./CBox";

const FormTasks = ({data, close, id, params}) => {

    const dispatch = useDispatch();
    const physical = useSelector(state => state.Assets.physical)
    const tools = useSelector(state => state.Assets.tools)
    const users = useSelector(state => state.Auth.users)
    const me = useSelector(state => state.Auth.user)
    const types = useSelector(state => state.Configuration.types)
    const failures = useSelector(state => state.Configuration.failures)
    /*Formik*/
    const formik = useFormik({
        initialValues: initialValues(data),
        validationSchema: Yup.object(newSchema()),
        validateOnChange: true,
        onSubmit: (form) => {
            if (size(selectedTools) > 0 && selectedEquipment !== '' && selectedType !== '' && selectedFailure !== '') {
                form.asset = selectedEquipment.id
                form.tools = map(selectedTools, (item) => item?.id)
                form.type_maintenance = selectedType?.id
                form.failure = selectedFailure.id
                data ? dispatch(update_work(form, id, params)) : dispatch(add_work(form, params))

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

    const [selectedType, setSelectedType] = useState(data ? filter(types, (item) => item.id === data?.type_maintenance)[0] : types[0])
    const [queryType, setQueryType] = useState('')

    const filteredType = queryType === '' ? types : types.filter((type) => type.name
        .toLowerCase()
        .replace(/\s+/g, '')
        .includes(queryType.toLowerCase().replace(/\s+/g, '')))

    const [selectedFailure, setSelectedFailure] = useState(data ? filter(failures, (item) => item.id === data?.failure)[0] : failures[0])
    const [queryFailure, setQueryFailure] = useState('')

    const filteredFailure = queryFailure === '' ? failures : failures.filter((fail) => fail.name
        .toLowerCase()
        .replace(/\s+/g, '')
        .includes(queryFailure.toLowerCase().replace(/\s+/g, '')))

    const [selectedTools, setSelectedTools] = useState(data ? map(data?.tools, i => filter(tools, ['id', i])[0]) : [])

    return (<form className="bg-white   px-2  pb-8 mb-4 h-max ">

        <HeaderForm close={close} submit={formik.handleSubmit}/>

        <div className={`grid grid-cols-1 gap-2`}>
            {me && me.permissions === 'EDITOR' && (me.role === 'P' || me.role === 'B') && <div className={"w-full "}>
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

            }

            {!data?.date_report && /*ReportDate*/
                <div>
                    <p className={`text-[10px]  font-extralight leading-none text-blue-400 `}>Fecha/Hora de reporte</p>
                    <input type={"datetime-local"}
                           className={`${formik.errors.date_report && "border-red-300"} text-black w-full focus:border-blue-300 p-3 mt-4 border border-gray-300 rounded outline-none focus:bg-gray-50 font-light text-xs`}
                           value={`${formik.values.date_report}`}
                           onChange={text => formik.setFieldValue('date_report', text.target.value)}/>
                    <p className={` text-[10px] mt-1  font-extralight leading-none ${formik.errors.date_report ? "text-red-400" : " text-gray-800"}`}>{formik.errors.date_report}</p>

                </div>}

            {/*StartDate*/}
            <div>
                <p className={`text-[10px]  font-extralight leading-none text-blue-400 `}>Fecha/Hora de inicio</p>
                <input type={"datetime-local"}
                       className={`${formik.errors.date_start && "border-red-300"} text-black w-full focus:border-blue-300 p-3 mt-4 border border-gray-300 rounded outline-none focus:bg-gray-50 font-light text-xs`}
                       value={`${formik.values.date_start}`}
                       onChange={text => formik.setFieldValue('date_start', text.target.value)}/>
                <p className={` text-[10px] mt-1  font-extralight leading-none ${formik.errors.date_start ? "text-red-400" : " text-gray-800"}`}>{formik.errors.date_start}</p>

            </div>
            {/*EndDate*/}
            <div>
                <p className={`text-[10px]  font-extralight leading-none text-blue-400 `}>Fecha/Hora de finalización</p>
                <input type={"datetime-local"}
                       className={`${formik.errors.date_finish && "border-red-300"} text-black w-full focus:border-blue-300 p-3 mt-4 border border-gray-300 rounded outline-none focus:bg-gray-50 font-light text-xs`}
                       value={`${formik.values.date_finish}`}
                       onChange={text => formik.setFieldValue('date_finish', text.target.value)}/>
                <p className={` text-[10px] mt-1  font-extralight leading-none ${formik.errors.date_finish ? "text-red-400" : " text-gray-800"}`}>{formik.errors.date_finish}</p>

            </div>

            {/*Asset*/}
            <div>
                <p className={`text-[10px]  font-extralight leading-none text-blue-400 `}>Equipo</p>
                <CBox selected={selectedEquipment} setSelected={setSelectedEquipment} setQuery={setQueryEquipment}
                      filtered={filteredEquipment} query={queryEquipment}/>
            </div>

            {/*Type Maintenance*/}
            <div>
                <p className={`text-[10px]  font-extralight leading-none text-blue-400 `}>Tipo de mantenimiento</p>
                <CBox selected={selectedType} setSelected={setSelectedType} setQuery={setQueryType}
                      filtered={filteredType} query={queryType}/>
            </div>
            {/*Failure*/}
            <div>
                <p className={`text-[10px]  font-extralight leading-none text-blue-400 `}>Origen de falla</p>
                <CBox selected={selectedFailure} setSelected={setSelectedFailure} setQuery={setQueryFailure}
                      filtered={filteredFailure} query={queryFailure}/>
            </div>
            {/*Description*/}
            <div>
                <p className={`text-[10px]  font-extralight leading-none text-blue-400 `}>Descripción</p>
                <textarea rows={4}
                          className={`${formik.errors.description && "border-red-300"} text-black w-full focus:border-blue-300 p-3 mt-4 border border-gray-300 rounded outline-none focus:bg-gray-50 font-light text-xs`}
                          value={`${formik.values.description}`}
                          onChange={text => formik.setFieldValue('description', text.target.value)}/>
                <p className={` text-[10px] mt-1  font-extralight leading-none ${formik.errors.description ? "text-red-400" : " text-gray-800"}`}>{formik.errors.description}</p>

            </div>

            {/*Tools*/}
            <div>
                <p className={`text-[10px]  font-extralight leading-none text-blue-400 `}>Herramientas y materiales
                    usados</p>
                <Listbox value={selectedTools} multiple onChange={setSelectedTools}>
                    <div className="relative mt-1">
                        <Listbox.Button
                            className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                            <span
                                className="break-words block truncate whitespace-pre-wrap text-black ">{map(selectedTools, tools => tools?.name).join(', ')}</span>
                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
              />
            </span>
                        </Listbox.Button>
                        <Transition
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Listbox.Options
                                className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                {tools && tools.map((tool, id) => (<Listbox.Option
                                    key={id}
                                    className={({active}) => `bg-white z-50 relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-blue-200 text-blue-900' : 'text-gray-900'}`}
                                    value={tool}
                                >
                                    {({selected}) => (<>
                      <span
                          className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}
                      >
                        {tool?.name}
                      </span>
                                        {selected ? (<span
                                            className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                          <CheckIcon className="h-5 w-5" aria-hidden="true"/>
                        </span>) : null}
                                    </>)}
                                </Listbox.Option>))}
                            </Listbox.Options>
                        </Transition>
                    </div>
                </Listbox>
            </div>
            {/*Activities*/}
            <div>
                <p className={`text-[10px]  font-extralight leading-none text-blue-400 `}>Trabajos realizados</p>
                <textarea
                    className={`${formik.errors.activities && "border-red-300"} text-black w-full focus:border-blue-300 p-3 mt-4 border border-gray-300 rounded outline-none focus:bg-gray-50 font-light text-xs`}
                    value={`${formik.values.activities}`}
                    onChange={text => formik.setFieldValue('activities', text.target.value)}/>
                <p className={` text-[10px] mt-1  font-extralight leading-none ${formik.errors.activities ? "text-red-400" : " text-gray-800"}`}>{formik.errors.activities}</p>
            </div>

            <div className={"grid grid-cols-3"}>
                {me && me?.permissions === "EDITOR" && (me?.role === 'B' || me?.role === 'P') && (/*Planned*/
                    <div>
                        <p className={`text-[10px]  font-extralight leading-none text-blue-400 `}>Planificado</p>
                        <Switch checked={formik.values.planned} onChange={text => formik.setFieldValue('planned', text)}
                                as={Fragment}>
                            {({checked}) => (/* Use the `checked` state to conditionally style the button. */
                                <button
                                    className={`${checked ? 'bg-blue-600' : 'bg-gray-200'} mt-2 relative inline-flex h-6 w-11 items-center rounded-full`}
                                >
                                    <span className="sr-only">Planificado</span>
                                    <span
                                        className={`${checked ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition`}
                                    />
                                </button>)}
                        </Switch>

                        <p className={` text-[10px] mt-1  font-extralight leading-none ${formik.errors.planned ? "text-red-400" : " text-gray-800"}`}>{formik.errors.planned}</p>

                    </div>)}

                {/*Status*/}
                <div>
                    <p className={`text-[10px]  font-extralight leading-none text-blue-400 `}>Finalizado</p>
                    <Switch checked={formik.values.status} onChange={text => formik.setFieldValue('status', text)}
                            as={Fragment}>
                        {({checked}) => (/* Use the `checked` state to conditionally style the button. */
                            <button
                                className={`${checked ? 'bg-blue-600' : 'bg-gray-200'}  mt-2 relative inline-flex h-6 w-11 items-center rounded-full`}
                            >
                                <span className="sr-only">Finalizado</span>
                                <span
                                    className={`${checked ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition`}
                                />
                            </button>)}
                    </Switch>

                    <p className={` text-[10px] mt-1  font-extralight leading-none ${formik.errors.status ? "text-red-400" : " text-gray-800"}`}>{formik.errors.status}</p>

                </div>

            </div>


        </div>


    </form>);
};
const initialValues = (data) => {
    return {
        date_start: data?.date_start || '',
        date_finish: data?.date_finish || '',
        date_report: data?.date_report || '',
        description: data?.description || '',
        activities: data?.activities || '',
        status: data?.status || false,
        planned: data?.planned || false,
        technical: data?.technical || null,


    }
}
const newSchema = () => {
    return {
        date_start: Yup.string().min(10).required("Fecha de inicio no puede estar en blanco"),
        date_report: Yup.string().min(10).required("Fecha de reporte no puede estar en blanco"),
        date_finish: Yup.string().min(10).required("Fecha de fin no puede estar en blanco"),
        description: Yup.string().required("Descripción no puede estar en blanco"),

    }
}

export default FormTasks;
