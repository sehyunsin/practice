//npm install ws


//server.js
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('클라이언트 연결됨');

  ws.on('message', (message) => {
    console.log('받은 메시지:', message);
    // 모든 클라이언트에 메시지 브로드캐스트
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });
});


//pages/chat.js
import { useEffect, useState } from 'react';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [ws, setWs] = useState(null);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8080');
    setWs(socket);

    socket.onmessage = (event) => {
      setMessages((prev) => [...prev, event.data]);
    };

    return () => socket.close();
  }, []);

  const sendMessage = () => {
    if (ws && input.trim()) {
      ws.send(input);
      setInput('');
    }
  };

  return (
    <div>
      <h1>실시간 채팅</h1>
      <div>
        {messages.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="메시지를 입력하세요"
      />
      <button onClick={sendMessage}>전송</button>
    </div>
  );
}
