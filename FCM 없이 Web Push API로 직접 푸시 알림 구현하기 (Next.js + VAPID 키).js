//FCM 없이 브라우저 Push API를 직접 활용

//VAPID 키를 사용하여 서버에서 알림 전송

//Next.js API 라우트를 활용한 알림 전송 서버 구축

//npm install web-push

const webpush = require('web-push');

const keys = webpush.generateVAPIDKeys();
console.log(keys);


//lib/webpush.js (VAPID 설정)
import webpush from 'web-push';

webpush.setVapidDetails(
  'mailto:admin@example.com',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

export default webpush;


//pages/api/subscribe.js (구독 저장)

let subscriptions = [];

export default function handler(req, res) {
  if (req.method === 'POST') {
    subscriptions.push(req.body);
    res.status(200).json({ message: '구독 성공' });
  } else {
    res.status(405).end();
  }
}


//pages/api/notify.js (알림 전송)

import webpush from '../../lib/webpush';

let subscriptions = []; // 실제 서비스에서는 DB 사용

export default async function handler(req, res) {
  const payload = JSON.stringify({ title: '공지', body: '새 소식이 도착했습니다!' });

  await Promise.all(
    subscriptions.map((sub) => webpush.sendNotification(sub, payload))
  );

  res.status(200).json({ message: '알림 전송 완료' });
}

//public/sw.js (서비스 워커 - 알림 수신)

self.addEventListener('push', function (event) {
  const data = event.data.json();
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: '/icon.png',
  });
});

//components/WebPushClient.js
'use client';

import { useEffect } from 'react';

export default function WebPushClient() {
  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.register('/sw.js').then((registration) => {
        registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
        }).then((subscription) => {
          fetch('/api/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(subscription),
          });
        });
      });
    }
  }, []);

  return <p>푸시 알림이 활성화되었습니다.</p>;
}

//.env.local
VAPID_PUBLIC_KEY=your-public-key
VAPID_PRIVATE_KEY=your-private-key
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your-public-key


//app/page.js
import WebPushClient from '../components/WebPushClient';

export default function Home() {
  return (
    <div>
      <WebPushClient />
    </div>
  );
}


//Web Push API는 FCM 없이도 푸시 알림을 구현할 수 있는 표준 브라우저 API

//VAPID 키를 활용해 인증된 서버에서 안전하게 푸시를 전송 가능