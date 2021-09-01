import fire from '../../config/firebaseAdminConfig';
import ensureAdmin from 'utils/admin-auth-middleware';

async function getJamByUrlPath(jamUrlPath, includeStatements) {
  const db = fire.firestore();
  const jamsRef = db.collection('jams');

  const finalJam = await jamsRef
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

  if (!includeStatements) {
    return finalJam;
  }

  finalJam.statements = await jamsRef
    .doc(finalJam.key)
    .collection('statements')
    .get()
    .then((query) => {
      const statements = [];
      query.forEach((doc) => {
        const statement = doc.data();
        statement.key = doc.id;
        statements.push(statement);
      });
      return statements;
    });

  return finalJam;
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
      stateChangeTime: fire.firestore.Timestamp.now(),
      submittedAt: fire.firestore.Timestamp.now(),
    });
  });

  return batch.commit().then(() => {
    return jamsRef.doc(jamId.id).get();
  });
}

function patchJam(req, res) {
  const { jamId, ...body } = req.body;
  const db = fire.firestore();
  const jamsRef = db.collection('jams');

  return new Promise(() => {
    jamsRef
      .doc(jamId)
      .update(body)
      .then(() => {
        res.status(200).end();
      })
      .catch((error) => {
        console.error('Error writing document: ', error);
      });
  });
}

export default async function handler(req, res) {
  const {
    query: { jamUrlPath, includeStatements },
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
    return getJamByUrlPath(jamUrlPath, includeStatements).then(
      (jam) => {
        if (jam) {
          res.status(200);
          res.setHeader('Content-Type', 'application/json');
          res.json(jam);
        } else {
          res.status(404).end();
        }
      },
    );
  } else if (method === 'PATCH') {
    return patchJam(req, res);
  }
}
