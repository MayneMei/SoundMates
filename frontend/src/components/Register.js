import React, { useState } from 'react';
import { registerUser } from '../api';

function Register() {
  const [userData, setUserData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState(null);

  const handleRegister = () => {
    registerUser(userData)
      .then(response => {
        // TODO: 处理注册成功的情况，例如跳转到登录页面或显示成功消息
        console.log("Registered successfully!");
      })
      .catch(err => {
        setError("Registration failed!");
      });
  };

  return (
    <div>
      <h2>Register</h2>
      <input
        type="text"
        placeholder="Username"
        value={userData.username}
        onChange={e => setUserData({...userData, username: e.target.value})}
      />
      <input
        type="email"
        placeholder="Email"
        value={userData.email}
        onChange={e => setUserData({...userData, email: e.target.value})}
      />
      <input
        type="password"
        placeholder="Password"
        value={userData.password}
        onChange={e => setUserData({...userData, password: e.target.value})}
      />
      <button onClick={handleRegister}>Register</button>
      {error && <p>{error}</p>}
    </div>
  );
}

export default Register;
