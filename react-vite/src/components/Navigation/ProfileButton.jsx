import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaUserCircle } from 'react-icons/fa';
import { thunkLogin, thunkLogout } from "../../redux/session";


function ProfileButton() {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      }
    };

    document.addEventListener("click", closeMenu);
    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    await dispatch(thunkLogin({ email, password }));
    closeMenu();
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

  return (
    <div className="profile-container">
      <button onClick={toggleMenu} className="profile-icon">
        <FaUserCircle />
      </button>
      {showMenu && (
        <div className="profile-dropdown" ref={ulRef}>
          {user ? (
            <>
              <p className="profile-username">{user.username}</p>
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
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="submit" className="login-button">Log In</button>
              <button type="button" className="signup-button">Sign Up</button>
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