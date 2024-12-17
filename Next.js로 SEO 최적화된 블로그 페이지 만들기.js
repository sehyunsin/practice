//pages/blog/[id].js
import Head from 'next/head';

export async function getStaticPaths() {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts');
  const posts = await res.json();

  const paths = posts.map((post) => ({
    params: { id: post.id.toString() },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${params.id}`);
  const post = await res.json();

  return {
    props: { post },
  };
}

export default function BlogPost({ post }) {
  return (
    <div>
      <Head>
        <title>{post.title}</title>
        <meta name="description" content={post.body.slice(0, 150)} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.body.slice(0, 150)} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://via.placeholder.com/800" />
        <meta property="og:url" content={`https://yourblog.com/blog/${post.id}`} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <h1>{post.title}</h1>
      <p>{post.body}</p>
    </div>
  );
}
