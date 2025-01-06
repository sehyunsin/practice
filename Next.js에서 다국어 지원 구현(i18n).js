//npm install next-i18next react-i18next i18next

//next-i18next.config.js

module.exports = {
    i18n: {
      defaultLocale: 'en',
      locales: ['en', 'ko'],
    },
  };
  

//pages/_app.js
import { appWithTranslation } from 'next-i18next';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default appWithTranslation(MyApp);


//public/locales/en/common.json
{
    "greeting": "Hello",
    "language_switch": "Switch to Korean"
  }
  

//public/locales/ko/common.json
{
    "greeting": "안녕하세요",
    "language_switch": "영어로 전환"
  }
  

//pages/index.js
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default function Home() {
  const { t } = useTranslation('common');

  return (
    <div>
      <h1>{t('greeting')}</h1>
      <a href="/ko">{t('language_switch')}</a>
    </div>
  );
}


//pages/ko.js
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default function Home() {
  const { t } = useTranslation('common');

  return (
    <div>
      <h1>{t('greeting')}</h1>
      <a href="/">{t('language_switch')}</a>
    </div>
  );
}
