//npm install jsonwebtoken
//middleware.js
import { NextResponse } from 'next/server';

export function middleware(req) {
  const token = req.cookies.get('token');
  
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  try {
    // 토큰 유효성 검증
    const decoded = JSON.parse(atob(token.split('.')[1]));
    if (!decoded) throw new Error();
  } catch {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/protected/:path*'], // 보호할 경로 설정
};




//pages/login.js
import { useState } from 'react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    const token = btoa(JSON.stringify({ username }));
    document.cookie = `token=${token}; path=/`;
    window.location.href = '/protected';
  };

  return (
    <div>
      <h1>로그인</h1>
      <input
        type="text"
        placeholder="아이디"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>로그인</button>
    </div>
  );
}



//pages/protected/index.js
export default function ProtectedPage() {
    return <h1>인증된 사용자만 볼 수 있는 페이지</h1>;
  }
  