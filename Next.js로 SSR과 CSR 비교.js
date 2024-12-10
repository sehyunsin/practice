// pages/ssr.js
export async function getServerSideProps() {
    const res = await fetch('https://jsonplaceholder.typicode.com/posts');
    const posts = await res.json();
  
    return {
      props: { posts },
    };
  }
  
  export default function SSR({ posts }) {
    return (
      <div>
        <h1>Server-Side Rendering</h1>
        <ul>
          {posts.slice(0, 5).map((post) => (
            <li key={post.id}>{post.title}</li>
          ))}
        </ul>
      </div>
    );
  }
  


  // pages/csr.js
import { useEffect, useState } from 'react';

export default function CSR() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchPosts() {
      const res = await fetch('https://jsonplaceholder.typicode.com/posts');
      const data = await res.json();
      setPosts(data.slice(0, 5));
    }
    fetchPosts();
  }, []);

  return (
    <div>
      <h1>Client-Side Rendering</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </div>
  );
}
