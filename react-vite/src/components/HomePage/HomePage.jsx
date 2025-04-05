import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { thunkLogin } from "../../redux/session";
import "./HomePage.css";


function HomePage() {
  const user = useSelector((state) => state.session.user);

  const dispatch = useDispatch();

  const handleDemoLogin = async () => {
    await dispatch(thunkLogin({ email: "demo@aa.io", password: "password" }));
  };

  return (
    <div className="homepage-container">
      {user ? (
        <h1>Welcome, {user.username}!</h1>
      ) : (
        <div className="welcome-message">
          <h1>Welcome to TarantulaTracker!</h1>
          <p>To get started, sign up, log in, or try out the site using our Demo User!</p>
          <div className="auth-links">
            <NavLink to="/signup" className="signup-link-home">Sign Up</NavLink>
            <NavLink to="/login" className="login-link-home">Log In</NavLink>
            <button className="demo-user-home" onClick={handleDemoLogin}>
              Demo User
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;
