import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/LandingPage.css';

function LandingPage() {
  return (
    <div className="landing-page">
      <header>
        <img src="/logo.jpeg" alt="WOFUO Logo" className="logo" />
        <h1>Women for Future Organization</h1>
        <h2>WOFUO</h2>
      </header>
      <main>
        <h2>Empowering Men, Women, and The Youth Economically</h2>
        <div className="auth-buttons">
          <Link to="/login" className="login-btn">Login</Link>
          <Link to="/signup" className="signup-btn">Sign Up</Link>
        </div>
      </main>
    </div>
  );
}

export default LandingPage;