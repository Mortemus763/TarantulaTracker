import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { thunkSignup } from "../../redux/session";
import "./SignupForm.css";

function SignupFormModal() {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [first_name, setFirst_name] = useState("");
  const [last_name, setLast_name] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setErrors({
        confirmPassword:
          "Confirm Password field must be the same as the Password field",
      });
    }

    const serverResponse = await dispatch(
      thunkSignup({
        email,
        username,
        first_name,
        last_name,
        password,
      })
    );

    if (serverResponse) {
      setErrors(serverResponse);
    } else {
      closeModal();
    }
  };

  return (
    <div className="signup-form-modal">
      <h1>Sign Up</h1>
      {errors.server && <p className="error">{errors.server}</p>}

      <form className="signup-form" onSubmit={handleSubmit}>
        <label>Email:</label>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {errors.email && <p className="error">{errors.email}</p>}

        <label>Username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        {errors.username && <p className="error">{errors.username}</p>}

        <label>First Name:</label>
        <input
          type="text"
          value={first_name}
          onChange={(e) => setFirst_name(e.target.value)}
          required
        />
        {errors.first_name && <p className="error">{errors.first_name}</p>}

        <label>Last Name:</label>
        <input
          type="text"
          value={last_name}
          onChange={(e) => setLast_name(e.target.value)}
          required
        />
        {errors.last_name && <p className="error">{errors.last_name}</p>}

        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {errors.password && <p className="error">{errors.password}</p>}

        <label>Confirm Password:</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}

        <button className="signup-button" type="submit">
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default SignupFormModal;
