import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import './AuthenticationApp.css';

const AuthenticationApp = () => {
  return (
    <div className="authWrapper">
      <div className="authHeader">
        <h1>TalkNet</h1>
        <p>Connect. Talk. Share.</p>
      </div>
      
      <div className="authToggle">
        <NavLink 
          to="/login" 
          className={({ isActive }) => isActive ? "active" : ""}
        >
          Login
        </NavLink>
        <NavLink 
          to="/register" 
          className={({ isActive }) => isActive ? "active" : ""}
        >
          Register
        </NavLink>
      </div>

      <hr />

      <div className="authContent">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthenticationApp;





// import { useState } from 'react'
// import Register from './Register'
// import Login from './LogIn'
// import './AuthenticationApp.css'

// const AuthenticationApp = () => {
//   const [showLogin, setShowLogin] = useState(true); // Default: show Login

//   return (
//     <div className="authWrapper">
//       <div className="authHeader">
//         <h1>TalkNet</h1>
//         <p>Connect. Talk. Share.</p>
//       </div>
      
//       {/* Toggle Buttons */}
//       <div className="authToggle">
//         <button 
//           onClick={() => setShowLogin(true)} 
//           disabled={showLogin}
//           className={showLogin ? "active" : ""}
//         >
//           Login
//         </button>
//         <button 
//           onClick={() => setShowLogin(false)} 
//           disabled={!showLogin}
//           className={!showLogin ? "active" : ""}
//         >
//           Register
//         </button>
//       </div>

//       <hr />

//       {/* Conditional Rendering: Login or Register */}
//       <div className="authContent">
//         {showLogin ? (
//           <Login /> 
//         ) : (
//           <Register />
//         )}
//       </div>
//     </div>
//   );
// };

// export default AuthenticationApp;