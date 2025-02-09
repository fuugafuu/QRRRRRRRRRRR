export default async function handler(req, res) {
  try {
    if (req.method === 'POST') {
      // ファイルアップロード処理
      res.status(200).json({ message: 'ファイルがアップロードされました。' });
    } else {
      res.status(405).json({ message: 'Method Not Allowed' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'サーバーエラーが発生しました。' });
  }
}
