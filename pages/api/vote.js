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

  const FIELDS = {
    Agree: 'numAgrees',
    Disagree: 'numDisagrees',
    Skip: 'numSkipped',
  };

  const voteIncrement = fire.firestore.FieldValue.increment(1);

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
        .then(() => {
          return db
            .collection('jams')
            .doc(jamId)
            .collection('statements')
            .doc(statementId)
            .update({ [FIELDS[vote].toString()]: voteIncrement })
            .then(() => res.status(201).end())
            .catch((error) => {
              console.error('Error writing document: ', error);
            });
        })
        .then(() => res.status(201).end())
        .catch((error) => {
          console.error('Error writing document: ', error);
        });
    });
  }
}
