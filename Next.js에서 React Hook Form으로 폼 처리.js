//npm install react-hook-form @hookform/resolvers yup

//pages/form.js
import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object({
  name: yup.string().required('이름을 입력하세요.'),
  email: yup.string().email('유효한 이메일을 입력하세요.').required('이메일을 입력하세요.'),
});

export default function Form() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <div>
      <h1>React Hook Form 예제</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>이름:</label>
          <input {...register('name')} />
          {errors.name && <p>{errors.name.message}</p>}
        </div>
        <div>
          <label>이메일:</label>
          <input {...register('email')} />
          {errors.email && <p>{errors.email.message}</p>}
        </div>
        <button type="submit">제출</button>
      </form>
    </div>
  );
}
