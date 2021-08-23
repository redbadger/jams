import fire from '../../config/firebaseAdminConfig';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }

  const db = fire.firestore();
  const participantsRef = db.collection('participants');

  await participantsRef
    .add({})
    .then((participant) => {
      res.status(201);
      res.setHeader('Content-Type', 'application/json');
      res.json({ participantId: participant.id });
    })
    .catch((error) => {
      console.error('Error writing document: ', error);
      res.status(500);
      res.end();
    });
}
