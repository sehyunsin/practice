// pages/api/hello.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    res.status(200).json({ message: 'Hello from API Route!' });
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}


// pages/api-test.tsx
import { useEffect, useState } from 'react';

export default function ApiTestPage() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/hello')
      .then(res => res.json())
      .then(data => setMessage(data.message));
  }, []);

  return (
    <div>
      <h1>API 응답 메시지</h1>
      <p>{message}</p>
    </div>
  );
}
