import * as actionTypes from "./ActionType";

const initialState = {
  shifts: [],
  currentShift: null,
  workerShifts: [],
  restaurantShifts: [],
  loading: false,
  error: null,
};

// Helper function to update a shift in an array
const updateShiftInArray = (shifts, updatedShift) => {
  return shifts.map((shift) =>
    shift.id === updatedShift.id ? updatedShift : shift
  );
};

const shiftReducer = (state = initialState, action) => {
  switch (action.type) {
    // Create Shift
    case actionTypes.CREATE_SHIFT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case actionTypes.CREATE_SHIFT_SUCCESS:
      return {
        ...state,
        loading: false,
        shifts: [...state.shifts, action.payload],
        restaurantShifts:
          state.restaurantShifts.length > 0
            ? [...state.restaurantShifts, action.payload]
            : state.restaurantShifts,
      };
    case actionTypes.CREATE_SHIFT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Update Shift
    case actionTypes.UPDATE_SHIFT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case actionTypes.UPDATE_SHIFT_SUCCESS:
      return {
        ...state,
        loading: false,
        shifts: updateShiftInArray(state.shifts, action.payload),
        restaurantShifts: updateShiftInArray(
          state.restaurantShifts,
          action.payload
        ),
        workerShifts: updateShiftInArray(state.workerShifts, action.payload),
        currentShift:
          state.currentShift?.id === action.payload.id
            ? action.payload
            : state.currentShift,
      };
    case actionTypes.UPDATE_SHIFT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Delete Shift
    case actionTypes.DELETE_SHIFT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case actionTypes.DELETE_SHIFT_SUCCESS:
      return {
        ...state,
        loading: false,
        shifts: state.shifts.filter((shift) => shift.id !== action.payload),
        restaurantShifts: state.restaurantShifts.filter(
          (shift) => shift.id !== action.payload
        ),
        workerShifts: state.workerShifts.filter(
          (shift) => shift.id !== action.payload
        ),
        currentShift:
          state.currentShift?.id === action.payload ? null : state.currentShift,
      };
    case actionTypes.DELETE_SHIFT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Get Shift
    case actionTypes.GET_SHIFT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case actionTypes.GET_SHIFT_SUCCESS:
      return {
        ...state,
        loading: false,
        currentShift: action.payload,
      };
    case actionTypes.GET_SHIFT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Get All Shifts
    case actionTypes.GET_ALL_SHIFTS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case actionTypes.GET_ALL_SHIFTS_SUCCESS:
      return {
        ...state,
        loading: false,
        shifts: action.payload,
      };
    case actionTypes.GET_ALL_SHIFTS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Get Worker Shifts
    case actionTypes.GET_WORKER_SHIFTS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case actionTypes.GET_WORKER_SHIFTS_SUCCESS:
      return {
        ...state,
        loading: false,
        workerShifts: action.payload,
      };
    case actionTypes.GET_WORKER_SHIFTS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Get Restaurant Shifts
    case actionTypes.GET_RESTAURANT_SHIFTS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case actionTypes.GET_RESTAURANT_SHIFTS_SUCCESS:
      return {
        ...state,
        loading: false,
        restaurantShifts: action.payload,
      };
    case actionTypes.GET_RESTAURANT_SHIFTS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Check In Shift
    case actionTypes.CHECK_IN_SHIFT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case actionTypes.CHECK_IN_SHIFT_SUCCESS:
      return {
        ...state,
        loading: false,
        workerShifts: updateShiftInArray(state.workerShifts, action.payload),
        currentShift:
          state.currentShift?.id === action.payload.id
            ? action.payload
            : state.currentShift,
      };
    case actionTypes.CHECK_IN_SHIFT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Check Out Shift
    case actionTypes.CHECK_OUT_SHIFT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case actionTypes.CHECK_OUT_SHIFT_SUCCESS:
      return {
        ...state,
        loading: false,
        workerShifts: updateShiftInArray(state.workerShifts, action.payload),
        currentShift:
          state.currentShift?.id === action.payload.id
            ? action.payload
            : state.currentShift,
      };
    case actionTypes.CHECK_OUT_SHIFT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Cancel Shift
    case actionTypes.CANCEL_SHIFT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case actionTypes.CANCEL_SHIFT_SUCCESS:
      return {
        ...state,
        loading: false,
        shifts: updateShiftInArray(state.shifts, action.payload),
        restaurantShifts: updateShiftInArray(
          state.restaurantShifts,
          action.payload
        ),
        workerShifts: updateShiftInArray(state.workerShifts, action.payload),
        currentShift:
          state.currentShift?.id === action.payload.id
            ? action.payload
            : state.currentShift,
      };
    case actionTypes.CANCEL_SHIFT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Update Shift Status
    case actionTypes.UPDATE_SHIFT_STATUS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case actionTypes.UPDATE_SHIFT_STATUS_SUCCESS:
      return {
        ...state,
        loading: false,
        shifts: updateShiftInArray(state.shifts, action.payload),
        restaurantShifts: updateShiftInArray(
          state.restaurantShifts,
          action.payload
        ),
        workerShifts: updateShiftInArray(state.workerShifts, action.payload),
        currentShift:
          state.currentShift?.id === action.payload.id
            ? action.payload
            : state.currentShift,
      };
    case actionTypes.UPDATE_SHIFT_STATUS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default shiftReducer;
