//브라우저 Push API + VAPID 키로 직접 푸시 전송

//사용자의 userId 기반 구독 저장

//구독/구독취소 API 라우트 구현

//Zustand 없이도 간단한 상태 처리 가능

//폴더 구조 예시
/app
  └ page.js
/components
  └ PushToggle.js
/pages
  └ api
     ├ subscribe.js
     └ unsubscribe.js
/public
  └ sw.js
/lib
  └ db.js
/lib
  └ webpush.js
/.env.local


//npm install web-push

//lib/db.js (임시 DB 역할)

// 임시 구독 저장소 (실제 서비스는 MongoDB, Redis, etc)
export const subscriptions = [];


//lib/webpush.js (VAPID 설정)

import webpush from 'web-push';

webpush.setVapidDetails(
  'mailto:admin@example.com',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

export default webpush;


//pages/api/subscribe.js (구독 등록 API)

import { subscriptions } from '../../lib/db';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { userId, subscription } = req.body;
    const exists = subscriptions.find((s) => s.userId === userId);

    if (!exists) {
      subscriptions.push({ userId, subscription });
      return res.status(200).json({ message: '구독 성공' });
    }

    return res.status(200).json({ message: '이미 구독 중' });
  }

  res.status(405).end();
}


//pages/api/unsubscribe.js (구독 취소 API)

import { subscriptions } from '../../lib/db';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { userId } = req.body;
    const index = subscriptions.findIndex((s) => s.userId === userId);

    if (index !== -1) {
      subscriptions.splice(index, 1);
      return res.status(200).json({ message: '구독 취소됨' });
    }

    return res.status(404).json({ message: '해당 사용자의 구독 없음' });
  }

  res.status(405).end();
}


//public/sw.js (서비스 워커)

self.addEventListener('push', (event) => {
  const data = event.data.json();
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: '/icon.png',
  });
});

//components/PushToggle.js

'use client';

import { useEffect, useState } from 'react';

export default function PushToggle({ userId }) {
  const [subscribed, setSubscribed] = useState(false);

  const subscribe = async () => {
    const reg = await navigator.serviceWorker.register('/sw.js');
    const sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    });

    await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, subscription: sub }),
    });

    setSubscribed(true);
  };

  const unsubscribe = async () => {
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();

    if (sub) {
      await sub.unsubscribe();

      await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      setSubscribed(false);
    }
  };

  return (
    <div>
      <p>알림 수신 상태: {subscribed ? 'ON' : 'OFF'}</p>
      <button onClick={subscribed ? unsubscribe : subscribe}>
        {subscribed ? '알림 끄기' : '알림 받기'}
      </button>
    </div>
  );
}


//app/page.js

import PushToggle from '../components/PushToggle';

export default function Home() {
  return (
    <div>
      <h1>Web Push 알림 설정</h1>
      <PushToggle userId="user_001" />
    </div>
  );
}


//.env.local

VAPID_PUBLIC_KEY=your_public_key
VAPID_PRIVATE_KEY=your_private_key
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your_public_key

//✅ 기타 팁
//webpush.generateVAPIDKeys()로 키 생성 후 .env.local에 저장

//sw.js는 꼭 public/ 폴더에 위치시켜야 작동함

//브라우저 권한 요청은 사용자 인터랙션 후 요청하는 UX가 좋음