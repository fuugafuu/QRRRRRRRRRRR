const multer = require('multer');
const path = require('path');
const QRCode = require('qrcode');

const storage = multer.memoryStorage(); // memoryStorageにすることでファイルをメモリに保存します
const upload = multer({ storage });

module.exports = async (req, res) => {
  // POSTメソッドのみ対応
  if (req.method === 'POST') {
    upload.single('file')(req, res, async (err) => {
      if (err) return res.status(500).send('ファイルアップロードエラー');

      const fileBuffer = req.file.buffer; // メモリ内にファイルが保存されている
      const fileUrl = `data:${req.file.mimetype};base64,${fileBuffer.toString('base64')}`;

      // QRコードを生成
      try {
        const qrCodeDataUrl = await QRCode.toDataURL(fileUrl);

        res.status(200).json({
          message: 'ファイルがアップロードされました！',
          qrCodeDataUrl,
          downloadUrl: fileUrl
        });
      } catch (qrErr) {
        res.status(500).send('QRコード生成エラー');
      }
    });
  } else {
    res.status(405).send('メソッドが許可されていません');
  }
};
