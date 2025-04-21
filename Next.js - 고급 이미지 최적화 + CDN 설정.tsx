// next.config.js
module.exports = {
    images: {
      domains: ['my-cdn.com'],
      formats: ['image/avif', 'image/webp'],
    },
  };
  
  // components/OptimizedImage.tsx
import Image from 'next/image';

export default function OptimizedImage() {
  return (
    <Image
      src="https://my-cdn.com/image.jpg"
      alt="제품 이미지"
      width={600}
      height={400}
      quality={75}
      priority
      sizes="(max-width: 768px) 100vw, 600px"
    />
  );
}

✅ WebP, AVIF, lazy loading, responsive 자동 적용
✅ CDN을 함께 사용하면 글로벌 속도 + 트래픽 비용 ↓
