import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchTarantulas } from "../../redux/tarantulas";
import { fetchFavorites, addFavorite, removeFavorite } from "../../redux/favorite";
import { useModal } from "../../context/Modal";
import TarantulaForm from "../AddTarantulaForm/AddTarantulaForm";
import EditTarantulaForm from "../EditTarantulaForm/EditTarantulaForm";
import DeleteTarantulaModal from "../DeleteTarantulaModal/DeleteTarantulaModal";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import "./CollectionPage.css";

function CollectionPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { setModalContent } = useModal();
    const user = useSelector((state) => state.session.user);
    const tarantulas = useSelector((state) => state.tarantulas?.list || []);
    const favoriteTarantulaIds = useSelector((state) => state.favorites?.list || []);

    useEffect(() => {
        if (!user) {
            navigate("/"); 
            return;
        }
        dispatch(fetchTarantulas());
        dispatch(fetchFavorites());
    }, [dispatch, user, navigate]);

    if (!user) return <h2>Please log in to view your collection.</h2>;

    const isFavorited = (tarantulaId) => favoriteTarantulaIds.includes(tarantulaId);

    const handleFavoriteClick = (tarantulaId) => {
        if (isFavorited(tarantulaId)) {
            dispatch(removeFavorite(tarantulaId));
        } else {
            dispatch(addFavorite(tarantulaId));
        }
    };

    return (
        <div className="collection-container">
            <h1>Collection</h1>
            <button className="add-collection-btn" onClick={() => setModalContent(<TarantulaForm />)}>
                Add Collection+
            </button>

            {tarantulas.length === 0 && <p>No tarantulas found.</p>}

            {tarantulas.length > 0 && (
                <div className="collection-list">
                    {tarantulas.map((tarantula, index) => (
                        <div
                            key={tarantula.id || `tarantula-${index}`} 
                            className="collection-item"
                            onClick={() => navigate(`/tarantulas/${tarantula.id}`)}
                        >
                            <div className="image-placeholder">
                                <img src={tarantula.image || "/placeholder-image.png"} alt="Tarantula" />
                            </div>
                            <div className="collection-details">
                                <h3>{tarantula.species}</h3>
                                <p>{tarantula.description}</p>
                                <div className="collection-actions">
                                    <button
                                        className="edit-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setModalContent(<EditTarantulaForm tarantula={tarantula} />);
                                        }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="delete-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setModalContent(<DeleteTarantulaModal tarantulaId={tarantula.id} />);
                                        }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                            <div
                                className="favorite-icon"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleFavoriteClick(tarantula.id);
                                }}
                            >
                                {isFavorited(tarantula.id) ? (
                                    <FaHeart className="heart-icon filled" style={{ color: "red" }} />
                                ) : (
                                    <FaRegHeart className="heart-icon" />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default CollectionPage;
