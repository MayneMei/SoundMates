import React, { useState } from 'react';
import { loginUser } from '../api';

function Login() {
  const [credentials, setCredentials] = useState({ emailOrUsername: '', password: '' });
  const [error, setError] = useState(null);

  const handleLogin = () => {
    loginUser(credentials)
      .then(response => {
        // TODO: 保存用户信息或JWT令牌
        console.log("Logged in successfully!");
      })
      .catch(err => {
        setError("Login failed! Please check your credentials.");
      });
  };

  return (
    <div>
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Email or Username"
        value={credentials.emailOrUsername}
        onChange={e => setCredentials({...credentials, emailOrUsername: e.target.value})}
      />
      <input
        type="password"
        placeholder="Password"
        value={credentials.password}
        onChange={e => setCredentials({...credentials, password: e.target.value})}
      />
      <button onClick={handleLogin}>Login</button>
      {error && <p>{error}</p>}
    </div>
  );
}

export default Login;
