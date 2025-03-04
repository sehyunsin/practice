//Firebase Authentication을 활용한 사용자 로그인 및 역할 저장
//Next.js에서 사용자 역할을 기반으로 접근 제한
//관리자(Admin)만 특정 페이지에 접근할 수 있도록 설정

//npm install firebase
//lib/firebase.js (Firebase 설정)
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

//app/actions.js (Firebase 사용자 역할 조회)
'use server';

import { auth, db } from '../lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export async function signInUser(formData) {
  const email = formData.get('email');
  const password = formData.get('password');

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return { user: userSnap.data() };
    } else {
      return { error: '사용자 정보가 없습니다.' };
    }
  } catch (error) {
    return { error: error.message };
  }
}

//app/page.js (RBAC 로그인 UI)
import { signInUser } from './actions';
import { useState } from 'react';

export default function Home() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  async function handleSignIn(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const response = await signInUser(formData);

    if (response.user) {
      setUser(response.user);
      setError('');
    } else {
      setError(response.error);
    }
  }

  return (
    <div>
      <h1>Firebase RBAC 로그인</h1>
      <form onSubmit={handleSignIn}>
        <input type="email" name="email" placeholder="이메일" required />
        <input type="password" name="password" placeholder="비밀번호" required />
        <button type="submit">로그인</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {user && (
        <div>
          <p>이메일: {user.email}</p>
          <p>역할: {user.role}</p>
          {user.role === 'admin' && <p>관리자 전용 콘텐츠</p>}
        </div>
      )}
    </div>
  );
}


//환경 변수 설정 파일: .env.local
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-firebase-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-firebase-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-firebase-app-id

//Firebase Authentication을 활용하여 RBAC를 구현하는 방법
//Next.js와 Firebase Firestore를 활용한 사용자 역할 조회 및 권한 설정




