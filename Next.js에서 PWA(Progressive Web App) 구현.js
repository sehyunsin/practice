//npm install next-pwa

//next.config.js
const withPWA = require('next-pwa')({
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
  });
  
  module.exports = withPWA({
    reactStrictMode: true,
  });

//pages/_document.js
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="application-name" content="Next.js PWA" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}


//public/manifest.json
{
    "name": "Next.js PWA Example",
    "short_name": "Next.js PWA",
    "start_url": "/",
    "display": "standalone",
    "background_color": "#ffffff",
    "theme_color": "#000000",
    "icons": [
      {
        "src": "/icons/icon-192x192.png",
        "sizes": "192x192",
        "type": "image/png"
      },
      {
        "src": "/icons/icon-512x512.png",
        "sizes": "512x512",
        "type": "image/png"
      }
    ]
}

//public/icons/

//icon-192x192.png와 icon-512x512.png를 준비해 저장