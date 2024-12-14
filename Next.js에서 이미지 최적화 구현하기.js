//pages/optimized-image.js
import Image from 'next/image';

export default function OptimizedImage() {
  return (
    <div>
      <h1>Next.js 이미지 최적화</h1>
      <Image
        src="https://via.placeholder.com/800"
        alt="Sample Image"
        width={800}
        height={600}
        quality={75} // 이미지 품질 조정
      />
      <p>위 이미지는 Next.js를 통해 최적화되었습니다.</p>
    </div>
  );
}

/* Next.js의 next/image는 자동으로 이미지를 최적화하여 성능을 개선
이미지의 크기, 품질, 포맷(WebP) 자동 변환 가능
클라이언트 뷰포트 크기에 따라 적절한 이미지 로딩
추가 내용
실무에서 이미지 최적화가 중요한 이유(성능, SEO)
next/image를 활용해 Lazy Loading, Placeholder 기능 구현
외부 이미지 URL 사용 시 도메인 설정 필요 */