import { csrfFetch } from "./csrf";

// Action Types
const LOAD_REPLIES = "forumReplies/LOAD_REPLIES";
const ADD_REPLY = "forumReplies/ADD_REPLY";
const UPDATE_REPLY = "forumReplies/UPDATE_REPLY";
const DELETE_REPLY = "forumReplies/DELETE_REPLY";

// Action Creators
const loadReplies = (replies) => ({ type: LOAD_REPLIES, replies, });
const addReply = (reply) => ({ type: ADD_REPLY, reply });
const updateReply = (reply) => ({ type: UPDATE_REPLY, reply });
const deleteReply = (replyId) => ({ type: DELETE_REPLY, replyId });


// Thunk
export const fetchReplies = (postId) => async (dispatch) => {
    const res = await csrfFetch(`/api/forum/posts/${postId}/replies`);

    if (res.status === 204) return; // No content

    const contentType = res.headers.get("Content-Type");
    if (contentType && contentType.includes("application/json")) {
        const data = await res.json();
        dispatch(loadReplies(data.replies));
    }
};
export const createReply = (postId, content) => async (dispatch) => {
    const res = await csrfFetch(`/api/forum/posts/${postId}/replies`, {
        method: "POST",
        body: JSON.stringify({ content }),
    });
    const data = await res.json();
    dispatch(addReply(data.reply));
};

export const editReply = (replyId, content) => async (dispatch) => {
    const res = await csrfFetch(`/api/forum/replies/${replyId}`, {
        method: "PUT",
        body: JSON.stringify({ content }),
    });
    const data = await res.json();
    dispatch(updateReply(data.reply));
};

export const removeReply = (replyId) => async (dispatch) => {
    await csrfFetch(`/api/forum/replies/${replyId}`, {
        method: "DELETE",
    });
    dispatch(deleteReply(replyId));
};
// Reducer
const initialState = {};

export default function forumRepliesReducer(state = initialState, action) {
    switch (action.type) {
        case LOAD_REPLIES: {
            const newState = {};
            action.replies.forEach((reply) => {
                newState[reply.id] = reply;
            });
            return newState;
        }
        case ADD_REPLY:
            return { ...state, [action.reply.id]: action.reply };

        case UPDATE_REPLY:
            return { ...state, [action.reply.id]: action.reply };

            case DELETE_REPLY: {
                const newState = { ...state };
                delete newState[action.replyId];
                return newState;
              }
        default:
            return state;
    }
}
