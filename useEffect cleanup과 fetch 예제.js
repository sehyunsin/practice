import { useState, useEffect } from 'react';

export default function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    let isMounted = true;

    fetch('/api/users')
      .then(res => res.json())
      .then(data => {
        if (isMounted) setUsers(data);
      });

    return () => {
      isMounted = false; // 컴포넌트 언마운트 시 비동기 업데이트 방지
    };
  }, []);

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}

//useEffect 안에서 cleanup 로직은 메모리 누수나 비동기 상태 업데이트를 막아준다.
