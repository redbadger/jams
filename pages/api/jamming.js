import fire from '../../config/firebaseAdminConfig';

export default async function handler(req, res) {
  const { method } = req;

  console.log(method);
  if (method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${method} Not Allowed`);
    return;
  }

  const db = fire.firestore();
  const jamsRef = db.collection('jams');

  await jamsRef
    .get()
    .then((querySnapshot) => {
      var jams = [];
      querySnapshot.forEach((doc) => {
        // console.log(doc);

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
}
