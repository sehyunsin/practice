// pages/api/notify.ts
export default function handler(req, res) {
    if (req.method === 'POST') {
      const { message } = req.body;
      // 예시: 슬랙 알림 전송 등
      return res.status(200).json({ success: true });
    }
    res.status(405).end();
  }
  