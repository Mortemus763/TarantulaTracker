import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { GiSpiderAlt } from "react-icons/gi";
import { BellIcon } from "lucide-react"; // optional notification icon
import ProfileButton from "./ProfileButton";

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
    <nav className="bg-white border-b shadow-sm px-6 py-4 flex items-center justify-between">
      {/* Left: Logo */}
      <div className="flex items-center space-x-2">
        <GiSpiderAlt className="text-rose-500 text-2xl" />
        <NavLink to="/" className="text-xl font-bold text-gray-800 hover:text-rose-500">
          TarantulaTracker
        </NavLink>
      </div>

      {/* Center: Navigation Links */}
      <div className="hidden md:flex space-x-6 text-sm font-medium text-gray-600">
        <NavLink to="/" className={({ isActive }) =>
          isActive ? "text-rose-600 border-b-2 border-rose-600 pb-1" : "hover:text-rose-500"
        }>
          Dashboard
        </NavLink>
        <NavLink
          to="/collection"
          onClick={handleCollectionClick}
          className={({ isActive }) =>
            isActive ? "text-rose-600 border-b-2 border-rose-600 pb-1" : "hover:text-rose-500"
          }
        >
          My Collection
        </NavLink>
        <NavLink to="/forums" className={({ isActive }) =>
          isActive ? "text-rose-600 border-b-2 border-rose-600 pb-1" : "hover:text-rose-500"
        }>
          Forums
        </NavLink>
        <NavLink to="/care-guides" className={({ isActive }) =>
          isActive ? "text-rose-600 border-b-2 border-rose-600 pb-1" : "hover:text-rose-500"
        }>
          Care Guides
        </NavLink>
      </div>

      {/* Right: Notifications + Profile */}
      <div className="flex items-center space-x-4">
        {user && (
          <button className="relative">
            <BellIcon className="text-gray-600 hover:text-rose-500 w-5 h-5" />
            {/* Notification dot */}
            <span className="absolute -top-1 -right-1 bg-red-500 h-2 w-2 rounded-full"></span>
          </button>
        )}
        <ProfileButton />
      </div>
    </nav>
  );
}

export default Navigation;
