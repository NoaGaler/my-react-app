
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../../context/UserContext';


const Login = ({ onLogin }) => {
  const { setCurrentUser } = useContext(UserContext); // הנה הדרך לעדכן את הזיכרון!

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      // 1. משיכת כל המשתמשים כדי לבדוק התאמה
      const response = await fetch(`http://localhost:3000/users?username=${username}`);
      const users = await response.json();
      const user = users[0]; // השרת מחזיר מערך, אנחנו לוקחים את הראשון

      // 2. בדיקת אימות (שם משתמש קיים + סיסמה תואמת לשדה website)
      if (user && user.website === password) {
        //update context
        setCurrentUser(user); 
        // שמירה ב-LocalStorage כנדרש בהנחיות
        localStorage.setItem('currentUser', JSON.stringify(user) || []);
        
        // עדכון ה-State באפליקציה הראשית
        onLogin(user); 
        
        // מעבר לעמוד הבית עם ה-ID של המשתמש בכתובת
        navigate(`/users/${user.id}/home`);
      } else {
        setError('Incorrect username or password');
      }
    } catch (err) {
      setError('Server communication error');
    }
  };

  return (
    <div className="loginContainer">
      <h2>Log In</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>User Name:</label>
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
          />
        </div>
        <div>
          <label>Password:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;