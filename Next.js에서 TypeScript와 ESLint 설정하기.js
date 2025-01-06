// npm install --save-dev typescript @types/react @types/node eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
// npx tsc --init

// tsconfig.json
{
    "compilerOptions": {
      "target": "es5",
      "lib": ["dom", "dom.iterable", "esnext"],
      "allowJs": true,
      "skipLibCheck": true,
      "strict": true,
      "forceConsistentCasingInFileNames": true,
      "noEmit": true,
      "esModuleInterop": true,
      "module": "esnext",
      "moduleResolution": "node",
      "resolveJsonModule": true,
      "isolatedModules": true,
      "jsx": "preserve"
    },
    "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
    "exclude": ["node_modules"]
  }
  

// .eslintrc.js
module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      ecmaFeatures: {
        jsx: true,
      },
    },
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:react/recommended',
      'plugin:react-hooks/recommended',
    ],
    plugins: ['@typescript-eslint', 'react', 'react-hooks'],
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn'],
      'react/react-in-jsx-scope': 'off',
    },
  };
  

//pages/index.tsx
import React from 'react';

type Props = {
  name: string;
};

const Home: React.FC<Props> = ({ name }) => {
  return (
    <div>
      <h1>Hello, {name}!</h1>
    </div>
  );
};

export default function Index() {
  return <Home name="Next.js + TypeScript" />;
}
