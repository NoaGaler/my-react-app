import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext, UserProvider } from './context/UserContext';

// ייבוא הלוגו
import logo from './attachments/logo.png'

// עמודי הרישום והכניסה
import Login from './components/authentication/LogIn';
import Register from './components/authentication/Register';
import CompleteProfile from './components/authentication/CompleteProfile';
import AuthenticationApp from './components/authentication/AuthenticationApp';

// עמודי הבית
import Home from './pages/home/Home';
import TodosPage from './pages/todos/TodosPage';
import PostsPage from './pages/posts/PostsPage';
import AlbumsPage from './pages/albums/AlbumsPage';
import UserInfo from './pages/info/UserInfo';

function AppContent() {
  // שינוי: שאיבת הסטייט isNewUser מהקונטקסט
  const { currentUser, isNewUser } = useContext(UserContext);

  return (
    <Routes>
      {/* דף הכניסה הראשי - שינוי לוגיקה כאן: */}
      <Route path="/" element={
        !currentUser ? (
          <AuthenticationApp />
        ) : isNewUser ? (
          <Navigate to="/completeProfile" /> /* אם הוא חדש - נשלח להשלמה */
        ) : (
          <Navigate to="/home" /> /* אם הוא קיים ולא חדש - לבית */
        )
      } />
      
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* השלמת פרופיל */}
      <Route path="/completeProfile" element={currentUser ? <CompleteProfile /> : <Navigate to="/" />} />

      {/* עמוד הבית והנתיבים הפנימיים שלו */}
      <Route path="/home" element={currentUser ? <Home /> : <Navigate to="/" />} >
        <Route index element={
          <div className="homeHero">
            <img src={logo} alt="TalkNet Logo Large" className="heroLogo" />
            <h2 className="heroSubtitle">Connect. Talk. Share.</h2>
            <div className="heroBackgroundDecoration"></div>
          </div>
        } />
        <Route path="todos" element={<TodosPage />} />
        <Route path="posts" element={<PostsPage />} />
        <Route path="albums" element={<AlbumsPage />} />
        <Route path="info" element={<UserInfo />} />
      </Route>

      <Route path="*" element={<h1>404 - Page Not Found</h1>} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <AppContent />
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;










// import React from "react";
// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import { useContext } from 'react';
// import { UserContext, UserProvider } from './context/UserContext';

// // ייבוא הלוגו
// import logo from './attachments/logo.png'

// // עמודי הרישום והכניסה
// import Login from './components/authentication/LogIn';
// import Register from './components/authentication/Register';
// import CompleteProfile from './components/authentication/CompleteProfile';
// import AuthenticationApp from './components/authentication/AuthenticationApp';

// // עמודי הבית
// import Home from './pages/home/Home';
// import TodosPage from './pages/todos/TodosPage';
// import PostsPage from './pages/posts/PostsPage';
// import AlbumsPage from './pages/albums/AlbumsPage';
// import UserInfo from './pages/info/UserInfo';

// function AppContent() {
//   const { currentUser } = useContext(UserContext);

//   return (
//     <Routes>
//       {/* דף הכניסה הראשי */}
//       <Route path="/" element={!currentUser ? <AuthenticationApp /> : <Navigate to="/home" />} />
//       <Route path="/login" element={<Login />} />
//       <Route path="/register" element={<Register />} />
      
//       {/* השלמת פרופיל */}
//       <Route path="/completeProfile" element={currentUser ? <CompleteProfile /> : <Navigate to="/" />} />

//       {/* עמוד הבית והנתיבים הפנימיים שלו */}
//       <Route path="/home" element={currentUser ? <Home /> : <Navigate to="/" />} >
        
//         {/* עמוד ברירת המחדל (Hero) - מה שרואים כשנכנסים ל-Home */}
//         <Route index element={
//           <div className="homeHero">
//             <img src={logo} alt="TalkNet Logo Large" className="heroLogo" />
//             <h2 className="heroSubtitle">Connect. Talk. Share.</h2>
//             <div className="heroBackgroundDecoration"></div>
//           </div>
//         } />

//         <Route path="todos" element={<TodosPage />} />
//         <Route path="posts" element={<PostsPage />} />
//         <Route path="albums" element={<AlbumsPage />} />
//         <Route path="info" element={<UserInfo />} />
//       </Route>

//       {/* עמוד שגיאה 404 */}
//       <Route path="*" element={<h1>404 - Page Not Found</h1>} />
//     </Routes>
//   );
// }

// function App() {
//   return (
//     <BrowserRouter>
//       <UserProvider>
//         <AppContent />
//       </UserProvider>
//     </BrowserRouter>
//   );
// }

// export default App;






