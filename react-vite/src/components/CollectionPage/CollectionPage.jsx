import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import { fetchTarantulas } from "../../redux/tarantulas";
import "./CollectionPage.css";

function CollectionPage() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.session.user);
    const tarantulas = useSelector((state) => state.tarantulas?.list || []);

    useEffect(() => {
        if (!user) return;
        dispatch(fetchTarantulas());
    }, [dispatch, user]);

    if (!user) return <h2>Please log in to view your collection.</h2>;

    return (
        <div className="collection-container">
            <h1>Collection</h1>
            <button className="add-collection-btn">
                <NavLink to="/collection/new">Add Collection+</NavLink>
            </button>   

            {tarantulas.length === 0 && <p>No tarantulas found.</p>}

            {tarantulas.length > 0 && (
                <div className="collection-list">
                    {tarantulas.map((tarantula) => (
                        <div key={tarantula.id} className="collection-item">
                            <div className="image-placeholder">
                                <img src="/placeholder-image.png" alt="Tarantula" />
                            </div>
                            <div className="collection-details">
                                <h3>{tarantula.name}</h3>
                                <p>{tarantula.description}</p>
                                <div className="collection-actions">
                                    <button className="edit-btn">Edit</button>
                                    <button className="delete-btn">Delete</button>
                                </div>
                            </div>
                            <div className="favorite-icon">♡</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default CollectionPage;
