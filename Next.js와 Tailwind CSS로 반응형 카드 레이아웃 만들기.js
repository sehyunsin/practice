//npm install tailwindcss postcss autoprefixer
//npx tailwindcss init

//tailwind.config.js
module.exports = {
    content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
    theme: {
      extend: {},
    },
    plugins: [],
  };
  

//pages/_app.js
import '../styles/globals.css';

export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}



//pages/cards.js

export default function Cards() {
    const items = [
      { title: '카드 1', description: '이것은 첫 번째 카드입니다.' },
      { title: '카드 2', description: '이것은 두 번째 카드입니다.' },
      { title: '카드 3', description: '이것은 세 번째 카드입니다.' },
    ];
  
    return (
      <div className="p-4 grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => (
          <div key={index} className="bg-white shadow-md p-4 rounded">
            <h2 className="text-lg font-bold">{item.title}</h2>
            <p>{item.description}</p>
          </div>
        ))}
      </div>
    );
  }
  


//styles/globals.css
@tailwind base;
@tailwind components;
@tailwind utilities;

//Tailwind CSS로 반응형 디자인을 구현하는 간단한 방법