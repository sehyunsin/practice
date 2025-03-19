//Firebase Cloud Messaging(FCM)을 활용한 브라우저 푸시 알림
//사용자가 알림을 받을 수 있도록 Firebase에서 토큰 등록
//Next.js API에서 특정 이벤트 발생 시 푸시 알림 전송

//npm install firebase

//lib/firebase.js (Firebase 설정)
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

export async function requestNotificationPermission() {
  try {
    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    });
    console.log('FCM 토큰:', token);
    return token;
  } catch (error) {
    console.error('알림 권한 요청 실패', error);
  }
}

export function onMessageListener() {
  return new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
}

//public/firebase-messaging-sw.js (Firebase 푸시 알림 서비스 워커)
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging.js');

firebase.initializeApp({
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: '/icon.png',
  });
});

//components/PushNotification.js (브라우저 푸시 알림 요청)
'use client';

import { useEffect, useState } from 'react';
import { requestNotificationPermission, onMessageListener } from '../lib/firebase';

export default function PushNotification() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    requestNotificationPermission();
    onMessageListener().then((payload) => {
      setMessage(payload.notification.body);
    });
  }, []);

  return (
    <div>
      <h2>푸시 알림</h2>
      {message && <p>새로운 알림: {message}</p>}
    </div>
  );
}

//app/page.js
import PushNotification from '../components/PushNotification';

export default function Home() {
  return (
    <div>
      <PushNotification />
    </div>
  );
}

//.env.local
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-firebase-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-firebase-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-firebase-app-id
NEXT_PUBLIC_FIREBASE_VAPID_KEY=your-firebase-vapid-key


//Firebase Cloud Messaging을 활용하여 푸시 알림을 설정하는 방법
//Next.js와 Firebase를 결합하여 브라우저 푸시 알림을 처리하는 방법