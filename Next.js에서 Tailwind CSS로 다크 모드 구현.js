//npm install tailwindcss postcss autoprefixer
//npx tailwindcss init

//tailwind.config.js
module.exports = {
    darkMode: 'class', // 다크 모드 활성화
    content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
    theme: {
      extend: {},
    },
    plugins: [],
  };
  


//pages/_app.js
import '../styles/globals.css';
import { useState, useEffect } from 'react';

export default function MyApp({ Component, pageProps }) {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedMode);
    document.documentElement.classList.toggle('dark', savedMode);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', newMode);
    document.documentElement.classList.toggle('dark', newMode);
  };

  return (
    <div>
      <button onClick={toggleDarkMode}>
        {darkMode ? '라이트 모드' : '다크 모드'}
      </button>
      <Component {...pageProps} />
    </div>
  );
}

//styles/globals.css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* 다크 모드 테스트용 스타일 */
body {
  @apply bg-white dark:bg-gray-800 text-black dark:text-white;
}
