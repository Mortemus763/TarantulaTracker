import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchForums } from "../../redux/forum";
import "./ForumRepliesPage.css";

function ForumRepliesPage() {
    const { forumId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const forum = useSelector((state) => state.forums?.list.find(f => f.id === Number(forumId)));

    useEffect(() => {
        dispatch(fetchForums());
    }, [dispatch]);

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
                <p>Coming Soon...</p>
            </div>

            <button className="back-btn" onClick={() => navigate("/forums")}>
                ← Back to Forums
            </button>
        </div>
    );
}

export default ForumRepliesPage;
