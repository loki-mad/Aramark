import * as actionTypes from "./ActionType";

const initialState = {
  workers: [],
  currentWorker: null,
  workerAuth: JSON.parse(localStorage.getItem("workerAuth")) || null,
  loading: false,
  error: null,
};

const workerReducer = (state = initialState, action) => {
  switch (action.type) {
    // Create Worker
    case actionTypes.CREATE_WORKER_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case actionTypes.CREATE_WORKER_SUCCESS:
      return {
        ...state,
        loading: false,
        workers: [...state.workers, action.payload],
      };
    case actionTypes.CREATE_WORKER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Update Worker
    case actionTypes.UPDATE_WORKER_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case actionTypes.UPDATE_WORKER_SUCCESS:
      return {
        ...state,
        loading: false,
        workers: state.workers.map((worker) =>
          worker.id === action.payload.id ? action.payload : worker
        ),
        currentWorker:
          state.currentWorker?.id === action.payload.id
            ? action.payload
            : state.currentWorker,
      };
    case actionTypes.UPDATE_WORKER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Delete Worker
    case actionTypes.DELETE_WORKER_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case actionTypes.DELETE_WORKER_SUCCESS:
      return {
        ...state,
        loading: false,
        workers: state.workers.filter((worker) => worker.id !== action.payload),
        currentWorker:
          state.currentWorker?.id === action.payload
            ? null
            : state.currentWorker,
      };
    case actionTypes.DELETE_WORKER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Get Worker
    case actionTypes.GET_WORKER_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case actionTypes.GET_WORKER_SUCCESS:
      return {
        ...state,
        loading: false,
        currentWorker: action.payload,
      };
    case actionTypes.GET_WORKER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Get All Workers
    case actionTypes.GET_ALL_WORKERS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case actionTypes.GET_ALL_WORKERS_SUCCESS:
      return {
        ...state,
        loading: false,
        workers: action.payload,
      };
    case actionTypes.GET_ALL_WORKERS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Toggle Worker Status
    case actionTypes.TOGGLE_WORKER_STATUS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case actionTypes.TOGGLE_WORKER_STATUS_SUCCESS:
      return {
        ...state,
        loading: false,
        workers: state.workers.map((worker) =>
          worker.id === action.payload.id ? action.payload : worker
        ),
        currentWorker:
          state.currentWorker?.id === action.payload.id
            ? action.payload
            : state.currentWorker,
      };
    case actionTypes.TOGGLE_WORKER_STATUS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Worker Login
    case actionTypes.WORKER_LOGIN_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case actionTypes.WORKER_LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        workerAuth: action.payload,
      };
    case actionTypes.WORKER_LOGIN_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case actionTypes.WORKER_LOGOUT:
      return {
        ...state,
        workerAuth: null,
      };

    default:
      return state;
  }
};

export default workerReducer;
