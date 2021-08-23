import fire from '../../config/firebaseAdminConfig';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }

  const { jamId, participantId, statementId, vote } = req.body;

  const db = fire.firestore();
  const participantsRef = db.collection('participants');

  const STATES = {
    Agree: 1,
    Disagree: -1,
    Skip: 0,
  };

  if (!(vote in STATES)) {
    res.status(400).send({ message: 'Vote not recognised.' });
  } else {
    return new Promise(() => {
      participantsRef
        .doc(participantId)
        .collection('votes')
        .add({
          jamId: jamId,
          statementId: statementId,
          vote: STATES[vote],
          createdAt: fire.firestore.Timestamp.now(),
        })
        .then(() => res.status(201).end())
        .catch((error) => {
          console.error('Error writing document: ', error);
        });
    });
  }
}
