import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchTarantulaById } from "../../redux/tarantulas";
import "./TarantulaDetail.css";

function TarantulaDetail() {
    const { tarantulaId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const tarantula = useSelector((state) => state.tarantulas?.list.find((t) => t.id === Number(tarantulaId)));

    useEffect(() => {
        if (!tarantula) {
            dispatch(fetchTarantulaById(tarantulaId));
        }
    }, [dispatch, tarantula, tarantulaId]);

    if (!tarantula) {
        return (
            <div>
                <h2>Oops! Tarantula not found.</h2>
                <button onClick={() => navigate("/collection")}>← Back to Collection</button>
            </div>
        );
    }

    return (
        <div className="tarantula-detail-container">
            <div className="tarantula-content">
                <div className="image-section">
                    <img src={tarantula.image || "/placeholder-image.png"} alt={tarantula.species} />
                </div>
                <div className="details-section">
                    <h2>{tarantula.species}</h2>
                    {tarantula.name && <h3>{tarantula.name}</h3>}
                    <p><strong>Age:</strong> {tarantula.age ? `${tarantula.age} years` : "Unknown"}</p>
                    <p><strong>Location:</strong> {tarantula.location || "Unknown"}</p>
                    <p><strong>Description:</strong> {tarantula.description || "No description provided."}</p>
                </div>
            </div>
            <button className="back-btn" onClick={() => navigate("/collection")}>
                ← Back to Collection
            </button>
        </div>
    );
}

export default TarantulaDetail;
