//WebSocket을 사용하여 서버에서 실시간 데이터를 받아오기/
//Next.js 클라이언트에서 데이터를 상태에 저장 및 UI 갱신
//Zustand를 활용하여 WebSocket 데이터를 전역 상태로 관리

//npm install zustand ws
//server.js (WebSocket 서버)
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('클라이언트 연결됨');

  setInterval(() => {
    ws.send(JSON.stringify({ message: `현재 시간: ${new Date().toLocaleTimeString()}` }));
  }, 3000);

  ws.on('close', () => console.log('클라이언트 연결 종료'));
});

store/useSocketStore.js (Zustand 전역 상태)
import { create } from 'zustand';

const useSocketStore = create((set) => ({
  messages: [],
  addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
}));

export default useSocketStore;


//components/WebSocketClient.js (WebSocket 클라이언트)
'use client';

import { useEffect } from 'react';
import useSocketStore from '../store/useSocketStore';

export default function WebSocketClient() {
  const addMessage = useSocketStore((state) => state.addMessage);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8080');

    socket.onmessage = (event) => {
      addMessage(JSON.parse(event.data).message);
    };

    return () => socket.close();
  }, [addMessage]);

  return <WebSocketMessages />;
}


//components/WebSocketMessages.js (실시간 메시지 표시)
'use client';

import useSocketStore from '../store/useSocketStore';

export default function WebSocketMessages() {
  const messages = useSocketStore((state) => state.messages);

  return (
    <div>
      <h2>실시간 데이터 스트리밍</h2>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
    </div>
  );
}

//app/page.js
import WebSocketClient from '../components/WebSocketClient';

export default function Home() {
  return (
    <div>
      <WebSocketClient />
    </div>
  );
}

//WebSocket을 활용하여 서버에서 실시간 데이터 스트리밍 구현
//Zustand 전역 상태를 활용하여 WebSocket 데이터를 저장 및 UI 반영
