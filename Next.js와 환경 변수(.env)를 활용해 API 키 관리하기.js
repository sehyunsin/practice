/* .env.local 파일을 사용해 API 키를 안전하게 관리
서버사이드에서 API 키를 불러와 데이터 패칭
클라이언트에서는 민감 정보가 노출되지 않도록 처리*/

//.env.local 

/* NEXT_PUBLIC_API_URL=https://jsonplaceholder.typicode.com
MY_SECRET_API_KEY=secret123 */




//pages/secure-fetch.js
export async function getServerSideProps() {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const SECRET_KEY = process.env.MY_SECRET_API_KEY;
  
    const res = await fetch(`${API_URL}/posts`, {
      headers: {
        Authorization: `Bearer ${SECRET_KEY}`,
      },
    });
    const data = await res.json();
  
    return {
      props: { posts: data.slice(0, 5) },
    };
  }
  
  export default function SecureFetch({ posts }) {
    return (
      <div>
        <h1>환경 변수 활용 예제</h1>
        <ul>
          {posts.map((post) => (
            <li key={post.id}>{post.title}</li>
          ))}
        </ul>
      </div>
    );
  }
  