import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, } from "react-router-dom";
import { FaUserCircle } from 'react-icons/fa';
import { thunkLogin, thunkLogout } from "../../redux/session";
import { useModal } from "../../context/Modal";
import SignupFormModal from "../SignupFormModal";


function ProfileButton() {
  const dispatch = useDispatch();
  const { setModalContent } = useModal();
  const [showMenu, setShowMenu] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const user = useSelector((store) => store.session.user);
  const ulRef = useRef();

  const toggleMenu = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (ulRef.current && !ulRef.current.contains(e.target)) {
        setShowMenu(false);
        setErrors({});
      }
    };

    document.addEventListener("click", closeMenu);
    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => {
    setShowMenu(false);
    setErrors({});
  };


  const handleLogin = async (e) => {
    e.preventDefault();
    setErrors({});
    const response = await dispatch(thunkLogin({ email, password }));
    if (response) {
      setErrors(response);
    } else {
      closeMenu();
    }
  };

  const handleDemoLogin = async () => {
    await dispatch(thunkLogin({ email: "demo@aa.io", password: "password" }));
    closeMenu();
  };

  const logout = (e) => {
    e.preventDefault();
    dispatch(thunkLogout());
    closeMenu();
  };
  const openSignupModal = () => {
    closeMenu();
    setModalContent(<SignupFormModal />);
  };
  return (
    <div className="profile-container">
      <button onClick={toggleMenu} className="profile-icon">
        <FaUserCircle />
      </button>
      {showMenu && (
        <div className="profile-dropdown" ref={ulRef}>
          {user ? (
            <>
              <p className="profile-username">Hello, {user.username}</p>

              <NavLink to="/my-forums" className="profile-link" onClick={closeMenu}>
                My Forums
              </NavLink>

              <NavLink to="/favorites" className="profile-link" onClick={closeMenu}>
                Favorites
              </NavLink>

              <button className="logout-button" onClick={logout}>Log Out</button>
            </>
          ) : (
            <form onSubmit={handleLogin} className="login-dropdown-form">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {errors.email && <p className="error-message">{errors.email}</p>}

              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {errors.password && <p className="error-message">{errors.password}</p>}
              {errors.server && <p className="error-message">{errors.server}</p>}
              <button type="submit" className="login-button">Log In</button>
              <button
                type="button"
                className="signup-button-profile"
                onClick={openSignupModal}
              >
                Sign Up
              </button>
              <a href="#" className="demo-user-link" onClick={handleDemoLogin}>
                Demo User
              </a>
            </form>
          )}
        </div>
      )}
    </div>
  );
}

export default ProfileButton;