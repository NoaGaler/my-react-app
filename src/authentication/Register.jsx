import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import useFetch from '../hooks/useFetch';
import useMutation from '../hooks/useMutation';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');
  const [error, setError] = useState('');

  const { setCurrentUser, setIsNewUser, API_BASE } = useContext(UserContext);
  const { mutate } = useMutation();
  const navigate = useNavigate();

  const fetchUrl = username ? `${API_BASE}/users?username=${username}` : null;
  const { data: existingUsers } = useFetch(fetchUrl);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== verifyPassword) {
      setError('The passwords do not match');
      return;
    }

    if (existingUsers?.length > 0) {
      setError('Username already taken');
      return;
    }

    try {
      const newUser = {
        username: username,
        website: password
      };

      const createdUser = await mutate(`${API_BASE}/users`, 'POST', newUser);

      if (createdUser) {
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