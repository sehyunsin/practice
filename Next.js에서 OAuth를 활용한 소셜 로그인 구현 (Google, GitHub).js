npm install next-auth

pages/api/auth/[...nextauth].js
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
});


pages/_app.js
import { SessionProvider } from 'next-auth/react';

export default function MyApp({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}


pages/index.js
import { signIn, signOut, useSession } from 'next-auth/react';

export default function Home() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div>
        <h1>환영합니다, {session.user.name}!</h1>
        <p>이메일: {session.user.email}</p>
        <img src={session.user.image} alt="User profile" width={50} height={50} />
        <button onClick={() => signOut()}>로그아웃</button>
      </div>
    );
  }

  return (
    <div>
      <h1>로그인 해주세요</h1>
      <button onClick={() => signIn('google')}>Google로 로그인</button>
      <button onClick={() => signIn('github')}>GitHub로 로그인</button>
    </div>
  );
}


.env.local
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
NEXTAUTH_SECRET=your-random-secret


//OAuth 기반 인증의 장점과 보안적인 이점
