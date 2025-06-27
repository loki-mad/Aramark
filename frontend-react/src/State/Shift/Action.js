import * as actionTypes from "./ActionType";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5454",
});

// Helper to get auth headers
const getAuthHeaders = () => {
  const jwt = localStorage.getItem("jwt");
  return jwt ? { headers: { Authorization: `Bearer ${jwt}` } } : {};
};

// Helper to get worker auth info
const getWorkerAuthHeaders = () => {
  const workerAuth = JSON.parse(localStorage.getItem("workerAuth"));
  // No token is needed for worker access based on backend security config
  return {};
};

// Create a new shift
export const createShift = (shiftData) => async (dispatch) => {
  dispatch({ type: actionTypes.CREATE_SHIFT_REQUEST });
  try {
    const response = await api.post(
      "/api/shifts/create",
      shiftData,
      getAuthHeaders()
    );
    dispatch({
      type: actionTypes.CREATE_SHIFT_SUCCESS,
      payload: response.data,
    });
    return response.data;
  } catch (error) {
    dispatch({
      type: actionTypes.CREATE_SHIFT_FAILURE,
      payload: error.message,
    });
    throw error;
  }
};

// Update a shift
export const updateShift = (shiftId, shiftData) => async (dispatch) => {
  dispatch({ type: actionTypes.UPDATE_SHIFT_REQUEST });
  try {
    const response = await api.put(
      `/api/shifts/${shiftId}`,
      shiftData,
      getAuthHeaders()
    );
    dispatch({
      type: actionTypes.UPDATE_SHIFT_SUCCESS,
      payload: response.data,
    });
    return response.data;
  } catch (error) {
    dispatch({
      type: actionTypes.UPDATE_SHIFT_FAILURE,
      payload: error.message,
    });
    throw error;
  }
};

// Delete a shift
export const deleteShift = (shiftId) => async (dispatch) => {
  dispatch({ type: actionTypes.DELETE_SHIFT_REQUEST });
  try {
    await api.delete(`/api/shifts/${shiftId}`, getAuthHeaders());
    dispatch({
      type: actionTypes.DELETE_SHIFT_SUCCESS,
      payload: shiftId,
    });
    return true;
  } catch (error) {
    dispatch({
      type: actionTypes.DELETE_SHIFT_FAILURE,
      payload: error.message,
    });
    throw error;
  }
};

// Get a single shift by ID
export const getShift = (shiftId) => async (dispatch) => {
  dispatch({ type: actionTypes.GET_SHIFT_REQUEST });
  try {
    const response = await api.get(`/api/shifts/${shiftId}`, getAuthHeaders());
    dispatch({
      type: actionTypes.GET_SHIFT_SUCCESS,
      payload: response.data,
    });
    return response.data;
  } catch (error) {
    dispatch({
      type: actionTypes.GET_SHIFT_FAILURE,
      payload: error.message,
    });
    throw error;
  }
};

// Get shifts for currently logged in worker (no JWT needed)
export const getWorkerShifts = (workerId) => async (dispatch) => {
  dispatch({ type: actionTypes.GET_WORKER_SHIFTS_REQUEST });
  try {
    const response = await api.get(
      `/api/shifts/worker/${workerId}`,
      getWorkerAuthHeaders()
    );
    dispatch({
      type: actionTypes.GET_WORKER_SHIFTS_SUCCESS,
      payload: response.data,
    });
    return response.data;
  } catch (error) {
    dispatch({
      type: actionTypes.GET_WORKER_SHIFTS_FAILURE,
      payload: error.message,
    });
    throw error;
  }
};

// Get all shifts for a worker (admin access)
export const getShiftsByWorker = (workerId) => async (dispatch) => {
  dispatch({ type: actionTypes.GET_WORKER_SHIFTS_REQUEST });
  try {
    const response = await api.get(
      `/api/shifts/worker/${workerId}`,
      getAuthHeaders()
    );
    dispatch({
      type: actionTypes.GET_WORKER_SHIFTS_SUCCESS,
      payload: response.data,
    });
    return response.data;
  } catch (error) {
    dispatch({
      type: actionTypes.GET_WORKER_SHIFTS_FAILURE,
      payload: error.message,
    });
    throw error;
  }
};

