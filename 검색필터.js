/* data/products.json */
[
    { "id": 1, "name": "JavaScript Book" },
    { "id": 2, "name": "React.js Guide" },
    { "id": 3, "name": "Next.js Handbook" },
    { "id": 4, "name": "Web Development Basics" }
]
  



// pages/search.js
import { useState } from 'react';

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const products = [
    { id: 1, name: 'JavaScript Book' },
    { id: 2, name: 'React.js Guide' },
    { id: 3, name: 'Next.js Handbook' },
    { id: 4, name: 'Web Development Basics' },
  ];

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);

    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(value.toLowerCase())
    );
    setResults(filtered);
  };

  return (
    <div>
      <h1>검색 필터</h1>
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder="검색어를 입력하세요"
      />
      <ul>
        {results.map((product) => (
          <li key={product.id}>{product.name}</li>
        ))}
      </ul>
    </div>
  );
}

/* React의 상태 관리(useState)와 검색 로직 설명
Next.js에서 데이터를 다루는 방법 간단히 소개
프로젝트 확장을 위한 팁 제공 (예: 외부 API 연결) */
