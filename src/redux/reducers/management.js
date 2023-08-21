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
    GET_WORK_REQUEST_FAIL,
    GET_WORK_REQUEST_SUCCESS,
    GET_WORKS_FAIL,
    GET_WORKS_SUCCESS,
    UPDATE_WORK_FAIL,
    UPDATE_WORK_SUCCESS,
    UPDATE_WORK_SUPERVISOR_FAIL,
    UPDATE_WORK_SUPERVISOR_SUCCESS
} from '../actions/types'

const initialState = {
    works: null, work_request: null
}

export default function Management(state = initialState, action) {
    const {type, payload} = action;

    switch (type) {
        case GET_WORK_REQUEST_SUCCESS:
            return {
                ...state,
                work_request: payload.data
            }
        case GET_WORK_REQUEST_FAIL:
            return {
                ...state,
                work_request: null
            }
        case GET_WORKS_SUCCESS:
            return {
                ...state,
                works: payload.data
            }
        case GET_WORKS_FAIL:
            return {
                ...state,
                works: null
            }

        case ADD_WORK_SUCCESS:
        case ADD_WORK_FAIL:
        case DELETE_WORK_SUCCESS:
        case DELETE_WORK_FAIL:
        case UPDATE_WORK_SUCCESS:
        case UPDATE_WORK_FAIL:
        case ADD_WORK_REQUEST_SUCCESS:
        case ADD_WORK_REQUEST_FAIL:
        case ADD_RESOURCE_OT_FAIL:
        case ADD_HELPER_OT_SUCCESS:
        case ADD_HELPER_OT_FAIL:
        case ADD_RESOURCE_OT_SUCCESS:
        case DELETE_HELPER_OT_SUCCESS:
        case DELETE_HELPER_OT_FAIL:
        case DELETE_RESOURCE_OT_SUCCESS:
        case DELETE_RESOURCE_OT_FAIL:
        case UPDATE_WORK_SUPERVISOR_SUCCESS:
        case UPDATE_WORK_SUPERVISOR_FAIL:
            return {
                ...state
            }
        default:
            return state
    }
}