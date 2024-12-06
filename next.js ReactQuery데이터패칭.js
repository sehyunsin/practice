/* npm install @tanstack/react-query */

/* pages/api/products.js */


export default function handler(req, res) {
    const products = [
      { id: 1, name: 'JavaScript Book', price: 30 },
      { id: 2, name: 'React.js Guide', price: 25 },
      { id: 3, name: 'Next.js Handbook', price: 20 },
    ];
    res.status(200).json(products);
  }
  


  

  /* pages/products.js */

  import { useQuery } from '@tanstack/react-query';

  async function fetchProducts() {
    const res = await fetch('/api/products');
    if (!res.ok) throw new Error('Network response was not ok');
    return res.json();
  }
  
  export default function Products() {
    const { data, error, isLoading } = useQuery(['products'], fetchProducts);
  
    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
  
    return (
      <div>
        <h1>Products</h1>
        <ul>
          {data.map((product) => (
            <li key={product.id}>
              {product.name} - ${product.price}
            </li>
          ))}
        </ul>
      </div>
    );
  }

   /*  React Query의 주요 기능(캐싱, 로딩 및 에러 상태 처리)을 설명
    기존 데이터 패칭 방식과 React Query의 차이점 강조
    API를 확장하거나 Mutation으로 데이터 업데이트하는 방법을 예고 */
  