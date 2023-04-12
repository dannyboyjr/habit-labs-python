import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { signUp } from "../../store/session";
import "./SignupForm.css";

function SignupFormPage() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [timezone, setTimezone] = useState("");
  const [errors, setErrors] = useState([]);

  if (sessionUser) return <Redirect to="/" />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
    if (password === confirmPassword) {
      const data = await dispatch(signUp(first_name, last_name, username, email, password, timezone));
      if (data) {
        setErrors(data);
      }
    } else {
      setErrors([
        "Confirm Password field must be the same as the Password field",
      ]);
    }
  };

  return (
    <div className='signup-location'>
      <form className="signup-container" onSubmit={handleSubmit}>
      <div className='signup-wrapper'>
      <div className='signup-framing'>
      <div className="signup-header">Sign Up</div>
        <ul className="error-ul-sign-in">
          {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
          ))}
        </ul>
        <label > 
          First Name
          </label>
          <input
            type="text"
            className='signup-input-name'
            value={first_name}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        
        <label>
          Last Name
          </label>
          <input
          className='signup-input-name'
            type="text"
            value={last_name}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        
        <label>
          Email
          </label>
          <input
            className='signup-input-name'
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        
        <label>
          Username
          </label>
          <input
            className='signup-input-name'
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        
        <label>
          Password
          </label>
          <input
            className='signup-input-name'
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        
        <label>
          Confirm Password
          </label>
          <input
            className='signup-input-name'
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        
        <button className='signup-btn' type="submit">Sign Up</button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default SignupFormPage;
