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

// Create a new worker
export const createWorker = (workerData) => async (dispatch) => {
  dispatch({ type: actionTypes.CREATE_WORKER_REQUEST });
  try {
    const response = await api.post(
      "/api/workers/create",
      workerData,
      getAuthHeaders()
    );
    dispatch({
      type: actionTypes.CREATE_WORKER_SUCCESS,
      payload: response.data,
    });
    return response.data;
  } catch (error) {
    dispatch({
      type: actionTypes.CREATE_WORKER_FAILURE,
      payload: error.message,
    });
    throw error;
  }
};

// Update a worker
export const updateWorker = (workerId, workerData) => async (dispatch) => {
  dispatch({ type: actionTypes.UPDATE_WORKER_REQUEST });
  try {
    const response = await api.put(
      `/api/workers/${workerId}`,
      workerData,
      getAuthHeaders()
    );
    dispatch({
      type: actionTypes.UPDATE_WORKER_SUCCESS,
      payload: response.data,
    });
    return response.data;
  } catch (error) {
    dispatch({
      type: actionTypes.UPDATE_WORKER_FAILURE,
      payload: error.message,
    });
    throw error;
  }
};

// Delete a worker
export const deleteWorker = (workerId) => async (dispatch) => {
  dispatch({ type: actionTypes.DELETE_WORKER_REQUEST });
  try {
    await api.delete(`/api/workers/${workerId}`, getAuthHeaders());
    dispatch({
      type: actionTypes.DELETE_WORKER_SUCCESS,
      payload: workerId,
    });
    return true;
  } catch (error) {
    dispatch({
      type: actionTypes.DELETE_WORKER_FAILURE,
      payload: error.message,
    });
    throw error;
  }
};

// Get a single worker by ID
export const getWorker = (workerId) => async (dispatch) => {
  dispatch({ type: actionTypes.GET_WORKER_REQUEST });
  try {
    const response = await api.get(
      `/api/workers/${workerId}`,
      getAuthHeaders()
    );
    dispatch({
      type: actionTypes.GET_WORKER_SUCCESS,
      payload: response.data,
    });
    return response.data;
  } catch (error) {
    dispatch({
      type: actionTypes.GET_WORKER_FAILURE,
      payload: error.message,
    });
    throw error;
  }
};

// Get all workers for a restaurant
export const getWorkersByRestaurant = (restaurantId) => async (dispatch) => {
  dispatch({ type: actionTypes.GET_ALL_WORKERS_REQUEST });
  try {
    const response = await api.get(
      `/api/workers/restaurant/${restaurantId}`,
      getAuthHeaders()
    );
    dispatch({
      type: actionTypes.GET_ALL_WORKERS_SUCCESS,
      payload: response.data,
    });
    return response.data;
  } catch (error) {
    dispatch({
      type: actionTypes.GET_ALL_WORKERS_FAILURE,
      payload: error.message,
    });
    throw error;
  }
};

// Toggle worker active status
export const toggleWorkerStatus = (workerId) => async (dispatch) => {
  dispatch({ type: actionTypes.TOGGLE_WORKER_STATUS_REQUEST });
  try {
    const response = await api.put(
      `/api/workers/toggle-status/${workerId}`,
      {},
      getAuthHeaders()
    );
    dispatch({
      type: actionTypes.TOGGLE_WORKER_STATUS_SUCCESS,
      payload: response.data,
    });
    return response.data;
  } catch (error) {
    dispatch({
      type: actionTypes.TOGGLE_WORKER_STATUS_FAILURE,
      payload: error.message,
    });
    throw error;
  }
};

// Worker login
export const workerLogin = (credentials) => async (dispatch) => {
  dispatch({ type: actionTypes.WORKER_LOGIN_REQUEST });
  try {
    const response = await api.post("/api/workers/login", credentials);

    // Store worker auth data in localStorage
    localStorage.setItem("workerAuth", JSON.stringify(response.data));

    dispatch({
      type: actionTypes.WORKER_LOGIN_SUCCESS,
      payload: response.data,
    });
    return response.data;
  } catch (error) {
    dispatch({
      type: actionTypes.WORKER_LOGIN_FAILURE,
      payload: error.message,
    });
    throw error;
  }
};

// Worker logout
export const workerLogout = () => (dispatch) => {
  localStorage.removeItem("workerAuth");
  dispatch({ type: actionTypes.WORKER_LOGOUT });
};
