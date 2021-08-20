import fire from '../../config/firebaseConfig';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }

  const db = fire.firestore();
  const participantsRef = db.collection('participants');

  return new Promise(() => {
    participantsRef
      .add({})
      .then((participant) => {
        return res
          .status(201)
          .setHeader('Content-Type', 'application/json')
          .json({ participantId: participant.id });
      })
      .catch((error) => {
        console.error('Error writing document: ', error);
      });
  });
}
