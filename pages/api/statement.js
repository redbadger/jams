import fire from '../../config/firebaseAdminConfig';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }

  const { jamId, statement } = req.body;
  const db = fire.firestore();
  const jamsRef = db.collection('jams');

  return new Promise(() => {
    jamsRef
      .doc(jamId)
      .collection('statements')
      .add({
        text: statement,
        createdAt: fire.firestore.Timestamp.now(),
        isUserSubmitted: true,
        state: 0,
        numAgrees: 0,
        numDisagrees: 0,
        numSkipped: 0,
      })
      .then(() => {
        res.status(201).end();
      })
      .catch((error) => {
        console.error('Error writing document: ', error);
      });
  });
}
