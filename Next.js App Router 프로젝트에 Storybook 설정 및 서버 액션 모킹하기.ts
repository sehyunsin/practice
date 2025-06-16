이 가이드는 Next.js 14+ (App Router) 프로젝트에 Storybook을 설치하고, 서버 액션을 사용하는 컴포넌트의 스토리를 작성하는 방법을 단계별로 안내합니다.

1. Storybook 설치 및 설정
프로젝트 루트에서 아래 명령어를 실행하면, Storybook CLI가 자동으로 Next.js 프로젝트를 감지하고 필요한 설정을 추가합니다.

npx storybook@latest init

설치가 완료되면 .storybook 디렉토리와 stories 디렉토리가 생성됩니다.



2. 서버 액션을 사용하는 컴포넌트 생성
간단한 이름을 제출하는 폼과 서버 액션을 만들어 보겠습니다.

app/actions.ts

'use server';

export async function submitName(formData: FormData) {
  const name = formData.get('name');
  if (!name) {
    return { success: false, message: '이름을 입력해주세요.' };
  }
  console.log(`서버에 제출된 이름: ${name}`);
  // 실제로는 DB에 저장하는 로직이 들어갑니다.
  await new Promise(res => setTimeout(res, 1000));
  return { success: true, message: `${name}님, 환영합니다!` };
}

components/NameForm.tsx
'use client';
import { submitName } from '@/app/actions';
import { useFormState, useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={pending}>{pending ? '제출 중...' : '제출'}</button>;
}

export function NameForm() {
  const [state, formAction] = useFormState(submitName, { success: false, message: '' });

  return (
    <form action={formAction} className="space-y-2">
      <input name="name" type="text" className="border p-2" />
      <SubmitButton />
      {!state.success && <p className="text-red-500">{state.message}</p>}
      {state.success && <p className="text-green-500">{state.message}</p>}
    </form>
  );
}


3. Storybook에서 서버 액션 Mocking하기
stories/NameForm.stories.tsx 파일을 생성하고 parameters.serverActions를 사용하여 submitName 액션을 모킹합니다. fn 유틸리티를 사용하면 액션이 호출되었는지, 어떤 인자로 호출되었는지 등을 Storybook의 'Actions' 탭에서 확인할 수 있습니다.

stories/NameForm.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { NameForm } from '../components/NameForm';
import * as nameActions from '../app/actions';

const meta = {
  title: 'Forms/NameForm',
  component: NameForm,
} satisfies Meta<typeof NameForm>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 상태 스토리
export const Default: Story = {};

// 서버 액션이 성공했을 때의 시나리오
export const SubmissionSuccess: Story = {
  parameters: {
    serverActions: {
      // `submitName` 이라는 이름의 action을 모킹합니다.
      // 실제 프로젝트에서는 `module`과 `fn`을 이용하는 것이 더 명확할 수 있습니다.
      handler: fn(async (formData) => {
        const name = formData.get('name');
        if (!name) return { success: false, message: 'Storybook: 이름을 입력해야 합니다.' };
        return { success: true, message: `Storybook: ${name}님, 환영합니다!` };
      }),
      //  module: nameActions,
      //  fnName: 'submitName',
      //  handler: ...
    },
  },
};

// 서버 액션이 실패했을 때의 시나리오
export const SubmissionError: Story = {
  parameters: {
    serverActions: {
      handler: fn(async (formData) => {
        return { success: false, message: 'Storybook: 서버에서 오류가 발생했습니다.' };
      }),
    },
  },
};

이제 npm run storybook을 실행하여 브라우저에서 NameForm 컴포넌트의 각 상태(성공, 실패, 로딩)를 실제 서버 없이도 완벽하게 테스트하고 개발할 수 있습니다.