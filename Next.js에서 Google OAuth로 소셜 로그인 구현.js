//npm install next-auth


//pages/api/auth/[...nextauth].js
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
});


//pages/_app.js
import { SessionProvider } from 'next-auth/react';

export default function MyApp({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}





//pages/index.js
import { signIn, signOut, useSession } from 'next-auth/react';

export default function Home() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div>
        <h1>환영합니다, {session.user.name}!</h1>
        <p>이메일: {session.user.email}</p>
        <button onClick={() => signOut()}>로그아웃</button>
      </div>
    );
  }

  return (
    <div>
      <h1>로그인 해주세요</h1>
      <button onClick={() => signIn('google')}>Google로 로그인</button>
    </div>
  );
}


//.env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXTAUTH_SECRET=your-random-secret
