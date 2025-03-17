import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import "./HomePage.css";

function HomePage() {
  const user = useSelector((state) => state.session.user);

  return (
    <div className="homepage-container">
      {user ? (
        <h1>Welcome, {user.username}!</h1>
      ) : (
        <div className="welcome-message">
          <h1>Welcome to TarantulaTracker!</h1>
          <p>To get started, first try signing up or logging in.</p>
          <div className="auth-links">
            <NavLink to="/signup" className="signup-link-home">Sign Up</NavLink>
            <NavLink to="/login" className="login-link-home">Log In</NavLink>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;
