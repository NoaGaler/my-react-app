import React, { useContext } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import logo from '../../attachments/logo.png'

import './Home.css'; 

const Home = () => {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      setCurrentUser(null);
      localStorage.removeItem('currentUser');
      navigate('/');
    }
  };

  return (
    <div className="homeLayout">

      <nav className="navbar">
        <div className="navLogo">
          <img src={logo} alt="TalkNet Logo" className="logoImg" />
        </div>
        
        <div className="navLinks">
          <NavLink to="/home/todos" className={({isActive}) => isActive ? 'active' : ''}>Todos</NavLink>
          <NavLink to="/home/posts" className={({isActive}) => isActive ? 'active' : ''}>Posts</NavLink>
          <NavLink to="/home/albums" className={({isActive}) => isActive ? 'active' : ''}>Albums</NavLink>
          <NavLink to="/home/info" className={({isActive}) => isActive ? 'active' : ''}>Info</NavLink>
        </div>

        <div className="navUser">
          {/* הוספת סימן שאלה למניעת שגיאת null בטעינה */}
          <span>{currentUser?.username}</span>
          <button onClick={handleLogout} className="logoutBtn">Logout</button>
        </div>
      </nav>

      <main className="contentArea">
        {/* כאן מוזרקות הקומפוננטות הפנימיות לפי הנתיב */}
        <Outlet />
      </main>
    </div>
  );
};

export default Home;





// import React, { useContext } from 'react';
// import { NavLink, Outlet, useNavigate } from 'react-router-dom';
// import { UserContext } from '../../context/UserContext';
// import './Home.css'; 

// const Home = () => {
//   const { currentUser, setCurrentUser } = useContext(UserContext);
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     if (window.confirm("Are you sure you want to log out?")) {
//       setCurrentUser(null);
//       localStorage.removeItem('currentUser');
//       navigate('/');
//     }
//   };

//   return (
//     <div className="homeLayout">

//       <nav className="navbar">
//         <div className="navLogo">MyProject</div>
        
//         <div className="navLinks">
//           <NavLink to="/home/todos" className={({isActive}) => isActive ? 'active' : ''}>Todos</NavLink>
//           <NavLink to="/home/posts" className={({isActive}) => isActive ? 'active' : ''}>Posts</NavLink>
//           <NavLink to="/home/albums" className={({isActive}) => isActive ? 'active' : ''}>Albums</NavLink>
//           <NavLink to="/home/info" className={({isActive}) => isActive ? 'active' : ''}>Info</NavLink>
//         </div>

//         <div className="navUser">
//           <span>{currentUser?.username}</span>
//           <button onClick={handleLogout} className="logoutBtn">Logout</button>
//         </div>
//       </nav>

//       <main className="contentArea">
//         <Outlet />
//       </main>
//     </div>
//   );
// };

// export default Home;