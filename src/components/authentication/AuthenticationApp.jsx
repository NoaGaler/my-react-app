import { useState } from 'react'
import Register from './Register'
import Login from './LogIn'
import './AuthenticationApp.css'

const AuthenticationApp = () => {
  const [showLogin, setShowLogin] = useState(true); // Default: show Login

  return (
    <div className="authWrapper">
      <div className="authHeader">
        <h1>TalkNet</h1>
        <p>Connect. Talk. Share.</p>
      </div>
      
      {/* Toggle Buttons */}
      <div className="authToggle">
        <button 
          onClick={() => setShowLogin(true)} 
          disabled={showLogin}
          className={showLogin ? "active" : ""}
        >
          Login
        </button>
        <button 
          onClick={() => setShowLogin(false)} 
          disabled={!showLogin}
          className={!showLogin ? "active" : ""}
        >
          Register
        </button>
      </div>

      <hr />

      {/* Conditional Rendering: Login or Register */}
      <div className="authContent">
        {showLogin ? (
          <Login /> 
        ) : (
          <Register />
        )}
      </div>
    </div>
  );
};

export default AuthenticationApp;