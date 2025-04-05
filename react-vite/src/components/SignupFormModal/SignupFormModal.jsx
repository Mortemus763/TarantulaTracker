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
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  const handleFieldChange = (setter, fieldName) => (e) => {
    setter(e.target.value);
    setErrors((prev) => ({ ...prev, [fieldName]: [] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (password !== confirmPassword) {
      return setErrors({
        confirmPassword: ["Confirm Password field must match the Password field"],
      });
    }

    const response = await dispatch(
      thunkSignup({ email, username, password })
    );

    if (response && typeof response === "object") {
      setErrors(response);
    } else {
      closeModal();
    }
  };

  return (
    <div className="signup-form-modal">
      <h1>Sign Up</h1>
      <form className="signup-form" onSubmit={handleSubmit}>
        <label>Email:</label>
        <input
          type="text"
          value={email}
          onChange={handleFieldChange(setEmail, "email")}
          required
        />
        {errors.email && errors.email.map((msg, idx) => (
          <p key={`email-${idx}`} className="error">{msg}</p>
        ))}

        <label>Username:</label>
        <input
          type="text"
          value={username}
          onChange={handleFieldChange(setUsername, "username")}
          required
        />
        {errors.username && errors.username.map((msg, idx) => (
          <p key={`username-${idx}`} className="error">{msg}</p>
        ))}

        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={handleFieldChange(setPassword, "password")}
          required
        />
        {errors.password && errors.password.map((msg, idx) => (
          <p key={`password-${idx}`} className="error">{msg}</p>
        ))}

        <label>Confirm Password:</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={handleFieldChange(setConfirmPassword, "confirmPassword")}
          required
        />
        {errors.confirmPassword && errors.confirmPassword.map((msg, idx) => (
          <p key={`confirm-${idx}`} className="error">{msg}</p>
        ))}

        <button className="signup-button" type="submit">
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default SignupFormModal;