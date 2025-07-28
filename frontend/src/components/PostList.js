import React, { useEffect, useState } from 'react';

const PostList = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');

    fetch('http://127.0.0.1:8000/posts/api/posts/', {
      headers: {
        'Authorization': `Token ${token}`
      }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('API isteği başarısız');
        }
        return res.json();
      })
      .then(data => setPosts(data))
      .catch(error => console.error('Veri çekilirken hata:', error));
  }, []);

  return (
    <div>
      <h2>Postlar</h2>
      <ul>
        {posts.map(post => (
          <li key={post.id}>
            <strong>{post.title}</strong> — {post.content}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PostList;
