import React, { useState } from 'react';

const PostForm = ({ onPostCreated }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      setError('Başlık ve içerik zorunludur!');
      return;
    }

    if (title.length > 200) {
      setError('Başlık 200 karakterden uzun olamaz!');
      return;
    }

    if (content.length > 5000) {
      setError('İçerik 5000 karakterden uzun olamaz!');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
        return;
      }

      const response = await fetch('http://127.0.0.1:8000/posts/api/posts/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim()
        })
      });

      if (response.ok) {
        const newPost = await response.json();
        console.log('Post created successfully:', newPost);
        
        // Form'u temizle
        setTitle('');
        setContent('');
        setError('');
        
        // Parent component'e bildir
        onPostCreated();
        
        // Başarı mesajı
        alert('Post başarıyla oluşturuldu! ✅');
      } else {
        const errorData = await response.json();
        console.error('Post creation error:', errorData);
        
        if (response.status === 401) {
          setError('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
          localStorage.removeItem('token');
          window.location.reload();
        } else {
          setError(errorData.detail || errorData.title?.[0] || errorData.content?.[0] || 'Post oluşturulurken hata oluştu!');
        }
      }
    } catch (error) {
      console.error('Network error:', error);
      setError('Bağlantı hatası! Lütfen internet bağlantınızı kontrol edin ve tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="post-form">
      {error && <div className="error-message">❌ {error}</div>}
      
      <div className="form-group">
        <label htmlFor="title">📝 Başlık:</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Post başlığını yazın..."
          disabled={loading}
          maxLength={200}
          required
        />
        <small className={title.length > 180 ? 'warning' : ''}>
          {title.length}/200 karakter
          {title.length > 180 && ' (Limit yaklaşıyor!)'}
        </small>
      </div>

      <div className="form-group">
        <label htmlFor="content">✍️ İçerik:</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Post içeriğini yazın..."
          rows={6}
          disabled={loading}
          maxLength={5000}
          required
        />
        <small className={content.length > 4500 ? 'warning' : ''}>
          {content.length}/5000 karakter
          {content.length > 4500 && ' (Limit yaklaşıyor!)'}
        </small>
      </div>

      <button 
        type="submit" 
        disabled={loading || !title.trim() || !content.trim()}
        className="submit-btn"
      >
        {loading ? (
          <>
            <span className="loading-spinner"></span>
            ⏳ Gönderiliyor...
          </>
        ) : (
          '📤 Paylaş'
        )}
      </button>
    </form>
  );
};

export default PostForm;