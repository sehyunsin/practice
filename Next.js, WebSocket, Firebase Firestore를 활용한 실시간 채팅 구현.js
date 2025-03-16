//WebSocket을 사용하여 실시간 채팅 구현
//Firebase Firestore에 메시지를 저장하여 기록 유지
//Zustand로 상태를 관리하고 Firestore 데이터와 동기화

//npm install firebase zustand ws

//lib/firebase.js (Firebase 설정)
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, onSnapshot } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const messagesRef = collection(db, 'messages');


//store/useChatStore.js (Zustand 전역 상태)
import { create } from 'zustand';

const useChatStore = create((set) => ({
  messages: [],
  addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
}));

export default useChatStore;


//components/ChatWithFirestore.js (Firebase Firestore 연동)
'use client';

import { useEffect, useState } from 'react';
import { messagesRef, db } from '../lib/firebase';
import { addDoc, onSnapshot } from 'firebase/firestore';
import useChatStore from '../store/useChatStore';

export default function ChatWithFirestore() {
  const [message, setMessage] = useState('');
  const addMessage = useChatStore((state) => state.addMessage);
  const messages = useChatStore((state) => state.messages);

  useEffect(() => {
    const unsubscribe = onSnapshot(messagesRef, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => doc.data().text);
      useChatStore.setState({ messages: msgs });
    });

    return () => unsubscribe();
  }, []);

  const sendMessage = async () => {
    if (message.trim() !== '') {
      await addDoc(messagesRef, { text: message });
      setMessage('');
    }
  };

  return (
    <div>
      <h2>실시간 채팅 (Firestore 저장)</h2>
      <div>
        {messages.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="메시지를 입력하세요"
      />
      <button onClick={sendMessage}>전송</button>
    </div>
  );
}


//app/page.js (페이지 컴포넌트)
import ChatWithFirestore from '../components/ChatWithFirestore';

export default function Home() {
  return (
    <div>
      <ChatWithFirestore />
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



//WebSocket을 사용하여 클라이언트 간 실시간 데이터 송수신 구현
//Firebase Firestore를 활용하여 채팅 기록을 저장 및 동기화
//Next.js에서 실시간 채팅 기능을 최적화하는 방법 설명

