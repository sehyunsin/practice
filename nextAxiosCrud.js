/* Axios를 사용해 RESTful API 호출
목록 조회(Read), 항목 추가(Create), 수정(Update), 삭제(Delete) 기능 구현
간단한 JSONPlaceholder API 사용 */

/* npm install axios
pages/crud.js */
import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'https://jsonplaceholder.typicode.com/posts';

export default function CRUD() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    async function fetchPosts() {
      const res = await axios.get(API_URL);
      setPosts(res.data.slice(0, 10));
    }
    fetchPosts();
  }, []);

  const addPost = async () => {
    const res = await axios.post(API_URL, { title, body: '' });
    setPosts([...posts, res.data]);
    setTitle('');
  };

  const updatePost = async (id) => {
    const res = await axios.put(`${API_URL}/${id}`, { title });
    setPosts(posts.map((post) => (post.id === id ? res.data : post)));
    setEditingId(null);
    setTitle('');
  };

  const deletePost = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    setPosts(posts.filter((post) => post.id !== id));
  };

  return (
    <div>
      <h1>CRUD 기능</h1>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter title"
      />
      {editingId ? (
        <button onClick={() => updatePost(editingId)}>Update</button>
      ) : (
        <button onClick={addPost}>Add</button>
      )}
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            {post.title}
            <button onClick={() => setEditingId(post.id)}>Edit</button>
            <button onClick={() => deletePost(post.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
