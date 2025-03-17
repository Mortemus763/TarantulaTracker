import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchForums } from "../../redux/forum";
import { fetchTags } from "../../redux/tags";
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
    
    const [searchTerm, setSearchTerm] = useState("");
    const [tagSearchTerm, setTagSearchTerm] = useState("");
    const [selectedTag, setSelectedTag] = useState(null);
    const [filteredForums, setFilteredForums] = useState([]);

    useEffect(() => {
        dispatch(fetchForums());
        dispatch(fetchTags());
    }, [dispatch]);

    useEffect(() => {
        let filtered = forums;

        if (searchTerm.trim()) {
            filtered = filtered.filter(forum =>
                forum.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (tagSearchTerm.trim()) {
            filtered = filtered.filter(forum =>
                forum.tags.some(tag => tag.name.toLowerCase().includes(tagSearchTerm.toLowerCase()))
            );
        }

        if (selectedTag) {
            filtered = filtered.filter(forum =>
                forum.tags.some(tag => tag.id === selectedTag)
            );
        }

        setFilteredForums(filtered);
    }, [searchTerm, tagSearchTerm, selectedTag, forums]);

    return (
        <div className="forum-container">

            <div className="forum-header">
                <h1>Forums</h1>
                <div className="forum-search">
                    <input
                        type="text"
                        placeholder="Search forums by title..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="forum-actions-container">
                <div className="tag-search">
                    <label>Tags:</label>
                    <input
                        type="text"
                        placeholder="Search forums by tag..."
                        value={tagSearchTerm}
                        onChange={(e) => setTagSearchTerm(e.target.value)}
                    />
                </div>
                {user && (
                <button className="create-forum-btn" onClick={() => setModalContent(<ForumPostForm />)}>
                    Create New Forum+
                </button>
                )}
            </div>

            {filteredForums.length === 0 ? (
                <p>No forum posts found.</p>
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
                                {user?.id === forum.user_id && (
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
