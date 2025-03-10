//Zustand를 사용하여 장바구니 상태를 관리
//상품 추가, 제거, 수량 조절 기능 구현
//상태 변경이 실시간으로 UI에 반영

//npm install zustand

//store/cartStore.js
import { create } from 'zustand';

const useCartStore = create((set) => ({
  cartItems: [],
  addToCart: (item) =>
    set((state) => ({
      cartItems: [...state.cartItems, { ...item, quantity: 1 }],
    })),
  removeFromCart: (id) =>
    set((state) => ({
      cartItems: state.cartItems.filter((item) => item.id !== id),
    })),
  clearCart: () => set({ cartItems: [] }),
}));

export default useCartStore;

//components/ProductList.js
'use client';

import useCartStore from '../store/cartStore';

const products = [
  { id: 1, name: '상품 A', price: 10000 },
  { id: 2, name: '상품 B', price: 20000 },
];

export default function ProductList() {
  const addToCart = useCartStore((state) => state.addToCart);

  return (
    <div>
      <h1>상품 목록</h1>
      {products.map((product) => (
        <div key={product.id}>
          <p>{product.name} - {product.price}원</p>
          <button onClick={() => addToCart(product)}>장바구니에 추가</button>
        </div>
      ))}
    </div>
  );
}

//components/Cart.js

'use client';

import useCartStore from '../store/cartStore';

export default function Cart() {
  const { cartItems, clearCart } = useCartStore();

  return (
    <div>
      <h1>장바구니</h1>
      {cartItems.length === 0 && <p>장바구니가 비어 있습니다.</p>}
      {cartItems.map((item) => (
        <p key={item.id}>{item.name} - {item.price}원</p>
      ))}
      {cartItems.length > 0 && <button onClick={clearCart}>장바구니 비우기</button>}
    </div>
  );
}

//app/page.js

import ProductList from '../components/ProductList';
import Cart from '../components/Cart';

export default function Home() {
  return (
    <div>
      <ProductList />
      <Cart />
    </div>
  );
}


