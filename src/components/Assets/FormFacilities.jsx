import React from 'react';
import {useDispatch} from "react-redux";
import {useFormik} from "formik";
import * as Yup from "yup";
import {add_fixed, update_fixed} from "../../redux/actions/assets";
import HeaderForm from "../util/HeaderForm";

const FormFacilities = ({data, close}) => {

    const dispatch = useDispatch();


    /*Formik*/
    const formik = useFormik({
        initialValues: initialValues(data),
        validationSchema: Yup.object(newSchema()),
        validateOnChange: true,
        onSubmit: (form) => {
            data ? dispatch(update_fixed(form, data?.id)) : dispatch(add_fixed(form))
            close()
        }
    })


    return (

        <form className="bg-white  rounded px-8 pt-6 pb-8 mb-4">
            <HeaderForm submit={formik.handleSubmit} close={close}/>
            <div className={`grid  grid-cols-1 gap-2`}>


                <div>
                    {formik.values.name.length > 0 &&
                        <p className={`text-[10px]  font-extralight leading-none text-blue-400 `}>Nombre</p>}

                    <input type={"text"} maxLength={50} placeholder={"Nombre"}
                           className={`${formik.errors.name && "border-red-300"} text-black w-full focus:border-blue-300 p-3 mt-4 border border-gray-300 rounded outline-none focus:bg-gray-50 font-light text-xs`}
                           value={`${formik.values.name}`}
                           onChange={text => formik.setFieldValue("name", text.target.value)}/>
                    <p className={`${formik.errors.name ? "text-red-400" : "text-gray-800"} text-[10px] mt-1  font-extralight leading-none `}>{formik.errors.name}</p>

                </div>


                <div>
                    {formik.values.description.length > 0 &&
                        <p className={`text-[10px]  font-extralight leading-none text-blue-400 `}>Descripción</p>}

                    <textarea maxLength={200} placeholder={"Descripción"}
                              className={`${formik.errors.description && "border-red-300"} text-black w-full focus:border-blue-300 p-3 mt-4 border border-gray-300 rounded outline-none focus:bg-gray-50 font-light text-xs`}
                              value={`${formik.values.description}`}
                              onChange={text => formik.setFieldValue("description", text.target.value)}/>
                    <p className={`${formik.errors.description ? "text-red-400" : "text-gray-800"} text-[10px] mt-1  font-extralight leading-none `}>{formik.errors.description}</p>


                </div>
            </div>


        </form>);
};

const initialValues = (data) => {
    return {
        name: data?.name || '', description: data?.description || '',


    }
}
const newSchema = () => {
    return {
        name: Yup.string().required("Nombre no puede estar en blanco"),
        description: Yup.string().required("Descripción no puede estar en blanco"),

    }
}
export default FormFacilities;
