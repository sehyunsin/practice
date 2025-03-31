// pages/post/[id].tsx
import { useRouter } from 'next/router';

export default function PostDetail() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div>
      <h1>게시글 상세 페이지</h1>
      <p>현재 ID: {id}</p>
    </div>
  );
}


// pages/index.tsx
import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <h1>게시글 목록</h1>
      <ul>
        {[1, 2, 3].map(id => (
          <li key={id}>
            <Link href={`/post/${id}`}>Post #{id}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
