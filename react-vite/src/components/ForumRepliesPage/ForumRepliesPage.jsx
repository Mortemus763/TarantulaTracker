import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchForums } from "../../redux/forum";
import {
    fetchReplies,
    createReply,
    removeReply,
    editReply,
} from "../../redux/forumReplies";
import "./ForumRepliesPage.css";

function ForumRepliesPage() {
    const { forumId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const dropdownRef = useRef(null);
    const [editingId, setEditingId] = useState(null);
    const [editContent, setEditContent] = useState("");
    const [newReply, setNewReply] = useState("");
    const [showMenuId, setShowMenuId] = useState(null);

    const user = useSelector((state) => state.session.user);
    const forum = useSelector((state) =>
        state.forums?.list.find((f) => f.id === Number(forumId))
    );
    const replies = useSelector((state) =>
        Object.values(state.forumReplies || {}).filter(
            (reply) => reply.post_id === Number(forumId)
        )
    );

    useEffect(() => {
        dispatch(fetchForums());
        dispatch(fetchReplies(forumId));
    }, [dispatch, forumId]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowMenuId(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleShowMenu = (e, id) => {
        e.stopPropagation();
        setShowMenuId((prev) => (prev === id ? null : id));
    };

    const handleEditSubmit = (e, replyId) => {
        e.preventDefault();
        dispatch(editReply(replyId, editContent));
        setEditingId(null);
        setEditContent("");
    };
    const handleCreateReply = async (e) => {
        e.preventDefault();
        if (newReply.trim()) {
            await dispatch(createReply(forumId, newReply));
            setNewReply("");
        }
    };

    if (!forum) {
        return (
            <div className="not-found-container">
                <h2>Oops! Forum not found.</h2>
                <button onClick={() => navigate("/forums")}>← Back to Forums</button>
            </div>
        );
    }

    return (
        <div className="forum-replies-container">
            <h1>{forum.title}</h1>
            <p>{forum.content}</p>
    
            <div className="replies-section">
                <h2>Replies</h2>
    
                {replies.length === 0 && <p>No replies yet.</p>}
    
                {user && (
                    <form onSubmit={handleCreateReply} className="reply-form">
                        <textarea
                            placeholder="Write a reply..."
                            value={newReply}
                            onChange={(e) => setNewReply(e.target.value)}
                            rows={3}
                            required
                        />
                        <button type="submit" className="submit-reply-btn">Post Reply</button>
                    </form>
                )}
    
                <ul className="replies-list">
                    {replies.map((reply) => (
                        <div key={reply.id} className="reply-item">
                            <div className="reply-header">
                                <strong>{reply.username}</strong>
                                {user?.id === reply.user_id && (
                                    <div className="menu-wrapper" ref={dropdownRef}>
                                        <button
                                            className="post-more"
                                            onClick={(e) => toggleShowMenu(e, reply.id)}
                                        >
                                            ...
                                        </button>
                                        {showMenuId === reply.id && (
                                            <div className="dropdown-actions-replies">
                                                <button
                                                    onClick={() => {
                                                        setEditingId(reply.id);
                                                        setEditContent(reply.content);
                                                        setShowMenuId(null);
                                                    }}
                                                >
                                                    Edit
                                                </button>
                                                <button onClick={() => dispatch(removeReply(reply.id))}>
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
    
                            {editingId === reply.id ? (
                                <form
                                    className="edit-reply-form"
                                    onSubmit={(e) => handleEditSubmit(e, reply.id)}
                                >
                                    <textarea
                                        value={editContent}
                                        onChange={(e) => setEditContent(e.target.value)}
                                        rows={3}
                                        required
                                    />
                                    <div className="edit-form-buttons">
                                        <button type="submit" className="save-edit-btn">Save</button>
                                        <button
                                            type="button"
                                            className="cancel-edit-btn"
                                            onClick={() => {
                                                setEditingId(null);
                                                setEditContent("");
                                            }}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <p>{reply.content}</p>
                            )}
                        </div>
                    ))}
                </ul>
            </div>
    
            <button className="back-btn" onClick={() => navigate("/forums")}>
                ← Back to Forums
            </button>
        </div>
    );
}

export default ForumRepliesPage;
