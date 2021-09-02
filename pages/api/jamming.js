import fire from '../../config/firebaseAdminConfig';
import ensureAdmin from 'utils/admin-auth-middleware';

export default async function handler(req, res) {
  const { method } = req;
  if (method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${method} Not Allowed`);
    return;
  }

  try {
    const token = await ensureAdmin(req, res);

    const db = fire.firestore();
    const jamsRef = db.collection('jams');

    await jamsRef
      .where('adminId', '==', token.sub)
      .get()
      .then((querySnapshot) => {
        var jams = [];
        querySnapshot.forEach((doc) => {
          const jam = doc.data();
          jam.key = doc.id;

          jams.push(jam);
        });
        res.status(200);
        res.setHeader('Content-Type', 'application/json');
        res.json(jams);
      })
      .catch((error) => {
        console.error('Error retriving documents: ', error);
        res.status(500);
        res.end();
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
}
