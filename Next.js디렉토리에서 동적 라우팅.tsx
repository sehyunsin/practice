// app/product/[id]/page.tsx
import { useParams } from 'next/navigation';

export default function ProductPage() {
  const params = useParams();
  return <h1>상품 ID: {params.id}</h1>;
}


// ✅ useParams()는 app/ 디렉토리 전용이며 pages/의 useRouter().query 대신 사용됨
