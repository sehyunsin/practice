my-project/
├── prisma/
│   └── schema.prisma
├── pages/
│   └── api/
│       └── sendNotification.js
├── package.json
└── .env


npm install next react react-dom prisma @prisma/client
npx prisma init --datasource-provider sqlite


prisma/schema.prisma
generator client {
    provider = "prisma-client-js"
  }
  
  datasource db {
    provider = "sqlite"
    url      = env("DATABASE_URL")
  }
  
  model Notification {
    id        Int      @id @default(autoincrement())
    userId    String
    title     String
    message   String
    sentAt    DateTime @default(now())
  }
  

  .env
  DATABASE_URL="file:./dev.db"

  npx prisma migrate dev --name init

  pages/api/sendNotification.js
  import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { userId, title, message } = req.body;

  const notification = await prisma.notification.create({
    data: { userId, title, message },
  });

  res.status(200).json(notification);
}


npm run dev

API 호출 예시
fetch('/api/sendNotification', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: 'user_123',
      title: '새 알림',
      message: '푸시 알림이 전송되었습니다.'
    }),
  });
  