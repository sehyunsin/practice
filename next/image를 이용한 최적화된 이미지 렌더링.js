// pages/image-example.tsx
import Image from 'next/image';

export default function ImageExample() {
  return (
    <div>
      <h1>Next.js 이미지 최적화</h1>
      <Image
        src="/vercel.svg" // public 폴더 기준
        alt="Vercel Logo"
        width={300}
        height={100}
        priority
      />
    </div>
  );
}
