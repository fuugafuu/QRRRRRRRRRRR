import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import QRCode from 'qrcode';

// サーバーレス関数の設定
export const config = {
  api: {
    bodyParser: false, // デフォルトのbodyパーサーを無効にする
  },
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const form = new formidable.IncomingForm();
    form.uploadDir = path.join(process.cwd(), 'public', 'uploads');
    form.keepExtensions = true;
    form.parse(req, async (err, fields, files) => {
      if (err) {
        res.status(500).json({ message: 'ファイルの処理中にエラーが発生しました。' });
        return;
      }

      try {
        const file = files.file[0];
        const fileName = file.newFilename;  // 新しく名前をつけたファイル
        const filePath = path.join(form.uploadDir, fileName);
        
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
    });
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
