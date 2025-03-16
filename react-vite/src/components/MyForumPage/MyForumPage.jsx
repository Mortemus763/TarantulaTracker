
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchForums } from "../../redux/forum";
import { useModal } from "../../context/Modal";
import EditForumPostForm from "../EditForumPostForm/EditForumPostForm";
import DeleteForumPostModal from "../DeleteForumPostModal/DeleteForumPostModal";

function MyForumsPage() {
    const dispatch = useDispatch();
    const { setModalContent } = useModal();
    const user = useSelector((state) => state.session.user);
    const forums = useSelector((state) => state.forums?.list || []);
    
    const [filteredForums, setFilteredForums] = useState([]);

    useEffect(() => {
        dispatch(fetchForums());
    }, [dispatch]);

    useEffect(() => {
        if (user) {
            setFilteredForums(forums.filter(forum => forum.user_id === user.id));
        }
    }, [forums, user]);

    return (
        <div className="forum-container">
            <h1>My Forums</h1>
            
            {filteredForums.length === 0 ? (
                <p>No forums created yet.</p>
            ) : (
                <div className="forum-list">
                    {filteredForums.map((forum) => (
                        <div key={forum.id} className="forum-item">
                            <h3>{forum.title}</h3>
                            <p>{forum.content}</p>

                            {forum.tags?.length > 0 && (
                                <div className="forum-tags">
                                    {forum.tags.map((tag) => (
                                        <span key={tag.id} className="forum-tag">{tag.name}</span>
                                    ))}
                                </div>
                            )}

                            <div className="forum-actions">
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
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MyForumsPage;
