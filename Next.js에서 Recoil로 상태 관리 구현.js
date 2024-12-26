//npm install recoil

//atoms/counterAtom.js
import { atom } from 'recoil';

export const counterAtom = atom({
  key: 'counterAtom',
  default: 0,
});


//components/Counter.js
import { useRecoilState } from 'recoil';
import { counterAtom } from '../atoms/counterAtom';

export default function Counter() {
  const [count, setCount] = useRecoilState(counterAtom);

  return (
    <div>
      <h1>Recoil Counter</h1>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
      <button onClick={() => setCount(count - 1)}>-</button>
    </div>
  );
}


//pages/_app.js
import { RecoilRoot } from 'recoil';
import '../styles/globals.css';

export default function MyApp({ Component, pageProps }) {
  return (
    <RecoilRoot>
      <Component {...pageProps} />
    </RecoilRoot>
  );
}


//pages/index.js
import Counter from '../components/Counter';

export default function Home() {
  return (
    <div>
      <Counter />
    </div>
  );
}

