import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useFormik} from "formik";
import * as Yup from "yup";
import {map} from "lodash";
import {add_requirements, update_requirements} from "../../redux/actions/store";
import HeaderForm from "../util/HeaderForm";

const FormRequirements = ({data, close}) => {

    const me = useSelector(state => state.Auth.user)

    const dispatch = useDispatch();
    const columns = [

        {name: 'product', title: 'Producto', type: 'text', maxLength: 50}, {
            name: 'description', title: 'Descripción', type: 'text', maxLength: 100
        }, {name: 'quantity', title: 'Cantidad', type: 'number'}, {
            name: 'unit_measurement', title: 'U.M.', type: 'text', maxLength: 20
        }, {name: 'work', title: 'Tipo de trabajo', type: 'text', maxLength: 20},]


    /*Formik*/
    const formik = useFormik({
        initialValues: initialValues(data),
        validationSchema: Yup.object(newSchema()),
        validateOnChange: true,
        onSubmit: (form) => {
            data ? dispatch(update_requirements(form, data?.id)) : dispatch(add_requirements(form))
            close()
        }
    })

    return (

        <form className="bg-white  rounded px-8  ">
            <HeaderForm submit={formik.handleSubmit} close={close}/>

            <div className={`grid md:grid-cols-2 grid-cols-1 gap-2 mt-2`}>
                {me && (me?.role === "B" || me?.role === "P" || me?.role === 'T' ) && map(columns, (item, index) => (
                    <div key={index}>
                        {formik.values[item.name].length > 0 &&
                            <p className={`text-[10px]  font-extralight leading-none text-blue-400 `}>{item.title}</p>}

                        <input type={item.type} maxLength={item.maxLength} placeholder={item.title}
                               className={`${formik.errors[item.name] && "border-red-300"} text-black w-full focus:border-blue-300 p-3 mt-4 border border-gray-300 rounded outline-none focus:bg-gray-50 font-light text-xs`}
                               value={`${formik.values[item.name]}`}
                               onChange={text => formik.setFieldValue(item.name, text.target.value)}/>
                        <p className={` text-[10px] mt-1  font-extralight leading-none ${formik.errors[item.name] ? "text-red-400" : " text-gray-800"}`}>{formik.errors[item.name]}</p>

                    </div>))}

                {me  && (me?.role === "S" || me?.role === "P" || me?.role === 'C' || me?.role === 'B') &&
                    <div>
                        <p className={`text-[10px]  font-extralight leading-none text-blue-400 `}>Estado</p>
                        <select onChange={(value) => formik.setFieldValue('status', value.target.value)}
                                value={formik.values.status}
                                className={`${formik.errors.status && "border-red-300"} text-black w-full focus:border-blue-300 p-3 mt-4 border border-gray-300 rounded outline-none focus:bg-gray-50 font-light text-xs`}
                                aria-label="Default select example">
                            <option value={'Pendiente'}>{'Pendiente'}</option>
                            <option value={'Aprobado'}>{'Aprobado'}</option>
                            <option value={'Rechazado'}>{'Rechazado'}</option>
                            <option value={'Parcial'}>{'Parcial'}</option>
                            <option value={'Finalizado'}>{'Finalizado'}</option>
                        </select>
                        <p className={`text-[10px] mt-1  font-extralight leading-none ${formik.errors.status ? "text-red-400" : "text-gray-800"}`}>{formik.errors.status}</p>

                    </div>}
            </div>


        </form>);
};

const initialValues = (data) => {
    return {
        product: data?.product || '',
        description: data?.description || '',
        quantity: data?.quantity || '',
        unit_measurement: data?.unit_measurement || '',
        status: data?.status || 'Pendiente',
        work: data?.work || '',


    }
}
const newSchema = () => {
    return {
        product: Yup.string().required("Producto no puede estar en blanco"),
        description: Yup.string().required("Descripción no puede estar en blanco"),
        quantity: Yup.number().required("Cantidad no puede estar en blanco"),
        unit_measurement: Yup.string().required("Unidad de medida no puede estar en blanco"),
        status: Yup.string().min(5, "El estado debe ser una opción válida").required("Estado no puede estar en blanco"),
        work: Yup.string().required("Tipo de trabajo no puede estar en blanco"),


    }
}
export default FormRequirements;
