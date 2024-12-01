//Next.js에서 동적 라우팅 구현하기
//동적 라우팅을 활용해 사용자 ID별 페이지 생성
//getStaticPaths와 getStaticProps를 사용한 정적 생성
//간단한 사용자 정보를 JSONPlaceholder API에서 가져오기
export async function getStaticPaths() {
    const res = await fetch('https://jsonplaceholder.typicode.com/users');
    const users = await res.json();
  
    const paths = users.map((user) => ({
      params: { id: user.id.toString() },
    }));
  
    return { paths, fallback: false };
  }
  
  export async function getStaticProps({ params }) {
    const res = await fetch(`https://jsonplaceholder.typicode.com/users/${params.id}`);
    const user = await res.json();
  
    return { props: { user } };
  }
  
  export default function UserPage({ user }) {
    return (
      <div>
        <h1>사용자 정보</h1>
        <p>이름: {user.name}</p>
        <p>이메일: {user.email}</p>
        <p>웹사이트: {user.website}</p>
      </div>
    );
  }

//getStaticPaths와 getStaticProps의 역할을 명확히 설명
//Next.js의 정적 사이트 생성(SSG)과 동적 라우팅의 강점 정리
  