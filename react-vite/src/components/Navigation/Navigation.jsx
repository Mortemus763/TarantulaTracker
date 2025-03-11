import { NavLink } from "react-router-dom";
import { GiSpiderAlt } from "react-icons/gi";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

function Navigation() {
  return (
    <nav className="navbar">
      <div className="nav-left">
        <NavLink to="/" className="nav-logo">
          <GiSpiderAlt className="spider-icon" /> 
        </NavLink>
      </div>

      <div className="nav-right">
        <NavLink to="/collection" className="collection-button">
          Add Collection+
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
