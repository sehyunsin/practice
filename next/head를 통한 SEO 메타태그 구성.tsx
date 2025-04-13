import Head from 'next/head';

export default function SEOExample() {
  return (
    <>
      <Head>
        <title>Se-hyun의 개발 블로그</title>
        <meta name="description" content="Next.js로 만든 개발 노트" />
        <meta property="og:title" content="Se-hyun의 개발 블로그" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/og-image.png" />
      </Head>
      <main>
        <h1>환영합니다!</h1>
      </main>
    </>
  );
}
