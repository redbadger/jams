import fire from '../../config/firebaseAdminConfig';

const handlePost = (req, res) => {
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
};

const handlePatch = (req, res) => {
  const { jamId, statementId, ...body } = req.body;
  const db = fire.firestore();
  const jamsRef = db.collection('jams');

  return new Promise(() => {
    jamsRef
      .doc(jamId)
      .collection('statements')
      .doc(statementId)
      .update(body)
      .then(() => {
        res.status(200).end();
      })
      .catch((error) => {
        console.error('Error writing document: ', error);
      });
  });
};

export default function handler(req, res) {
  if (!['POST', 'PATCH'].includes(req.method)) {
    res.setHeader('Allow', ['POST', 'PATCH']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  if (req.method == 'POST') {
    return handlePost(req, res);
  } else if (req.method == 'PATCH') {
    return handlePatch(req, res);
  }
}
