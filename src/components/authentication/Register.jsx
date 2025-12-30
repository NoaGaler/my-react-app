import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { useContext } from 'react';
import { UserContext } from '../../context/UserContext';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');
  const [error, setError] = useState('');

  // שינוי: ייבוא setIsNewUser כדי לסמן שהמשתמש נרשם הרגע
  const { setCurrentUser, setIsNewUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== verifyPassword) {
      setError('The passwords do not match');
      return;
    }

    try {
      const checkResponse = await fetch(`http://localhost:3000/users?username=${username}`);
      const existingUsers = await checkResponse.json();

      if (existingUsers.length > 0) {
        setError('Username already taken');
        return;
      }

      const newUser = {
        name: "",
        username: username,
        email: "",
        address: {
          street: "",
          suite: "",
          city: "",
          zipcode: "",
          geo: { lat: "", lng: "" }
        },
        phone: "",
        website: password,
        company: { name: "", catchPhrase: "", bs: "" }
      };

      const saveResponse = await fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });

      if (saveResponse.ok) {
        const createdUser = await saveResponse.json();
        
        // שינוי: עדכון הדגל שזהו משתמש חדש לפני עדכון המשתמש הנוכחי
        setIsNewUser(true); 
        setCurrentUser(createdUser);
        
        localStorage.setItem('currentUser', JSON.stringify(createdUser));

        // הניווט הזה יקרה במקביל להפניה האוטומטית של App.jsx
        navigate('/completeProfile');
      }
    } catch (err) {
      setError('Registration error');
    }
  };

  return (
    <div className="registerContainer">
      <h2>Sign Up</h2>
      <form onSubmit={handleRegister}>
        <div>
          <label>User Name:</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div>
          <label>Verify Password:</label>
          <input type="password" value={verifyPassword} onChange={(e) => setVerifyPassword(e.target.value)} required />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;






// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom'; 
// import { useContext } from 'react';
// import { UserContext } from '../../context/UserContext';




// const Register = () => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [verifyPassword, setVerifyPassword] = useState('');
//   const [error, setError] = useState('');

//   const { setCurrentUser } = useContext(UserContext);
//   const navigate = useNavigate();

//   const handleRegister = async (e) => {
//     e.preventDefault();

//     if (password !== verifyPassword) {
//       setError('The passwords do not match');
//       return;
//     }

//     try {
//       // 1. בדיקה אם המשתמש כבר קיים
//       const checkResponse = await fetch(`http://localhost:3000/users?username=${username}`);
//       const existingUsers = await checkResponse.json();

//       if (existingUsers.length > 0) {
//         setError('Username already taken');
//         return;
//       }

//       // 2. יצירת משתמש חדש
//       const newUser = {
//         name: "",
//         username: username,
//         email: "",
//         address: {
//           street: "",
//           suite: "",
//           city: "",
//           zipcode: "",
//           geo: {
//             lat: "",
//             lng: ""
//           }
//         },
//         phone: "",
//         website: password,
//         company: {
//           name: "",
//           catchPhrase: "",
//           bs: ""
//         }
//       };

//       const saveResponse = await fetch('http://localhost:3000/users', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(newUser)
//       });

//       if (saveResponse.ok) {
//         const createdUser = await saveResponse.json();
//         alert('Registration successful! Please log in.');
//         setCurrentUser(createdUser);
//         localStorage.setItem('currentUser', JSON.stringify(createdUser) || []);

//         navigate('/completeProfile');
//       }
//     } catch (err) {
//       setError('Registration error');
//     }
//   };

//   return (
//     <div className="registerContainer">
//       <h2>Sign Up</h2>
//       <form onSubmit={handleRegister}>
//         <div>
//           <label>User Name:</label>
//           <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
//         </div>
//         <div>
//           <label>Password:</label>
//           <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
//         </div>
//         <div>
//           <label>Verify Password:</label>
//           <input type="password" value={verifyPassword} onChange={(e) => setVerifyPassword(e.target.value)} required />
//         </div>
//         {error && <p style={{ color: 'red' }}>{error}</p>}
//         <button type="submit">Register</button>
//       </form>
//     </div>
//   );
// };

// export default Register;