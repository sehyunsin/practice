npm install ioredis

lib/redis.js3
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

export default redis;


pages/api/cache.js
import redis from '../../lib/redis';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const cachedData = await redis.get('cachedData');

    if (cachedData) {
      return res.status(200).json({ data: JSON.parse(cachedData), fromCache: true });
    }

    const freshData = { message: '최신 데이터입니다.', timestamp: new Date().toISOString() };
    await redis.set('cachedData', JSON.stringify(freshData), 'EX', 30); // 30초 캐싱

    return res.status(200).json({ data: freshData, fromCache: false });
  }

  res.status(405).json({ message: 'Method Not Allowed' });
}


pages/cache.js
import { useState, useEffect } from 'react';

export default function CacheExample() {
  const [data, setData] = useState(null);
  const [fromCache, setFromCache] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch('/api/cache');
      const json = await res.json();
      setData(json.data);
      setFromCache(json.fromCache);
    }
    fetchData();
  }, []);

  return (
    <div>
      <h1>Redis 캐싱 예제</h1>
      <p>{data ? data.message : '로딩 중...'}</p>
      <p>({fromCache ? '캐시에서 가져옴' : '서버에서 가져옴'})</p>
    </div>
  );
}


.env.local
REDIS_URL=your-redis-url

//Redis를 활용한 데이터 캐싱의 장점
