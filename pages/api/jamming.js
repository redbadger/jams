import fire from '../../config/firebaseAdminConfig';

export default async function handler(req, res) {
  const { method } = req;

  if (method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }

  const db = fire.firestore();
  const jamsRef = db.collection('jams');

  await jamsRef
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        console.log(doc);

        const jam = doc.data();
        jam.key = doc.id;

        res.status(200);
        res.setHeader('Content-Type', 'application/json');
        res.json(jam);
      });
    })
    .catch((error) => {
      console.error('Error retriving documents: ', error);
      res.status(500);
      res.end();
    });
}
