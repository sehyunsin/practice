/* pages/products/[id].js */
export async function getStaticPaths() {
    const res = await fetch('https://jsonplaceholder.typicode.com/posts');
    const posts = await res.json();
  
    const paths = posts.map((post) => ({
      params: { id: post.id.toString() },
    }));
  
    return { paths, fallback: 'blocking' };
  }
  
  export async function getStaticProps({ params }) {
    const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${params.id}`);
    const post = await res.json();
  
    return {
      props: { post },
      revalidate: 30, // 30초마다 ISR 동작
    };
  }
  
  export default function ProductPage({ post }) {
    return (
      <div>
        <h1>{post.title}</h1>
        <p>{post.body}</p>
      </div>
    );
  }
  