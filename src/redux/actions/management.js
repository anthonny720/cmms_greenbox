import axios from "axios";
import {
    ADD_HELPER_OT_FAIL,
    ADD_HELPER_OT_SUCCESS,
    ADD_RESOURCE_OT_FAIL,
    ADD_RESOURCE_OT_SUCCESS,
    ADD_WORK_FAIL,
    ADD_WORK_REQUEST_FAIL,
    ADD_WORK_REQUEST_SUCCESS,
    ADD_WORK_SUCCESS,
    DELETE_HELPER_OT_FAIL,
    DELETE_HELPER_OT_SUCCESS,
    DELETE_RESOURCE_OT_FAIL,
    DELETE_RESOURCE_OT_SUCCESS,
    DELETE_WORK_FAIL,
    DELETE_WORK_SUCCESS,
    GENERATE_OT_FAIL,
    GENERATE_OT_SUCCESS,
    GET_WORK_REQUEST_FAIL,
    GET_WORK_REQUEST_SUCCESS,
    GET_WORKS_FAIL,
    GET_WORKS_SUCCESS,
    UPDATE_WORK_FAIL,
    UPDATE_WORK_SUCCESS,
    UPDATE_WORK_SUPERVISOR_FAIL,
    UPDATE_WORK_SUPERVISOR_SUCCESS
} from "./types";
import {setAlert} from "./alert";


export const get_works = (params) => async dispatch => {
    const config = {
        headers: {
            'Authorization': `JWT ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        },
        params: {...params}
    };

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/management/works`, config);
        if (res.status === 200) {
            dispatch({
                type: GET_WORKS_SUCCESS,
                payload: res.data
            });
        } else {
            dispatch({
                type: GET_WORKS_FAIL
            });
        }
    } catch (err) {
        dispatch({
            type: GET_WORKS_FAIL
        });
    }
}

