import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchTarantulas } from "../../redux/tarantulas";
import { fetchFavorites, removeFavorite } from "../../redux/favorite";
import { FaHeart } from "react-icons/fa";

function FavoritesPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const tarantulas = useSelector((state) => state.tarantulas?.list || []);
    const favoriteTarantulaIds = useSelector((state) => state.favorites?.list || []);
    const [favoriteTarantulas, setFavoriteTarantulas] = useState([]);

    useEffect(() => {
        dispatch(fetchTarantulas());
        dispatch(fetchFavorites());
    }, [dispatch]);

    useEffect(() => {
        setFavoriteTarantulas(tarantulas.filter(t => favoriteTarantulaIds.includes(t.id)));
    }, [tarantulas, favoriteTarantulaIds]);

    return (
        <div className="collection-container">
            <h1>Favorites</h1>

            {favoriteTarantulas.length === 0 ? (
                <p>No favorite tarantulas found.</p>
            ) : (
                <div className="collection-list">
                    {favoriteTarantulas.map((tarantula, index) => (
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
                            </div>
                            <div
                                className="favorite-icon"
                                onClick={(e) => {
                                    e.stopPropagation(); 
                                    dispatch(removeFavorite(tarantula.id));
                                }}
                            >
                                <FaHeart className="heart-icon filled" style={{ color: "red" }} />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default FavoritesPage;
