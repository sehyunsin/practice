/* components/HeavyComponent.js */
export default function HeavyComponent() {
    return <div>이 컴포넌트는 무겁습니다!</div>;
  }


/*   pages/dynamic-import.js */

import dynamic from 'next/dynamic';
import { useState } from 'react';

// 동적 로딩
const HeavyComponent = dynamic(() => import('../components/HeavyComponent'), {
  loading: () => <p>Loading...</p>,
});

export default function DynamicImport() {
  const [show, setShow] = useState(false);

  return (
    <div>
      <h1>Dynamic Import 예제</h1>
      <button onClick={() => setShow(!show)}>컴포넌트 로드</button>
      {show && <HeavyComponent />}
    </div>
  );
}
