// pages/posts/[id].tsx
export async function getStaticProps({ params }) {
    const res = await fetch(`https://api.example.com/posts/${params.id}`);
    const post = await res.json();
  
    return {
      props: { post },
      revalidate: 60, // 60초마다 페이지 갱신
    };
  }
  
  export async function getStaticPaths() {
    const res = await fetch('https://api.example.com/posts');
    const posts = await res.json();
  
    return {
      paths: posts.map((p) => ({ params: { id: p.id.toString() } })),
      fallback: 'blocking',
    };
  }
  
  export default function PostPage({ post }) {
    return (
      <article>
        <h1>{post.title}</h1>
        <p>{post.body}</p>
      </article>
    );
  }
  