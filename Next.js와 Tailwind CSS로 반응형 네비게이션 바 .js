/* npm install tailwindcss postcss autoprefixer
npx tailwindcss init
 */

// tailwind.config.js
module.exports = {
    content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
    theme: {
      extend: {},
    },
    plugins: [],
  };



  // pages/_app.js
  import '../styles/globals.css';

  function MyApp({ Component, pageProps }) {
    return <Component {...pageProps} />;
  }
  
  export default MyApp;



  // pages/navbar.js
  import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">MySite</h1>
        <button
          className="block md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          메뉴
        </button>
        <ul
          className={`${
            isOpen ? 'block' : 'hidden'
          } md:flex md:space-x-4`}
        >
          <li>
            <Link href="/"><a>홈</a></Link>
          </li>
          <li>
            <Link href="/about"><a>소개</a></Link>
          </li>
          <li>
            <Link href="/contact"><a>연락처</a></Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

// styles/globals.css
@tailwind base;
@tailwind components;
@tailwind utilities;

  