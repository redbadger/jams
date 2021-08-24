import fire from '../../config/firebaseAdminConfig';

export default function handler(req, res) {
  const {
    query: { jamUrlPath },
    method,
  } = req;

  if (method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }

  const db = fire.firestore();
  const jamsRef = db.collection('jams');

  console.log(jamUrlPath, 'jamUrlPath');
  return new Promise(() => {
    jamsRef
      .where('urlPath', '==', jamUrlPath)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const jam = doc.data();
          jam.key = doc.id;

          res.status(200);
          res.setHeader('Content-Type', 'application/json');
          res.json(jam);
        });
      });
  });
}
