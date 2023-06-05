import {
    GET_GRAPHICS_COST_DAY_FAIL,
    GET_GRAPHICS_COST_DAY_SUCCESS,
    GET_GRAPHICS_OT_FAIL,
    GET_GRAPHICS_OT_SUCCESS,
    GET_GRAPHICS_PERSONNEL_FAIL,
    GET_GRAPHICS_PERSONNEL_SUCCESS,
    GET_GRAPHICS_TOTAL_COST_FAIL,
    GET_GRAPHICS_TOTAL_COST_SUCCESS,
    GET_INDICATORS_FAIL,
    GET_INDICATORS_SUCCESS,
    GET_TOTAL_OT_FAIL,
    GET_TOTAL_OT_SUCCESS,
    GET_TOTAL_TOTAL_OT_FAIL,
    GET_TOTAL_TOTAL_OT_SUCCESS
} from "../actions/types";

const initialState = {
    count_failure: null,
    count_type: null,
    count_equipment: null,
    count_facilities: null
};

export default function Graphics(state = initialState, action) {
    const {type, payload} = action;
    switch (type) {
        case GET_TOTAL_OT_SUCCESS:
            return {
                ...state, total_ot: payload.data
            }
        case GET_TOTAL_OT_FAIL:
            return {
                ...state, total_ot: null
            }
        case GET_GRAPHICS_TOTAL_COST_SUCCESS:
            return {
                ...state, cost_user: payload.user, cost_material: payload.material
            }
        case GET_GRAPHICS_TOTAL_COST_FAIL:
            return {
                ...state, cost_user: null, cost_material: null
            }
        case GET_GRAPHICS_COST_DAY_SUCCESS:
            return {
                ...state, cost_day: payload.data
            }
        case GET_GRAPHICS_COST_DAY_FAIL:
            return {
                ...state, cost_day: null
            }
        case GET_INDICATORS_SUCCESS:
            return {
                ...state, indicators: payload.data
            }
        case GET_INDICATORS_FAIL:
            return {
                ...state, indicators: null
            }

        case GET_GRAPHICS_OT_SUCCESS:
            return {
                ...state,
                count_failure: payload.count_failure,
                count_type: payload.count_type,
                count_equipment: payload.count_equipment,
                count_facilities: payload.count_facilities
            }
        case GET_GRAPHICS_OT_FAIL:
            return {
                ...state, count_failure: null, count_type: null, count_equipment: null, count_facilities: null
            }

        case GET_TOTAL_TOTAL_OT_SUCCESS:
            return {
                ...state, ot_finished: payload.finished, ot_pending: payload.pending, ot_compliance: payload.compliance
            }
        case GET_TOTAL_TOTAL_OT_FAIL:
            return {
                ...state, ot_finished: null, ot_pending: null, ot_compliance: null
            }

        case GET_GRAPHICS_PERSONNEL_SUCCESS:
            return {
                ...state,
                count_total_ot: payload.count_total_ot,
                total_hours: payload.total_hours,
                total_days: payload.days
            }
        case GET_GRAPHICS_PERSONNEL_FAIL:
            return {
                ...state, count_total_ot: null, total_hours: null, total_days: null
            }


        default:
            return state
    }
}