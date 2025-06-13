//useOptimistic 훅을 활용한 즉각적인 UI 피드백 구현 예제

//서버 액션(Server Actions) 사용 시, 네트워크 지연 시간 동안 사용자에게 즉각적인 피드백을 제공하는 것은 UX에 매우 중요합니다. 이때 useOptimistic 훅이 빛을 발합니다.

//이 예제는 사용자가 '댓글 달기' 버튼을 눌렀을 때, 서버 응답을 기다리지 않고 UI에 먼저 댓글을 표시하는 방법을 보여줍니다.

//디렉토리 구조
/app
  - page.tsx
  - actions.ts
actions.ts: 서버 액션 정의
//서버의 데이터베이스를 업데이트하는 비동기 함수입니다. 실제 환경에서는 DB 호출 로직이 들어갑니다. revalidatePath를 호출하여 작업 완료 후 페이지 데이터를 최신화합니다.



// app/actions.ts
'use server';

import { revalidatePath } from 'next/cache';

// 임시 데이터 저장소
let comments = ['첫 번째 댓글입니다.'];

// 댓글을 추가하고 경로를 재검증하는 서버 액션
export async function addComment(comment: string) {
  // 실제 DB 작업 시뮬레이션
  await new Promise(resolve => setTimeout(resolve, 1000)); 
  comments.push(comment);
  revalidatePath('/');
}

export async function getComments() {
  return comments;
}


//page.tsx: useOptimistic을 사용한 컴포넌트
//useOptimistic은 현재 상태와 업데이트 함수를 인자로 받아, [낙관적 상태, 낙관적 업데이트 함수]를 반환합니다. 서버 액션이 실행되는 동안 '낙관적 상태'가 UI에 표시됩니다.



// app/page.tsx
'use client';

import { useOptimistic, useRef, startTransition } from 'react';
import { addComment, getComments } from './actions';

type Comment = string;

export default function CommentsPage({ initialComments }: { initialComments: Comment[] }) {
  const [optimisticComments, addOptimisticComment] = useOptimistic<Comment[], Comment>(
    initialComments,
    (state, newComment) => [...state, newComment]
  );
  const formRef = useRef<HTMLFormElement>(null);

  const formAction = async (formData: FormData) => {
    const comment = formData.get('comment') as string;
    formRef.current?.reset();
    
    startTransition(() => {
      addOptimisticComment(comment);
    });

    await addComment(comment);
  };

  return (
    <div>
      <h2>댓글 목록 (Optimistic UI)</h2>
      <ul>
        {optimisticComments.map((comment, index) => (
          <li key={index}>{comment}</li>
        ))}
      </ul>
      <form action={formAction} ref={formRef}>
        <input type="text" name="comment" required />
        <button type="submit">댓글 달기</button>
      </form>
    </div>
  );
}

// 이 페이지는 서버 컴포넌트에서 데이터를 fetch하여 클라이언트 컴포넌트로 전달합니다.
// app/(main)/page.tsx
// import CommentsPage from './comments-page';
// import { getComments } from './actions';
//
// export default async function Page() {
//   const comments = await getComments();
//   return <CommentsPage initialComments={comments} />;
// }


//사용자가 입력 필드에 "새로운 댓글"을 입력하고 버튼을 누릅니다.
//formAction이 호출되고, addOptimisticComment("새로운 댓글")이 실행됩니다.
//UI가 즉시 업데이트되어 "새로운 댓글"이 목록에 나타납니다. (아직 서버에는 저장되지 않음)
//addComment 서버 액션이 1초 동안 실행됩니다.
//액션이 완료되고 revalidatePath('/')가 호출되면, 서버로부터 최신 데이터가 전달되어 UI 상태가 실제 데이터와 동기화됩니다. 만약 서버 액션이 실패하면 UI는 원래 상태로 돌아갑니다.