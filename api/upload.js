import { promises as fs } from 'fs';
import path from 'path';
import QRCode from 'qrcode';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');

      // アップロード先ディレクトリを作成
      await fs.mkdir(uploadDir, { recursive: true });

      // ファイルを保存
      const { file, fileName } = req.body;
      const filePath = path.join(uploadDir, fileName);
      await fs.writeFile(filePath, Buffer.from(file, 'base64'));

      // ダウンロードリンクを生成
      const fileUrl = `${req.headers.origin}/uploads/${fileName}`;

      // QRコード生成
      const qrCodeDataUrl = await QRCode.toDataURL(fileUrl);

      // 成功レスポンスを返す
      res.status(200).json({ fileUrl, qrCodeDataUrl });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'ファイルアップロード中にエラーが発生しました。' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
