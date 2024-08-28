import React from 'react';
import logo from '../assets/logo.png';
import '../styles/LandingPage.css';

function LandingPage() {
  return (
    <div className="landing-page">
      <header>
        <img src={logo} alt="WOFUO Logo" className="logo" />
        <h1>Women for Future Organization</h1>
        <h2>WOFUO</h2>
      </header>
      <main>
        <h2>Empowering Men, Women, and The Youth Economically</h2>
        <div className="auth-buttons">
          <button className="login-btn">Login</button>
          <button className="signup-btn">Sign Up</button>
        </div>
      </main>
    </div>
  );
}

export default LandingPage;