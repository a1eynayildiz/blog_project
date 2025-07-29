import React, { useState, useEffect } from 'react';
import PostForm from './components/PostForm';
import PostList from './components/PostList';
import LoginForm from './components/LoginForm';
import './App.css';

function App() {
  const [refresh, setRefresh] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return JSON.parse(localStorage.getItem('darkMode') || 'false');
  });
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [showPostForm, setShowPostForm] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch('http://127.0.0.1:8000/posts/api/users/me/', {
            headers: {
              'Authorization': `Token ${token}`
            }
          });
          
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
            setLoggedIn(true);
          } else {
            localStorage.removeItem('token');
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    document.body.classList.toggle('dark-theme', darkMode);
  }, [darkMode]);

  const handlePostCreated = () => {
    setRefresh(!refresh);
    setShowPostForm(false);
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const handleLogin = (userData) => {
    setLoggedIn(true);
    setUser(userData);
  };

  const handleLogout = () => {
    if (window.confirm('Çıkış yapmak istediğinizden emin misiniz?')) {
      localStorage.removeItem('token');
      setLoggedIn(false);
      setUser(null);
      setShowPostForm(false);
    }
  };

  const togglePostForm = () => {
    setShowPostForm(!showPostForm);
  };

  if (loading) {
    return (
      <div className={`loading-container ${darkMode ? 'dark' : ''}`}>
        <div className="spinner"></div>
        <p>Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className={`app ${darkMode ? 'dark' : ''}`}>
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">
            📝 React + Django Blog
          </h1>
          
          <div className="header-actions">
            <button 
              onClick={toggleTheme} 
              className="theme-toggle"
              title={darkMode ? 'Gündüz moduna geç' : 'Gece moduna geç'}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
            
            {loggedIn && (
              <>
                <span className="user-welcome">
                  Merhaba, <strong>{user?.username || 'Hoş geldiniz'}</strong>
                </span>
                <button 
                  onClick={handleLogout} 
                  className="logout-btn"
                  title="Çıkış yap"
                >
                  🚪 Çıkış
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {loggedIn ? (
          <div className="dashboard">
            {/* Action Bar */}
            <div className="action-bar">
              <button 
                onClick={togglePostForm}
                className={`new-post-btn ${showPostForm ? 'active' : ''}`}
              >
                {showPostForm ? '❌ İptal Et' : '✏️ Yeni Post Yaz'}
              </button>
              
              <button 
                onClick={() => setRefresh(!refresh)}
                className="refresh-btn"
                title="Postları yenile"
              >
                🔄 Yenile
              </button>
            </div>

            {/* Post Form */}
            {showPostForm && (
              <div className="post-form-container">
                <h2>✨ Yeni Post Oluştur</h2>
                <PostForm onPostCreated={handlePostCreated} />
              </div>
            )}

            {/* Posts */}
            <div className="posts-container">
              <PostList refresh={refresh} />
            </div>
          </div>
        ) : (
          // Login Page
          <div className="login-page">
            <div className="login-container">
              <div className="login-header">
                <h2>🔐 Giriş Yapın</h2>
                <p>Blog yazıları paylaşmak için giriş yapmanız gerekiyor.</p>
              </div>
              <LoginForm onLogin={handleLogin} />
            </div>
            
            {/* Demo Info */}
            <div className="demo-info">
              <h3>📋 Demo Bilgileri</h3>
              <p>Henüz hesabınız yok mu? Django admin panelden kullanıcı oluşturabilirsiniz.</p>
              <a 
                href="http://127.0.0.1:8000/admin" 
                target="_blank" 
                rel="noopener noreferrer"
                className="admin-link"
              >
                🔧 Admin Paneli
              </a>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>
          Made with ❤️ using React + Django REST Framework
          {loggedIn && (
            <span className="online-indicator">
              🟢 Çevrimiçi
            </span>
          )}
        </p>
      </footer>
    </div>
  );
}

export default App;