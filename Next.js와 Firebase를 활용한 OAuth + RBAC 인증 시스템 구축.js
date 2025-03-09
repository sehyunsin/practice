//Firebase Authentication을 활용한 OAuth 로그인
//Firebase Firestore에 사용자 역할 저장 및 조회
//Next.js에서 역할 기반 접근 제어 적용

//npm install firebase

//lib/firebase.js (Firebase 설정)
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';

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
export const googleProvider = new GoogleAuthProvider();


//app/actions.js (OAuth 로그인 및 역할 조회)
'use server';

import { auth, db, googleProvider } from '../lib/firebase';
import { signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export async function signInWithGoogle() {
  const userCredential = await signInWithPopup(auth, googleProvider);
  const user = userCredential.user;

  const userRef = doc(db, 'users', user.uid);
  let userRole = 'user';

  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    userRole = userSnap.data().role;
  } else {
    await setDoc(userRef, { email: user.email, role: userRole });
  }

  return { email: user.email, role: userRole };
}

export async function logoutUser() {
  await signOut(auth);
  return { message: '로그아웃 완료' };
}

//app/page.js (OAuth + RBAC 로그인 UI)
import { signInWithGoogle, logoutUser } from './actions';
import { useState } from 'react';

export default function Home() {
  const [user, setUser] = useState(null);

  async function handleLogin() {
    const response = await signInWithGoogle();
    setUser(response);
  }

  async function handleLogout() {
    await logoutUser();
    setUser(null);
  }

  return (
    <div>
      <h1>Firebase OAuth 로그인</h1>
      {!user ? (
        <button onClick={handleLogin}>Google 로그인</button>
      ) : (
        <div>
          <p>이메일: {user.email}</p>
          <p>역할: {user.role}</p>
          {user.role === 'admin' && <p>관리자 전용 콘텐츠</p>}
          <button onClick={handleLogout}>로그아웃</button>
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


//Firebase Authentication을 활용하면 OAuth 기반 로그인과 RBAC를 쉽게 구현 가능
//Firebase Firestore를 사용하여 사용자 역할을 저장하고 관리
//실무에서 Firebase를 활용한 인증 시스템 확장 방법 소개