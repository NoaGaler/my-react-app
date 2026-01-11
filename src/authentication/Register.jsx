import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');
  const [error, setError] = useState('');

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

        setIsNewUser(true);

        const userToSave = {
          id: createdUser.id,
          username: createdUser.username,
          email: ""
        };

        setCurrentUser(userToSave);
        localStorage.setItem('currentUser', JSON.stringify(userToSave));

        navigate(`/${createdUser.username}/completeProfile`);
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




