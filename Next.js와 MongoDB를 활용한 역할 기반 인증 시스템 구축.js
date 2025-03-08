//MongoDB를 활용한 사용자 저장 및 역할 관리
//JWT 기반 로그인 및 역할 검증
//관리자 페이지 접근 제한

//npm install mongoose jsonwebtoken bcryptjs


//lib/mongodb.js (MongoDB 연결)

import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI 환경 변수를 설정하세요.');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

//models/User.js (사용자 모델)

import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);

//app/api/auth/login.js (로그인 API)

import { dbConnect } from '../../../lib/mongodb';
import User from '../../../models/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const SECRET_KEY = process.env.JWT_SECRET;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });

  await dbConnect();
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: '잘못된 로그인 정보' });
  }

  const token = jwt.sign({ id: user._id, username: user.username, role: user.role }, SECRET_KEY, {
    expiresIn: '1h',
  });

  res.setHeader('Set-Cookie', `token=${token}; Path=/; HttpOnly; Secure`);
  return res.status(200).json({ message: '로그인 성공', role: user.role });
}

//app/api/auth/register.js (회원가입 API)

import { dbConnect } from '../../../lib/mongodb';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });

  await dbConnect();
  const { username, password, role } = req.body;

  const existingUser = await User.findOne({ username });
  if (existingUser) return res.status(400).json({ message: '이미 존재하는 사용자입니다.' });

  const hashedPassword = bcrypt.hashSync(password, 10);
  const user = await User.create({ username, password: hashedPassword, role });

  return res.status(201).json({ message: '회원가입 성공', user });
}


//app/page.js (RBAC 로그인 UI)

import { useState } from 'react';

export default function Home() {
  const [role, setRole] = useState('');

  async function handleLogin(event) {
    event.preventDefault();
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: event.target.username.value,
        password: event.target.password.value,
      }),
    });

    const data = await res.json();
    if (res.ok) {
      setRole(data.role);
    } else {
      alert(data.message);
    }
  }

  return (
    <div>
      <h1>MongoDB 기반 RBAC 로그인</h1>
      <form onSubmit={handleLogin}>
        <input type="text" name="username" placeholder="아이디" required />
        <input type="password" name="password" placeholder="비밀번호" required />
        <button type="submit">로그인</button>
      </form>
      {role && <p>사용자 역할: {role}</p>}
      {role === 'admin' && <p>관리자 전용 콘텐츠</p>}
    </div>
  );
}

//환경 변수 설정 파일: .env.local
MONGODB_URI=your-mongodb-uri
JWT_SECRET=your-secret-key

//MongoDB를 활용하면 사용자 데이터를 안전하게 저장 가능
//Next.js API 라우트와 JWT를 활용하여 역할 기반 인증 적용






