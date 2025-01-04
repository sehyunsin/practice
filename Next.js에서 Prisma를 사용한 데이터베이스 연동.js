//npm install prisma --save-dev
//npx prisma init
//npm install @prisma/client


//prisma/schema.prisma
generator client {
    provider = "prisma-client-js"
  }
  
  datasource db {
    provider = "sqlite"
    url      = "file:./dev.db"
  }
  
  model Post {
    id      Int      @id @default(autoincrement())
    title   String
    content String
  }
  


  //pages/api/posts.js
  import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const posts = await prisma.post.findMany();
    res.status(200).json(posts);
  } else if (req.method === 'POST') {
    const { title, content } = req.body;
    const post = await prisma.post.create({ data: { title, content } });
    res.status(201).json(post);
  } else if (req.method === 'DELETE') {
    const { id } = req.body;
    await prisma.post.delete({ where: { id: parseInt(id, 10) } });
    res.status(200).json({ message: 'Post deleted' });
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}


//pages/posts.js
import { useState, useEffect } from 'react';

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: '', content: '' });

  useEffect(() => {
    async function fetchPosts() {
      const res = await fetch('/api/posts');
      const data = await res.json();
      setPosts(data);
    }
    fetchPosts();
  }, []);

  const addPost = async () => {
    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPost),
    });
    const data = await res.json();
    setPosts((prev) => [...prev, data]);
    setNewPost({ title: '', content: '' });
  };

  const deletePost = async (id) => {
    await fetch('/api/posts', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setPosts((prev) => prev.filter((post) => post.id !== id));
  };

  return (
    <div>
      <h1>Prisma와 연동된 게시물</h1>
      <input
        placeholder="제목"
        value={newPost.title}
        onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
      />
      <input
        placeholder="내용"
        value={newPost.content}
        onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
      />
      <button onClick={addPost}>게시물 추가</button>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            <button onClick={() => deletePost(post.id)}>삭제</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
