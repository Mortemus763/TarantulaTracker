import { csrfFetch } from "./csrf";

// Action Types
const LOAD_TASKS = "tasks/LOAD_TASKS";
const ADD_TASK = "tasks/ADD_TASK";
const UPDATE_TASK = "tasks/UPDATE_TASK";
const DELETE_TASK = "tasks/DELETE_TASK";

// Action Creators
const loadTasks = (tasks) => ({
  type: LOAD_TASKS,
  tasks,
});

const addTask = (task) => ({
  type: ADD_TASK,
  task,
});

const updateTask = (task) => ({
  type: UPDATE_TASK,
  task,
});

const deleteTask = (taskId) => ({
  type: DELETE_TASK,
  taskId,
});

// Thunks
export const fetchTasks = () => async (dispatch) => {
  const res = await csrfFetch("/api/tasks/");
  const data = await res.json();
  dispatch(loadTasks(data.tasks));
};

export const createTask = (taskData) => async (dispatch) => {
  const res = await csrfFetch("/api/tasks/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(taskData),
  });
  const data = await res.json();
  dispatch(addTask(data));
};

export const editTask = (taskId, updates) => async (dispatch) => {
  const res = await csrfFetch(`/api/tasks/${taskId}/`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  const data = await res.json();
  dispatch(updateTask(data));
};

export const completeTask = (taskId) => async (dispatch) => {
  const res = await csrfFetch(`/api/tasks/${taskId}/complete/`, {
    method: "PUT",
  });
  const data = await res.json();
  dispatch(updateTask(data));
};

export const removeTask = (taskId) => async (dispatch) => {
  await csrfFetch(`/api/tasks/${taskId}/delete/`, {
    method: "DELETE",
  });
  dispatch(deleteTask(taskId));
};

// Reducer
const initialState = {};

export default function tasksReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_TASKS: {
      const newState = {};
      action.tasks.forEach((task) => {
        newState[task.id] = task;
      });
      return newState;
    }
    case ADD_TASK: {
      return { ...state, [action.task.id]: action.task };
    }
    case UPDATE_TASK: {
      return { ...state, [action.task.id]: action.task };
    }
    case DELETE_TASK: {
      const newState = { ...state };
      delete newState[action.taskId];
      return newState;
    }
    default:
      return state;
  }
}
