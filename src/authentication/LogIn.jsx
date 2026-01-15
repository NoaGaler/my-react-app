import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import useFetch from '../hooks/useFetch';

const Login = () => {
  const { setCurrentUser, API_BASE } = useContext(UserContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchUrl = username ? `${API_BASE}/users?username=${username}` : null;
  const { data: users, loading } = useFetch(fetchUrl);

  const handleLogin = (e) => {
    e.preventDefault();

    if (loading) return;

    const user = users?.[0];
    if (user && user.website === password) {
      const userToSave = {
        id: user.id,
        username: user.username,
        email: user.email
      };

      setCurrentUser(userToSave);
      localStorage.setItem('currentUser', JSON.stringify(userToSave));
      navigate(`/${user.username}/home`);
    } else {
      setError('Incorrect username or password');
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