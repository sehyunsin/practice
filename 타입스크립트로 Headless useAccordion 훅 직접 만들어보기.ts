/hooks
  - useAccordion.ts   # 핵심 로직인 Headless Hook
/components
  - Accordion.tsx       # 훅을 사용하여 UI를 그리는 컴포넌트
/app
  - page.tsx          # 최종 결과물을 보여주는 페이지

  hooks/useAccordion.ts: Headless Hook 구현
상태 관리, 이벤트 핸들러, 접근성 속성(ARIA)을 모두 책임집니다.

// hooks/useAccordion.ts
import { useState } from 'react';

type UseAccordionProps = {
  initialOpenIndex?: number;
};

export const useAccordion = ({ initialOpenIndex }: UseAccordionProps = {}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(initialOpenIndex ?? null);

  const handleToggle = (index: number) => {
    setOpenIndex(prevIndex => (prevIndex === index ? null : index));
  };

  const getTriggerProps = (index: number) => {
    const isOpen = openIndex === index;
    return {
      onClick: () => handleToggle(index),
      role: 'button',
      'aria-expanded': isOpen,
      'aria-controls': `accordion-panel-${index}`,
      id: `accordion-trigger-${index}`,
    };
  };

  const getPanelProps = (index: number) => {
    const isOpen = openIndex === index;
    return {
      hidden: !isOpen,
      role: 'region',
      'aria-labelledby': `accordion-trigger-${index}`,
      id: `accordion-panel-${index}`,
    };
  };

  return { openIndex, getTriggerProps, getPanelProps };
};

components/Accordion.tsx: UI 컴포넌트 구현
useAccordion 훅을 가져와 UI를 렌더링합니다. 이 컴포넌트는 오직 '어떻게 보일지'에만 집중합니다. (예: Tailwind CSS 사용)

// components/Accordion.tsx
'use client';
import { useAccordion } from '@/hooks/useAccordion';

type AccordionItem = {
  title: string;
  content: string;
};

type AccordionProps = {
  items: AccordionItem[];
};

export const Accordion = ({ items }: AccordionProps) => {
  const { getTriggerProps, getPanelProps } = useAccordion();

  return (
    <div className="w-full max-w-md mx-auto border rounded-md">
      {items.map((item, index) => (
        <div key={index} className="border-b last:border-b-0">
          <h3>
            <button
              {...getTriggerProps(index)}
              className="w-full p-4 text-left font-semibold"
            >
              {item.title}
            </button>
          </h3>
          <div
            {...getPanelProps(index)}
            className="p-4 bg-gray-50"
          >
            {item.content}
          </div>
        </div>
      ))}
    </div>
  );
};


app/page.tsx: 페이지에서 사용하기
최종적으로 만들어진 Accordion 컴포넌트를 페이지에 렌더링합니다.

// app/page.tsx
import { Accordion } from '@/components/Accordion';

const accordionItems = [
  { title: 'React란 무엇인가요?', content: 'React는 사용자 인터페이스를 만들기 위한 JavaScript 라이브러리입니다.' },
  { title: 'Next.js의 장점은?', content: '서버 사이드 렌더링, 정적 사이트 생성 등 다양한 기능을 제공하여 성능과 SEO를 향상시킵니다.' },
  { title: 'Headless Hooks 패턴이란?', content: '동작과 접근성 로직을 훅에 위임하고, 컴포넌트는 스타일링에만 집중하는 디자인 패턴입니다.' },
];

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-2xl font-bold mb-8">Headless Accordion 예제</h1>
      <Accordion items={accordionItems} />
    </main>
  );
}