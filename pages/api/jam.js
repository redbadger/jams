import fire from '../../config/firebaseAdminConfig';
import ensureAdmin from 'utils/admin-auth-middleware';

function getJamByUrlPath(jamUrlPath) {
  const db = fire.firestore();
  const jamsRef = db.collection('jams');

  return jamsRef
    .where('urlPath', '==', jamUrlPath)
    .get()
    .then((querySnapshot) => {
      let jams = [];
      querySnapshot.forEach((doc) => {
        const jam = doc.data();
        jam.key = doc.id;
        jams.push(jam);
      });
      return jams[0];
    });
}

function createJam({ name, description, statements, adminId }) {
  const db = fire.firestore();
  const jamsRef = db.collection('jams');
  const batch = db.batch();

  const randomString = (Math.random() + 1).toString(36).substring(2);

  const jamId = jamsRef.doc();

  batch.set(jamId, {
    adminId,
    name,
    description,
    urlPath: randomString,
    createdAt: fire.firestore.Timestamp.now(),
    isOpen: true,
  });

  statements.forEach((statement) => {
    const statementId = jamsRef
      .doc(jamId.id)
      .collection('statements')
      .doc();

    batch.set(statementId, {
      text: statement,
      state: 1,
      isUserSubmitted: false,
      numAgrees: 0,
      numDisagrees: 0,
      approvedAt: fire.firestore.Timestamp.now(),
      submittedAt: fire.firestore.Timestamp.now(),
    });
  });

  return batch.commit().then(() => {
    return jamsRef.doc(jamId.id).get();
  });
}

export default async function handler(req, res) {
  const {
    query: { jamUrlPath },
    method,
  } = req;

  if (method === 'POST') {
    try {
      const token = await ensureAdmin(req, res);

      const { name, description, statements } = req.body;
      if (statements.length === 0) {
        res.status(400).end('No statements found');
        return;
      }
      if (!name) {
        res.status(400).end('No name found');
        return;
      }
      return createJam({
        name: name,
        description: description,
        statements: statements,
        adminId: token.sub,
      })
        .then((jam) => {
          res.setHeader('Content-Type', 'application/json');
          res.status(200).json(jam.data());
        })
        .catch((error) => {
          console.error('Error writing document: ', error);
        });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error });
    }
  } else if (method === 'GET') {
    return getJamByUrlPath(jamUrlPath).then((jam) => {
      if (jam) {
        res.status(200);
        res.setHeader('Content-Type', 'application/json');
        res.json(jam);
      } else {
        res.status(404).end();
      }
    });
  }
}
