import React, { useState, useEffect } from 'react';

const PostList = ({ refresh }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingPost, setEditingPost] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [updateLoading, setUpdateLoading] = useState(false);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError('');
      
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
        return;
      }

      const response = await fetch('http://127.0.0.1:8000/posts/api/posts/', {
        headers: {
          'Authorization': `Token ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        // API response'u array olabilir veya results property'si içinde olabilir
        const postsData = Array.isArray(data) ? data : (data.results || []);
        setPosts(postsData);
        setError('');
      } else if (response.status === 401) {
        setError('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
        localStorage.removeItem('token');
        window.location.reload();
      } else {
        setError('Postlar yüklenirken hata oluştu!');
      }
    } catch (error) {
      console.error('Fetch posts error:', error);
      setError('Bağlantı hatası! Lütfen internet bağlantınızı kontrol edin.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [refresh]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // Türkçe tarih formatı
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      weekday: 'long',
      timeZone: 'Europe/Istanbul'
    };

    const formattedDate = date.toLocaleDateString('tr-TR', options);
    
    // Zaman farkı hesaplama
    let timeAgo = '';
    if (diffMinutes < 1) {
      timeAgo = 'Şimdi';
    } else if (diffMinutes < 60) {
      timeAgo = `${diffMinutes} dakika önce`;
    } else if (diffHours < 24) {
      timeAgo = `${diffHours} saat önce`;
    } else if (diffDays === 1) {
      timeAgo = 'Dün';
    } else if (diffDays < 7) {
      timeAgo = `${diffDays} gün önce`;
    } else {
      timeAgo = `${Math.floor(diffDays / 7)} hafta önce`;
    }

    return { formattedDate, timeAgo };
  };

  const handleDelete = async (postId, postTitle) => {
    const confirmMessage = `"${postTitle}" başlıklı postu silmek istediğinizden emin misiniz?\n\nBu işlem geri alınamaz!`;
    
    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
        return;
      }

      const response = await fetch(`http://127.0.0.1:8000/posts/api/posts/${postId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${token}`
        }
      });

      if (response.ok) {
        // UI'dan postunu kaldır
        setPosts(posts.filter(post => post.id !== postId));
        alert('Post başarıyla silindi! ✅');
      } else if (response.status === 401) {
        alert('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
        localStorage.removeItem('token');
        window.location.reload();
      } else if (response.status === 403) {
        alert('Bu postu silme yetkiniz yok! ❌');
      } else if (response.status === 404) {
        alert('Post bulunamadı! ❌');
        // Post zaten yoksa listeden kaldır
        setPosts(posts.filter(post => post.id !== postId));
      } else {
        alert('Post silinirken hata oluştu! ❌');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Bağlantı hatası! Lütfen internet bağlantınızı kontrol edin. ❌');
    }
  };

  const startEdit = (post) => {
    setEditingPost(post.id);
    setEditTitle(post.title);
    setEditContent(post.content);
  };

  const cancelEdit = () => {
    setEditingPost(null);
    setEditTitle('');
    setEditContent('');
  };

  const handleUpdate = async (postId) => {
    if (!editTitle.trim() || !editContent.trim()) {
      alert('Başlık ve içerik boş olamaz! ❌');
      return;
    }

    if (editTitle.length > 200) {
      alert('Başlık 200 karakterden uzun olamaz! ❌');
      return;
    }

    if (editContent.length > 5000) {
      alert('İçerik 5000 karakterden uzun olamaz! ❌');
      return;
    }

    setUpdateLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
        return;
      }

      const response = await fetch(`http://127.0.0.1:8000/posts/api/posts/${postId}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        },
        body: JSON.stringify({
          title: editTitle.trim(),
          content: editContent.trim()
        })
      });

      if (response.ok) {
        const updatedPost = await response.json();
        
        // Posts listesini güncelle
        setPosts(posts.map(post => 
          post.id === postId ? updatedPost : post
        ));
        
        // Edit modundan çık
        setEditingPost(null);
        setEditTitle('');
        setEditContent('');
        
        alert('Post başarıyla güncellendi! ✅');
      } else if (response.status === 401) {
        alert('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
        localStorage.removeItem('token');
        window.location.reload();
      } else if (response.status === 403) {
        alert('Bu postu düzenleme yetkiniz yok! ❌');
      } else if (response.status === 404) {
        alert('Post bulunamadı! ❌');
      } else {
        const errorData = await response.json();
        const errorMessage = errorData.detail || errorData.title?.[0] || errorData.content?.[0] || 'Post güncellenirken hata oluştu!';
        alert(`❌ ${errorMessage}`);
      }
    } catch (error) {
      console.error('Update error:', error);
      alert('Bağlantı hatası! Lütfen internet bağlantınızı kontrol edin. ❌');
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Postlar yükleniyor...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>❌ {error}</p>
        <button onClick={fetchPosts} className="retry-btn">
          🔄 Tekrar Dene
        </button>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="empty-state">
        <h3>📝 Henüz post yok</h3>
        <p>İlk postunuzu yazmaya başlayın!</p>
        <button onClick={fetchPosts} className="refresh-btn">
          🔄 Yenile
        </button>
      </div>
    );
  }

  return (
    <div className="post-list">
      <h2>📚 Blog Yazıları ({posts.length})</h2>
      {posts.map((post) => {
        const dateInfo = formatDate(post.created_at || post.date_created);
        const isEditing = editingPost === post.id;
        
        return (
          <article key={post.id} className="post-item">
            <div className="post-header">
              {isEditing ? (
                <div className="edit-title-container">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="edit-title-input"
                    maxLength={200}
                    placeholder="Post başlığı..."
                  />
                  <small className={editTitle.length > 180 ? 'warning' : ''}>
                    {editTitle.length}/200
                  </small>
                </div>
              ) : (
                <h3 className="post-title">{post.title}</h3>
              )}
              
              <div className="post-meta">
                <span className="post-author">
                  👤 {post.author?.username || post.author || 'Anonim'}
                </span>
                <div className="post-date">
                  <span className="date-full" title={dateInfo.formattedDate}>
                    📅 {dateInfo.formattedDate}
                  </span>
                  <span className="date-ago">
                    ⏰ {dateInfo.timeAgo}
                  </span>
                </div>
              </div>
            </div>

            <div className="post-content">
              {isEditing ? (
                <div className="edit-content-container">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="edit-content-textarea"
                    rows={4}
                    maxLength={5000}
                    placeholder="Post içeriği..."
                  />
                  <small className={editContent.length > 4500 ? 'warning' : ''}>
                    {editContent.length}/5000
                  </small>
                </div>
              ) : (
                <p>{post.content}</p>
              )}
            </div>

            <div className="post-actions">
              {isEditing ? (
                <>
                  <button 
                    onClick={() => handleUpdate(post.id)}
                    className="save-btn"
                    disabled={!editTitle.trim() || !editContent.trim() || updateLoading}
                  >
                    {updateLoading ? '⏳ Kaydediliyor...' : '💾 Kaydet'}
                  </button>
                  <button 
                    onClick={cancelEdit} 
                    className="cancel-btn"
                    disabled={updateLoading}
                  >
                    ❌ İptal
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => startEdit(post)}
                    className="edit-btn"
                    title="Düzenle"
                  >
                    ✏️ Düzenle
                  </button>
                  <button 
                    onClick={() => handleDelete(post.id, post.title)}
                    className="delete-btn"
                    title="Sil"
                  >
                    🗑️ Sil
                  </button>
                </>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
};

export default PostList;