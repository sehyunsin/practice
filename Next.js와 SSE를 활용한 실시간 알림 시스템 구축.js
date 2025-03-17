//SSE(Server-Sent Events)를 활용하여 클라이언트에 실시간 알림 전송
//Zustand를 활용하여 알림 데이터를 전역 상태로 관리
//새로운 알림이 올 때마다 UI가 자동 업데이트

//npm install zustand

//store/useNotificationStore.js (Zustand 전역 상태)
import { create } from 'zustand';

const useNotificationStore = create((set) => ({
  notifications: [],
  addNotification: (notif) =>
    set((state) => ({ notifications: [...state.notifications, notif] })),
}));

export default useNotificationStore;


//pages/api/notifications.js (SSE 알림 API)
export default function handler(req, res) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
  
    const sendNotification = (message) => {
      res.write(`data: ${JSON.stringify({ message, time: new Date().toLocaleTimeString() })}\n\n`);
    };
  
    sendNotification('알림 시스템이 시작되었습니다.');
  
    const interval = setInterval(() => {
      sendNotification(`새로운 알림이 도착했습니다!`);
    }, 5000);
  
    req.on('close', () => {
      clearInterval(interval);
    });
  }

  //components/NotificationList.js (실시간 알림 UI)
  'use client';

import { useEffect } from 'react';
import useNotificationStore from '../store/useNotificationStore';

export default function NotificationList() {
  const addNotification = useNotificationStore((state) => state.addNotification);
  const notifications = useNotificationStore((state) => state.notifications);

  useEffect(() => {
    const eventSource = new EventSource('/api/notifications');

    eventSource.onmessage = (event) => {
      addNotification(JSON.parse(event.data));
    };

    return () => eventSource.close();
  }, [addNotification]);

  return (
    <div>
      <h2>실시간 알림</h2>
      <ul>
        {notifications.map((notif, index) => (
          <li key={index}>{notif.message} ({notif.time})</li>
        ))}
      </ul>
    </div>
  );
}

//app/page.js (메인 페이지)
import NotificationList from '../components/NotificationList';

export default function Home() {
  return (
    <div>
      <NotificationList />
    </div>
  );
}

//SSE를 활용하면 서버에서 클라이언트로 자동으로 데이터를 전송할 수 있음
//Zustand를 활용하여 전역 상태로 실시간 알림을 관리

  