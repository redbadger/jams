import fire from '../../config/firebaseAdminConfig';

const handlePost = (req, res) => {
  let { jamId, statement, state, isUserSubmitted } = req.body;
  const db = fire.firestore();
  const jamsRef = db.collection('jams');

  if (state == null) {
    state = 0;
  }

  if (isUserSubmitted == null) {
    isUserSubmitted = true;
  }

  return new Promise(() => {
    jamsRef
      .doc(jamId)
      .collection('statements')
      .add({
        text: statement,
        createdAt: fire.firestore.Timestamp.now(),
        isUserSubmitted: isUserSubmitted,
        state: state,
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
