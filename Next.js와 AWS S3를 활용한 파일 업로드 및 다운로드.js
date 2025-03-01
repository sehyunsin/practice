//AWS S3를 활용하여 파일 업로드 및 다운로드 기능 구현
//Next.js 서버 액션(Server Actions)과 AWS SDK를 활용한 스토리지 연동
//업로드된 파일의 URL을 반환하여 다운로드 가능하도록 구현

//npm install @aws-sdk/client-s3

//app/actions.js (AWS S3 파일 업로드 처리)
'use server';

import { S3Client, PutObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = process.env.AWS_BUCKET_NAME;

export async function uploadToS3(formData) {
  const file = formData.get('file');
  if (!file) return { error: '파일이 없습니다.' };

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadParams = {
    Bucket: BUCKET_NAME,
    Key: file.name,
    Body: buffer,
    ContentType: file.type,
  };

  await s3.send(new PutObjectCommand(uploadParams));

  return { url: `https://${BUCKET_NAME}.s3.amazonaws.com/${file.name}` };
}

export async function listS3Files() {
  const command = new ListObjectsV2Command({ Bucket: BUCKET_NAME });
  const { Contents } = await s3.send(command);

  return Contents?.map((file) => ({
    name: file.Key,
    url: `https://${BUCKET_NAME}.s3.amazonaws.com/${file.Key}`,
  })) || [];
}


//app/page.js (AWS S3 파일 업로드 UI)
import { uploadToS3, listS3Files } from './actions';
import { useEffect, useState } from 'react';

export default function Home() {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    async function fetchFiles() {
      setFiles(await listS3Files());
    }
    fetchFiles();
  }, []);

  async function handleUpload(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    await uploadToS3(formData);
    setFiles(await listS3Files());
  }

  return (
    <div>
      <h1>AWS S3 파일 업로드 및 다운로드</h1>
      <form onSubmit={handleUpload}>
        <input type="file" name="file" required />
        <button type="submit">업로드</button>
      </form>
      <ul>
        {files.map((file) => (
          <li key={file.name}>
            <a href={file.url} target="_blank" rel="noopener noreferrer">{file.name}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

//.env.local
AWS_REGION=your-aws-region
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
AWS_BUCKET_NAME=your-s3-bucket-name

//AWS S3를 활용하면 확장 가능한 파일 관리 가능
//Next.js의 서버 액션과 클라우드 스토리지 연동으로 보안과 성능 최적화