// Get all shifts for a restaurant
export const getShiftsByRestaurant = (restaurantId) => async (dispatch) => {
  dispatch({ type: actionTypes.GET_RESTAURANT_SHIFTS_REQUEST });
  try {
    const response = await api.get(
      `/api/shifts/restaurant/${restaurantId}`,
      getAuthHeaders()
    );
    dispatch({
      type: actionTypes.GET_RESTAURANT_SHIFTS_SUCCESS,
      payload: response.data,
    });
    return response.data;
  } catch (error) {
    dispatch({
      type: actionTypes.GET_RESTAURANT_SHIFTS_FAILURE,
      payload: error.message,
    });
    throw error;
  }
};

// Get all shifts for a worker within a date range
export const getShiftsByWorkerAndDateRange =
  (workerId, startTime, endTime) => async (dispatch) => {
    dispatch({ type: actionTypes.GET_WORKER_SHIFTS_REQUEST });
    try {
      const response = await api.get(
        `/api/shifts/worker/${workerId}/date-range`,
        {
          params: { startTime, endTime },
          ...getAuthHeaders(),
        }
      );
      dispatch({
        type: actionTypes.GET_WORKER_SHIFTS_SUCCESS,
        payload: response.data,
      });
      return response.data;
    } catch (error) {
      dispatch({
        type: actionTypes.GET_WORKER_SHIFTS_FAILURE,
        payload: error.message,
      });
      throw error;
    }
  };

// Get all shifts for a restaurant within a date range
export const getShiftsByRestaurantAndDateRange =
  (restaurantId, startTime, endTime) => async (dispatch) => {
    dispatch({ type: actionTypes.GET_RESTAURANT_SHIFTS_REQUEST });
    try {
      const response = await api.get(
        `/api/shifts/restaurant/${restaurantId}/date-range`,
        {
          params: { startTime, endTime },
          ...getAuthHeaders(),
        }
      );
      dispatch({
        type: actionTypes.GET_RESTAURANT_SHIFTS_SUCCESS,
        payload: response.data,
      });
      return response.data;
    } catch (error) {
      dispatch({
        type: actionTypes.GET_RESTAURANT_SHIFTS_FAILURE,
        payload: error.message,
      });
      throw error;
    }
  };

// Check in to a shift
export const checkInShift = (shiftId, workerId) => async (dispatch) => {
  dispatch({ type: actionTypes.CHECK_IN_SHIFT_REQUEST });
  try {
    const response = await api.put(
      `/api/shifts/${shiftId}/check-in/${workerId}`,
      {},
      getWorkerAuthHeaders()
    );
    dispatch({
      type: actionTypes.CHECK_IN_SHIFT_SUCCESS,
      payload: response.data,
    });
    return response.data;
  } catch (error) {
    dispatch({
      type: actionTypes.CHECK_IN_SHIFT_FAILURE,
      payload: error.message,
    });
    throw error;
  }
};

// Check out from a shift
export const checkOutShift = (shiftId, workerId) => async (dispatch) => {
  dispatch({ type: actionTypes.CHECK_OUT_SHIFT_REQUEST });
  try {
    const response = await api.put(
      `/api/shifts/${shiftId}/check-out/${workerId}`,
      {},
      getWorkerAuthHeaders()
    );
    dispatch({
      type: actionTypes.CHECK_OUT_SHIFT_SUCCESS,
      payload: response.data,
    });
    return response.data;
  } catch (error) {
    dispatch({
      type: actionTypes.CHECK_OUT_SHIFT_FAILURE,
      payload: error.message,
    });
    throw error;
  }
};

// Cancel a shift
export const cancelShift = (shiftId) => async (dispatch) => {
  dispatch({ type: actionTypes.CANCEL_SHIFT_REQUEST });
  try {
    const response = await api.put(
      `/api/shifts/${shiftId}/cancel`,
      {},
      getAuthHeaders()
    );
    dispatch({
      type: actionTypes.CANCEL_SHIFT_SUCCESS,
      payload: response.data,
    });
    return response.data;
  } catch (error) {
    dispatch({
      type: actionTypes.CANCEL_SHIFT_FAILURE,
      payload: error.message,
    });
    throw error;
  }
};

// Update shift status
export const updateShiftStatus = (shiftId, status) => async (dispatch) => {
  dispatch({ type: actionTypes.UPDATE_SHIFT_STATUS_REQUEST });
  try {
    const response = await api.put(
      `/api/shifts/${shiftId}/status?status=${status}`,
      {},
      getAuthHeaders()
    );
    dispatch({
      type: actionTypes.UPDATE_SHIFT_STATUS_SUCCESS,
      payload: response.data,
    });
    return response.data;
  } catch (error) {
    dispatch({
      type: actionTypes.UPDATE_SHIFT_STATUS_FAILURE,
      payload: error.message,
    });
    throw error;
  }
};
