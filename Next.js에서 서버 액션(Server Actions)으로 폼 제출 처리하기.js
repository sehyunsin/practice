app/actions.js
'use server';

export async function submitForm(data) {
  console.log('서버에서 받은 데이터:', data);
  return { message: `이름: ${data.get('name')}, 이메일: ${data.get('email')}` };
}

app/page.js
import { submitForm } from './actions';
import { useState } from 'react';

export default function Home() {
  const [message, setMessage] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const response = await submitForm(formData);
    setMessage(response.message);
  }

  return (
    <div>
      <h1>서버 액션 폼 제출</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="이름" required />
        <input type="email" name="email" placeholder="이메일" required />
        <button type="submit">제출</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

//서버 액션(Server Actions)을 사용하면 API 라우트 없이도 데이터 처리가 가능