export const add_work = (form, params) => async dispatch => {
    const config = {
        headers: {
            'Authorization': `JWT ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        },

    };

    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/management/works/add`, form, config);
        if (res.status === 201) {
            dispatch({
                type: ADD_WORK_SUCCESS,
                payload: res.data
            });
            dispatch(get_works(params))
            dispatch(setAlert("OT registrada", 'success'));
        } else {
            dispatch({
                type: ADD_WORK_FAIL
            });
        }
    } catch (err) {
        dispatch({
            type: ADD_WORK_FAIL
        });
        dispatch(setAlert("No se puede procesar la solicitud", 'error'));
    }
}
export const update_work = (form, pk, params) => async dispatch => {
    const config = {
        headers: {
            'Authorization': `JWT ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        },

    };

    try {
        const res = await axios.patch(`${process.env.REACT_APP_API_URL}/api/management/works/update/${pk}`, form, config);
        if (res.status === 200) {
            dispatch({
                type: UPDATE_WORK_SUCCESS,
                payload: res.data
            });
            dispatch(get_works(params))
            dispatch(setAlert('OT actualizada', 'success'));
        } else {
            dispatch({
                type: UPDATE_WORK_FAIL
            });
        }
    } catch (err) {
        dispatch({
            type: UPDATE_WORK_FAIL
        });
        dispatch(setAlert("No se puede procesar la solicitud", 'error'));
    }
}

export const delete_work = (pk, params) => async dispatch => {
    const config = {
        headers: {
            'Authorization': `JWT ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        },

    };

    try {
        const res = await axios.delete(`${process.env.REACT_APP_API_URL}/api/management/works/delete/${pk}`, config);
        if (res.status === 200) {
            dispatch({
                type: DELETE_WORK_SUCCESS,
                payload: res.data
            });
            dispatch(get_works(params))
            dispatch(setAlert("OT eliminada", 'success'));
        } else {
            dispatch({
                type: DELETE_WORK_FAIL
            });
        }
    } catch (err) {
        dispatch({
            type: DELETE_WORK_FAIL
        });
        dispatch(setAlert("No se puede procesar la solicitud", 'error'));
    }
}
export const update_work_supervisor = (form, pk, params) => async dispatch => {
    const config = {
        headers: {
            'Authorization': `JWT ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        },

    };

    try {
        const res = await axios.patch(`${process.env.REACT_APP_API_URL}/api/management/update-work-supervisor/${pk}`, form, config);
        if (res.status === 200) {
            dispatch({
                type: UPDATE_WORK_SUPERVISOR_SUCCESS,
            });
            dispatch(get_works(params))
            dispatch(setAlert('OT actualizada', 'success'));
        } else {
            dispatch({
                type: UPDATE_WORK_SUPERVISOR_FAIL
            });
        }
    } catch (err) {
        dispatch({
            type: UPDATE_WORK_SUPERVISOR_FAIL
        });
        dispatch(setAlert("No se puede procesar la solicitud", 'error'));
    }
}


export const get_work_request = (params) => async dispatch => {
    const config = {
        headers: {
            'Authorization': `JWT ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        },
        params: {...params}
    };

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/management/list-work-request`, config);
        if (res.status === 200) {
            dispatch({
                type: GET_WORK_REQUEST_SUCCESS,
                payload: res.data
            });
        } else {
            dispatch({
                type: GET_WORK_REQUEST_FAIL
            });
        }
    } catch (err) {
        dispatch({
            type: GET_WORK_REQUEST_FAIL
        });
    }
}
export const add_work_request = (form) => async dispatch => {
    const config = {
        headers: {
            'Authorization': `JWT ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };

    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/management/add-work-request`, form, config);
        if (res.status === 201) {
            dispatch({
                type: ADD_WORK_REQUEST_SUCCESS,
                payload: res.data
            });
            dispatch(get_work_request())
            dispatch(setAlert('Solicitud registrada', 'success'));
        } else {
            dispatch({
                type: ADD_WORK_REQUEST_FAIL
            });
        }
    } catch (err) {
        dispatch({
            type: ADD_WORK_REQUEST_FAIL
        });
        dispatch(setAlert("No se puede procesar la solicitud", 'error'));
    }
}

export const generate_ot = (form) => async dispatch => {
    const config = {
        headers: {
            'Authorization': `JWT ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };

    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/management/generate-work`, form, config);
        if (res.status === 201) {
            dispatch({
                type: GENERATE_OT_SUCCESS,
                payload: res.data
            });
            dispatch(get_work_request())
            dispatch(setAlert('OT registrado', 'success'));
        } else {
            dispatch({
                type: GENERATE_OT_FAIL
            });
        }
    } catch (err) {
        dispatch({
            type: GENERATE_OT_FAIL
        });
        dispatch(setAlert("No se puede procesar la solicitud", 'error'));
    }
}

export const add_resource_ot = (form, pk, params) => async dispatch => {
    const config = {
        headers: {
            'Authorization': `JWT ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };

    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/management/works/update/${pk}/resource`, form, config);
        if (res.status === 201) {
            dispatch({
                type: ADD_RESOURCE_OT_SUCCESS,
                payload: res.data
            });
            dispatch(get_works(params))
            dispatch(setAlert('Artículo registrado', 'success'));
        } else {
            dispatch({
                type: ADD_RESOURCE_OT_FAIL
            });
        }
    } catch (err) {
        dispatch({
            type: ADD_RESOURCE_OT_FAIL
        });
        dispatch(setAlert("No se puede procesar la solicitud", 'error'));
    }
}
export const delete_resource_ot = (pk, params) => async dispatch => {
    const config = {
        headers: {
            'Authorization': `JWT ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        },
    };

    try {
        const res = await axios.delete(`${process.env.REACT_APP_API_URL}/api/management/works/delete/${pk}/resource`, config);
        if (res.status === 200) {
            dispatch({
                type: DELETE_RESOURCE_OT_SUCCESS,
                payload: res.data
            });
            dispatch(get_works(params))
            dispatch(setAlert('Artículo eliminado', 'success'));
        } else {
            dispatch({
                type: DELETE_RESOURCE_OT_FAIL
            });
        }
    } catch (err) {
        dispatch({
            type: DELETE_RESOURCE_OT_FAIL
        });
        dispatch(setAlert("No se puede procesar la solicitud", 'error'));
    }
}


export const add_helper_ot = (form, pk, params) => async dispatch => {
    const config = {
        headers: {
            'Authorization': `JWT ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        }
    };

    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/management/works/update/${pk}/helper`, form, config);
        if (res.status === 201) {
            dispatch({
                type: ADD_HELPER_OT_SUCCESS,
                payload: res.data
            });
            dispatch(get_works(params))
            dispatch(setAlert('Personal añadido', 'success'));
        } else {
            dispatch({
                type: ADD_HELPER_OT_FAIL
            });
        }
    } catch (err) {
        dispatch({
            type: ADD_HELPER_OT_FAIL
        });
        dispatch(setAlert("No se puede procesar la solicitud", 'error'));
    }
}
export const delete_helper_ot = (pk, params) => async dispatch => {
    const config = {
        headers: {
            'Authorization': `JWT ${localStorage.getItem('access')}`,
            'Accept': 'application/json'
        },
    };

    try {
        const res = await axios.delete(`${process.env.REACT_APP_API_URL}/api/management/works/delete/${pk}/helper`, config);
        if (res.status === 200) {
            dispatch({
                type: DELETE_HELPER_OT_SUCCESS,
                payload: res.data
            });
            dispatch(get_works(params))
            dispatch(setAlert('Personal eliminado', 'success'));
        } else {
            dispatch({
                type: DELETE_HELPER_OT_FAIL
            });
        }
    } catch (err) {
        dispatch({
            type: DELETE_HELPER_OT_FAIL
        });
        dispatch(setAlert("No se puede procesar la solicitud", 'error'));
    }
}
