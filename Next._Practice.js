 export async function getServerSideProps() {
    // API 호출 예시
    const res = await fetch('https://jsonplaceholder.typicode.com/posts');
    const posts = await res.json();
  
    return {
      props: {
        posts,
      },
    };
  }
  
  export default function Home({ posts }) {
    return (
      <div>
        <h1>SSR로 불러온 포스트</h1>
        <ul>
          {posts.slice(0, 10).map((post) => (
            <li key={post.id}>
              <h2>{post.title}</h2>
              <p>{post.body}</p>
            </li>
          ))}
        </ul>
      </div>
    );
}
/* getServerSideProps를 활용한 데이터 패칭
간단한 API 호출을 통해 데이터를 페이지에 렌더링
스타일링은 Next.js의 기본 CSS 모듈 사용

getServerSideProps의 실행 시점을 이해하기 쉽게 정리
API 호출 결과를 화면에 렌더링하는 과정을 코드와 함께 상세 설명 */
