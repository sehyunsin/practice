//Zustand: 클라이언트 전역 상태 관리
//Zustand 스토어는 App Router 환경에서도 이전과 동일하게 사용할 수 있습니다. 단, 서버 컴포넌트에서는 직접 사용할 수 없으므로, Provider 패턴이나 Client Component 내에서 호출해야 합니다.

//store/themeStore.ts

import { create } from 'zustand';

type ThemeState = {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
};

export const useThemeStore = create<ThemeState>((set) => ({
  theme: 'light',
  toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
}));

//components/ThemeToggleButton.tsx (Client Component)
'use client';

import { useThemeStore } from '@/store/themeStore';

export function ThemeToggleButton() {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <button onClick={toggleTheme}>
      현재 테마: {theme} (전환)
    </button>
  );
}


//React Query: Client Component 내의 선택적 서버 상태 관리
//App Router의 fetch만으로 관리가 어려운 복잡한 서버 상태가 분명히 존재합니다. (예: 무한 스크롤, 웹소켓 연동) 이럴 때 해당 로직을 Client Component로 분리하고 React Query를 사용하는 것이 효과적입니다.

//providers/QueryProvider.tsx (Client Component)
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1분
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

//app/layout.tsx 에서 Provider 감싸기
import QueryProvider from '@/providers/QueryProvider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}

//components/PaginatedPosts.tsx (Client Component)
'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

const fetchPosts = async (page: number) => {
  const res = await fetch(`/api/posts?page=${page}`);
  return res.json();
};

export function PaginatedPosts() {
  const [page, setPage] = useState(0);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['posts', page],
    queryFn: () => fetchPosts(page),
    keepPreviousData: true, // 페이지 이동 시 이전 데이터 유지
  });
  // ... (JSX 렌더링 로직)
}

//간단한 데이터 Fetch: Next.js의 내장 fetch와 서버 컴포넌트를 우선 사용합니다.
//전역 클라이언트 상태: Zustand는 가볍고 효과적인 해결책입니다.
//복잡한 클라이언트 측 서버 인터랙션: SWR이나 React Query를 해당 기능이 필요한 Client Component 내에서 제한적으로 사용하여 App Router의 장점과 기존 라이브러리의 편리함을 모두 취할 수 있습니다.