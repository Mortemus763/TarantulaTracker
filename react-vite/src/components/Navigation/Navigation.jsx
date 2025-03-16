import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { GiSpiderAlt } from "react-icons/gi";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

function Navigation() {
  const user = useSelector((state) => state.session.user);
  const navigate = useNavigate();

  const handleCollectionClick = (e) => {
    if (!user) {
      e.preventDefault();
      alert("You must be logged in to access your collection!");
      return;
    }
    navigate("/collection");
  };
  return (
    <nav className="navbar">
      <div className="nav-left">
        <NavLink to="/" className="nav-logo">
          <GiSpiderAlt className="spider-icon" />
          <span className="nav-title">TarantulaTracker</span> 
        </NavLink>
      </div>

      <div className="nav-right">
        <NavLink to="/collection" className="collection-button" onClick={handleCollectionClick}>
          My Collection
        </NavLink>
        <NavLink to="/forums" className="nav-link">
          Forums
        </NavLink>

        <ProfileButton />
      </div>
    </nav>
  );
}

export default Navigation;
