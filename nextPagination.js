/* pages/api/items.js */
export default function handler(req, res) {
    const items = Array.from({ length: 100 }, (_, i) => `Item ${i + 1}`);
    const page = parseInt(req.query.page || '1');
    const pageSize = 10;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
  
    res.status(200).json({
      total: items.length,
      page,
      pageSize,
      data: items.slice(start, end),
    });
  }



 /*  pages/pagination.js */

 import { useState, useEffect } from 'react';

 export default function Pagination() {
   const [items, setItems] = useState([]);
   const [page, setPage] = useState(1);
   const [total, setTotal] = useState(0);
 
   useEffect(() => {
     async function fetchItems() {
       const res = await fetch(`/api/items?page=${page}`);
       const data = await res.json();
       setItems(data.data);
       setTotal(data.total);
     }
     fetchItems();
   }, [page]);
 
   const totalPages = Math.ceil(total / 10);
 
   return (
     <div>
       <h1>Pagination</h1>
       <ul>
         {items.map((item, index) => (
           <li key={index}>{item}</li>
         ))}
       </ul>
       <button onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1}>
         이전
       </button>
       <span>{page} / {totalPages}</span>
       <button onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))} disabled={page === totalPages}>
         다음
       </button>
     </div>
   );
 }


 페이지네이션의 개념과 필요성 설명
Next.js에서 동적인 데이터 처리 방법 강조
페이지네이션을 확장해 검색 기능과 결합하는 방법 예고
 