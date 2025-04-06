// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token');

  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'], // 보호할 경로
};


//접근 제어: 권한에 따라 페이지 분기 처리 (Client-side)
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function AdminPage() {
  const router = useRouter();
  const role = 'user'; // 예: 서버나 context로부터 받아옴

  useEffect(() => {
    if (role !== 'admin') {
      router.replace('/403');
    }
  }, [role]);

  if (role !== 'admin') return null;

  return <h1>관리자 전용 페이지</h1>;
}


// pages/403.tsx
export default function Forbidden() {
    return <h1>403 - 접근 권한이 없습니다 🛑</h1>;
  }
  