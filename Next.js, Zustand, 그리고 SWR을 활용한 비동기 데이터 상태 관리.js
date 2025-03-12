//SWR을 활용한 서버 데이터 패칭 및 Zustand 전역 상태 관리
//클라이언트 상태(Zustand)와 서버 상태(SWR)를 동기화하는 패턴
//실시간 데이터 업데이트 기능 적용

//npm install swr zustand

//store/userStore.js (Zustand 전역 상태)
import { create } from 'zustand';

const useUserStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));

export default useUserStore;


//components/UserProfile.js (SWR을 활용한 사용자 데이터 패칭)
'use client';

import useSWR from 'swr';
import useUserStore from '../store/userStore';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function UserProfile() {
  const { data, error } = useSWR('https://jsonplaceholder.typicode.com/users/1', fetcher);
  const setUser = useUserStore((state) => state.setUser);

  if (error) return <p>데이터를 불러오는 중 오류 발생</p>;
  if (!data) return <p>로딩 중...</p>;

  setUser(data);

  return (
    <div>
      <h2>사용자 프로필</h2>
      <p>이름: {data.name}</p>
      <p>이메일: {data.email}</p>
    </div>
  );
}

//components/UserState.js (Zustand 전역 상태 확인)
'use client';

import useUserStore from '../store/userStore';

export default function UserState() {
  const user = useUserStore((state) => state.user);

  return (
    <div>
      <h2>전역 상태의 사용자 정보</h2>
      {user ? <p>{user.name} ({user.email})</p> : <p>사용자 정보 없음</p>}
    </div>
  );
}


//app/page.js (전체 페이지 구성)
import UserProfile from '../components/UserProfile';
import UserState from '../components/UserState';

export default function Home() {
  return (
    <div>
      <UserProfile />
      <UserState />
    </div>
  );
}

//SWR을 활용하면 서버 데이터 요청과 캐싱을 자동으로 관리 가능
//Zustand와 SWR을 조합하면 클라이언트 상태와 서버 데이터를 효과적으로 동기화 가능

