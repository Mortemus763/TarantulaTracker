import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchForums } from "../../redux/forum";
import { useModal } from "../../context/Modal";
import ForumPostForm from "../ForumPostForm/ForumPostForm";
import EditForumPostForm from "../EditForumPostForm/EditForumPostForm";
import DeleteForumPostModal from "../DeleteForumPostModal/DeleteForumPostModal";
import "./ForumPage.css";

function ForumPage() {
    const dispatch = useDispatch();
    const { setModalContent } = useModal();
    const user = useSelector((state) => state.session.user);
    const forums = useSelector((state) => state.forums?.list || []);

    useEffect(() => {
        dispatch(fetchForums());
    }, [dispatch]);

    return (
        <div className="forum-container">
            <h1>Forums</h1>
            <button className="create-forum-btn" onClick={() => setModalContent(<ForumPostForm />)}>
                Create New Forum+
            </button>

            {forums.length === 0 && <p>No forum posts found.</p>}

            {forums.length > 0 && (
                <div className="forum-list">
                    {forums.map((forum) => (
                        <div key={forum.id} className="forum-item">
                            <h3>{forum.title}</h3>
                            <p>{forum.content}</p>

                            {forum.tags && forum.tags.length > 0 && (
                                <div className="forum-tags">
                                    {forum.tags.map((tag) => (
                                        <span key={tag.id} className="forum-tag">{tag.name}</span>
                                    ))}
                                </div>
                            )}

                            <div className="forum-actions">
                                {user && user.id === forum.user_id && (
                                    <>
                                        <button
                                            className="edit-btn"
                                            onClick={() => setModalContent(<EditForumPostForm forum={forum} />)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="delete-btn"
                                            onClick={() => setModalContent(<DeleteForumPostModal forumId={forum.id} />)}
                                        >
                                            Delete
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ForumPage;
