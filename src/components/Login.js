import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { login } from '../utils/authUtil';
import Notification from './Notification';
import '../styles/Auth.css';

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { user } = await login(email, password);
      setNotification({ message: 'Login successful!', type: 'success' });
      
      // Store user info in sessionStorage
      sessionStorage.setItem('currentUser', JSON.stringify({
        uid: user.uid,
        email: user.email,
        username: user.displayName || email.split('@')[0] // Use displayName if available, otherwise use email username
      }));
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      setNotification({ message: `Login failed: ${error.message}`, type: 'error' });
    }
  };

  return (
    <div className="auth-container">
      {notification && <Notification message={notification.message} type={notification.type} />}
      <div className="auth-form-container">
        <h2>Welcome Back!</h2>
        <p>Sign in to continue to WOFUO.</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <button type="submit" className="auth-button">Sign In</button>
        </form>
        <p className="auth-link">
          Don't have an account? <Link to="/signup">Signup</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
