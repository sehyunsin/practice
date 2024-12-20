//npm install ioredis

//pages/api/data.js
import Redis from 'ioredis';

const redis = new Redis();

export default async function handler(req, res) {
  const cacheKey = 'posts';
  const cachedData = await redis.get(cacheKey);

  if (cachedData) {
    console.log('캐시에서 데이터 반환');
    return res.status(200).json(JSON.parse(cachedData));
  }

  console.log('API에서 데이터 호출');
  const response = await fetch('https://jsonplaceholder.typicode.com/posts');
  const data = await response.json();

  await redis.set(cacheKey, JSON.stringify(data), 'EX', 30); // 30초 캐싱
  res.status(200).json(data);
}



//pages/redis.js
import { useEffect, useState } from 'react';

export default function RedisExample() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch('/api/data');
      const json = await res.json();
      setData(json.slice(0, 5));
    }
    fetchData();
  }, []);

  return (
    <div>
      <h1>Redis를 활용한 데이터 캐싱</h1>
      <ul>
        {data.map((item) => (
          <li key={item.id}>{item.title}</li>
        ))}
      </ul>
    </div>
  );
}
