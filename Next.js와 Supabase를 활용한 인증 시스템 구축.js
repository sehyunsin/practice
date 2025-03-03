//Supabase를 활용한 사용자 회원가입 및 로그인
//Next.js 서버 액션(Server Actions)과 Supabase Auth 연동
//로그인 후 사용자 정보를 유지하고 보호된 페이지 구현

//npm install @supabase/supabase-js
//lib/supabase.js (Supabase 클라이언트 설정)

import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

//app/actions.js (Supabase 회원가입 및 로그인)
'use server';

import { supabase } from '../lib/supabase';

export async function signUpUser(formData) {
  const email = formData.get('email');
  const password = formData.get('password');

  const { user, error } = await supabase.auth.signUp({ email, password });

  if (error) return { error: error.message };
  return { user };
}

export async function signInUser(formData) {
  const email = formData.get('email');
  const password = formData.get('password');

  const { user, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return { error: error.message };
  return { user };
}

export async function signOutUser() {
  await supabase.auth.signOut();
  return { message: '로그아웃 완료' };
}


//app/page.js (회원가입 및 로그인 UI)
import { signUpUser, signInUser, signOutUser } from './actions';
import { useState } from 'react';

export default function Home() {
  const [message, setMessage] = useState('');

  async function handleSignUp(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const response = await signUpUser(formData);
    setMessage(response.error || '회원가입 성공');
  }

  async function handleSignIn(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const response = await signInUser(formData);
    setMessage(response.error || '로그인 성공');
  }

  async function handleSignOut() {
    await signOutUser();
    setMessage('로그아웃 완료');
  }

  return (
    <div>
      <h1>Supabase 인증 시스템</h1>
      <form onSubmit={handleSignUp}>
        <h2>회원가입</h2>
        <input type="email" name="email" placeholder="이메일" required />
        <input type="password" name="password" placeholder="비밀번호" required />
        <button type="submit">가입</button>
      </form>
      <form onSubmit={handleSignIn}>
        <h2>로그인</h2>
        <input type="email" name="email" placeholder="이메일" required />
        <input type="password" name="password" placeholder="비밀번호" required />
        <button type="submit">로그인</button>
      </form>
      <button onClick={handleSignOut}>로그아웃</button>
      {message && <p>{message}</p>}
    </div>
  );
}


//환경 변수 설정 파일: .env.local
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

//Supabase의 인증 기능을 활용하면 JWT 기반 인증을 쉽게 구현 가능
//Next.js 서버 액션과 Supabase Auth 연동을 통해 API 없이 인증 시스템 구축 가능
