import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  const [displayedText, setDisplayedText] = useState('');
  const fullText = "EMPOWERING MEN, WOMEN AND THE YOUTH ECONOMICALLY.";
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let timeout;
    if (isTyping) {
      if (displayedText.length < fullText.length) {
        timeout = setTimeout(() => {
          setDisplayedText(fullText.slice(0, displayedText.length + 1));
        }, 100);
      } else {
        setIsTyping(false);
        timeout = setTimeout(() => {
          setIsTyping(true);
          setDisplayedText('');
        }, 3000);
      }
    }
    return () => clearTimeout(timeout);
  }, [displayedText, isTyping]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-600 to-blue-500 text-white text-center p-4">
      <header className="mb-10 animate-fade-in-down">
        <img src="/logo.jpeg" alt="WOFUO Logo" className="w-24 h-auto mx-auto mb-4" />
        <h1 className="text-4xl md:text-5xl font-bold mb-2">Women for Future Organization</h1>
        <h2 className="text-2xl md:text-3xl font-semibold">WOFUO</h2>
      </header>
      <main className="max-w-2xl">
        <h2 className="text-xl md:text-2xl font-medium mb-8 h-16">
          {displayedText}
          <span className={`inline-block w-1 h-6 ml-1 bg-white ${isTyping ? 'animate-blink' : 'opacity-0'}`}></span>
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/login" className="bg-purple-700 hover:bg-purple-600 text-white font-bold py-2 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105">
            Login
          </Link>
          <Link to="/signup" className="bg-purple-700 hover:bg-purple-600 text-white font-bold py-2 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105">
            Sign Up
          </Link>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;