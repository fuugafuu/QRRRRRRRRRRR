import { promises as fs } from 'fs';
import path from 'path';
import QRCode from 'qrcode';

export default async function handler(req, res) {
  try {
    if (req.method === 'POST') {
      const uploadDir = path.join(process.cwd(), 'uploads');

      // アップロードディレクトリがなければ作成
      await fs.mkdir(uploadDir, { recursive: true });

      // ファイルをアップロードディレクトリに保存
      const file = req.body.file;  // フロントエンドから送られるbase64ファイル
      const fileName = `${Date.now()}_${req.body.fileName}`;
      const filePath = path.join(uploadDir, fileName);
      await fs.writeFile(filePath, Buffer.from(file, 'base64'));

      // ファイルのダウンロードリンクを作成
      const fileUrl = `${req.headers.origin}/uploads/${fileName}`;

      // QRコードを生成
      const qrCodeDataUrl = await QRCode.toDataURL(fileUrl);

      // 成功レスポンス
      res.status(200).json({ message: 'ファイルがアップロードされました', fileUrl, qrCodeDataUrl });
    } else {
      res.status(405).json({ message: 'Method Not Allowed' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'サーバーエラーが発生しました。' });
  }
}
