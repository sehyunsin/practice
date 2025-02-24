/* Cloudinary를 활용하여 클라우드에 이미지 저장
서버 액션(Server Actions)으로 업로드 요청 처리
업로드된 이미지 URL을 클라이언트에 반환 */
//npm install cloudinary

//app/actions.js
'use server';

import cloudinary from 'cloudinary';

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadToCloudinary(formData) {
  const file = formData.get('file');
  if (!file) return { error: '파일이 없습니다.' };

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const response = await new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload_stream({ folder: 'uploads' }, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    }).end(buffer);
  });

  return { url: response.secure_url };
}


//app/page.js
import { uploadToCloudinary } from './actions';
import { useState } from 'react';

export default function Home() {
  const [imageUrl, setImageUrl] = useState('');

  async function handleUpload(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const response = await uploadToCloudinary(formData);
    if (response.url) setImageUrl(response.url);
  }

  return (
    <div>
      <h1>Cloudinary 이미지 업로드</h1>
      <form onSubmit={handleUpload}>
        <input type="file" name="file" required />
        <button type="submit">업로드</button>
      </form>
      {imageUrl && <img src={imageUrl} alt="업로드된 이미지" width={200} />}
    </div>
  );
}
    
//.env.local
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
