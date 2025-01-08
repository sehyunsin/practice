//npm install jsonwebtoken bcryptjs

//pages/api/auth/login.js
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const users = [
  { id: 1, username: 'user1', password: bcrypt.hashSync('password1', 10) },
];

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { username, password } = req.body;

    const user = users.find((u) => u.username === username);
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, 'your-secret-key', {
      expiresIn: '1h',
    });

    return res.status(200).json({ token });
  }

  res.status(405).json({ message: 'Method Not Allowed' });
}


//pages/api/protected.js
import jwt from 'jsonwebtoken';

export default function handler(req, res) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, 'your-secret-key');
    return res.status(200).json({ message: `Welcome, ${decoded.username}!` });
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}


//pages/login.js
import { useState } from 'react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async () => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('token', data.token);
      setMessage('로그인 성공');
    } else {
      setMessage(data.message);
    }
  };

  return (
    <div>
      <h1>로그인</h1>
      <input
        type="text"
        placeholder="아이디"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>로그인</button>
      <p>{message}</p>
    </div>
  );
}

//JWT를 활용한 인증의 기본 동작 원리
