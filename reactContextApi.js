/* ThemeContext.js */
import React, { createContext, useState } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
// Context API를 활용해 테마(밝음/어두움)를 전역으로 관리
// 버튼을 통해 테마를 토글하는 기능 구현
// useContext로 Context 값 사용




/* App.js */
import React, { useContext } from 'react';
import { ThemeContext, ThemeProvider } from './ThemeContext';

function ThemeToggleButton() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div style={{ background: theme === 'light' ? '#fff' : '#333', color: theme === 'light' ? '#000' : '#fff', height: '100vh' }}>
      <h1>현재 테마: {theme}</h1>
      <button onClick={toggleTheme}>테마 변경</button>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <ThemeToggleButton />
    </ThemeProvider>
  );
}

export default App;

// Context API의 기본 개념 및 사용법 설명
// 전역 상태 관리가 필요한 상황 예시 제시
// Redux와 Context API의 간단한 비교로 학습 방향 제안

