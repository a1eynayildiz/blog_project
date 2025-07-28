import React, { useState } from 'react';

const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();

    fetch('http://127.0.0.1:8000/posts/api/token/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
      .then(res => res.json())
      .then(data => {
        if (data.token) {
          localStorage.setItem('token', data.token);
          onLogin(); // App'e bildir
        } else {
          alert('Giriş başarısız');
        }
      })
      .catch(() => alert('Sunucu hatası'));
  };

  return (
    <form onSubmit={handleLogin} className="login-form">
      <h2>Giriş Yap</h2>
      <input
        type="text"
        placeholder="Kullanıcı adı"
        value={username}
        onChange={e => setUsername(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Şifre"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <button type="submit">Giriş</button>
    </form>
  );
};

export default LoginForm;
