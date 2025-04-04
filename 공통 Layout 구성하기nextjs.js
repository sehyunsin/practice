// components/Layout.jsx
import Link from 'next/link';

export default function Layout({ children }) {
  return (
    <div>
      <header>
        <nav>
          <Link href="/">홈</Link> | <Link href="/about">소개</Link>
        </nav>
      </header>
      <main>{children}</main>
    </div>
  );
}


// pages/_app.jsx
import Layout from '../components/Layout';

export default function App({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
