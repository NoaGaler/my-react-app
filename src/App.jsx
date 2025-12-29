import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from './context/UserContext';
import AuthenticationApp from './components/authentication/AuthenticationApp';
import CompleteProfile from './components/authentication/CompleteProfile';
//import Navbar from './components/Navbar';

function App() {
  const { currentUser } = useContext(UserContext);

  return (
    <div className="App">
        {/* הנאבבר יופיע רק אם יש משתמש והוא לא בשלב השלמת הפרטים */}
        {/* {currentUser && <Navbar />} */}

        <Routes>
          {/* דף הבית/כניסה */}
          <Route path="/" element={<AuthenticationApp />} />
  
          {/* דף השלמת פרופיל - תמיד נגיש אם יש משתמש */}
          <Route path="/completeProfile" element={currentUser ? <CompleteProfile /> : <AuthenticationApp /> } />

          {/* דף השלמת פרטים */}
          <Route path="/completeProfile" element={currentUser ? <CompleteProfile /> : <Navigate to="/" />} />

          {/* נתיבים פנימיים (Placeholder כרגע) */}
          <Route path="/users/:id/home" element={<h1>Home Page of {currentUser?.username}</h1>} />
          <Route path="/users/:id/posts" element={<h1>Posts Page</h1>} />
          {/* ... שאר הנתיבים ... */}
        </Routes>
    </div>
  );
}

export default App;





// import react from 'react'
// import './App.css'
// import AuthenticationApp from "./components/authentication/AuthenticationApp"

// const App = () => {

//   return (
//     <>
//       <AuthenticationApp />
//     </>
//   )

  
// }

// export default App

