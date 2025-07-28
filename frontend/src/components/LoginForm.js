import React, { useState } from 'react';

const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim()) {
      setError('Kullanıcı adı ve şifre zorunludur!');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://127.0.0.1:8000/posts/api/auth/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username.trim(),
          password: password
        })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        onLogin(data.user);
        setUsername('');
        setPassword('');
      } else {
        setError(data.detail || data.non_field_errors?.[0] || 'Giriş başarısız!');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Bağlantı hatası! Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      {error && <div className="error-message">❌ {error}</div>}
      
      <div className="form-group">
        <label htmlFor="username">👤 Kullanıcı Adı:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Kullanıcı adınızı girin"
          disabled={loading}
          autoComplete="username"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">🔒 Şifre:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Şifrenizi girin"
          disabled={loading}
          autoComplete="current-password"
          required
        />
      </div>

      <button 
        type="submit" 
        disabled={loading || !username.trim() || !password.trim()}
        className="login-btn"
      >
        {loading ? '⏳ Giriş yapılıyor...' : '🚀 Giriş Yap'}
      </button>
    </form>
  );
};

export default LoginForm;