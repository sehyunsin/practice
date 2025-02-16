//npm install prisma --save-dev
//npx prisma init
//npm install @prisma/client

prisma/schema.prisma
generator client {
    provider = "prisma-client-js"
  }
  
  datasource db {
    provider = "sqlite"
    url      = "file:./dev.db"
  }
  
  model User {
    id    Int     @id @default(autoincrement())
    name  String
    email String  @unique
  }
  

  //데이터베이스 마이그레이션
 // npx prisma migrate dev --name init

  //app/actions.js (서버 액션 CRUD)
  'use server';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function createUser(formData) {
  const name = formData.get('name');
  const email = formData.get('email');

  const newUser = await prisma.user.create({
    data: { name, email },
  });

  return newUser;
}

export async function getUsers() {
  return await prisma.user.findMany();
}

export async function deleteUser(id) {
  await prisma.user.delete({ where: { id: Number(id) } });
  return { message: '사용자가 삭제되었습니다.' };
}

//app/page.js (CRUD UI)
import { createUser, getUsers, deleteUser } from './actions';
import { useEffect, useState } from 'react';

export default function Home() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function fetchUsers() {
      setUsers(await getUsers());
    }
    fetchUsers();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    await createUser(formData);
    setUsers(await getUsers());
  }

  async function handleDelete(id) {
    await deleteUser(id);
    setUsers(await getUsers());
  }

  return (
    <div>
      <h1>Prisma + Next.js 서버 액션 CRUD</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="이름" required />
        <input type="email" name="email" placeholder="이메일" required />
        <button type="submit">추가</button>
      </form>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} ({user.email}) 
            <button onClick={() => handleDelete(user.id)}>삭제</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

//Next.js 서버 액션과 Prisma를 활용한 데이터 관리 방법
//API 라우트 없이 서버 액션만으로 CRUD 구현 가능

