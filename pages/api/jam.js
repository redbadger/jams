import fire from '../../config/firebaseAdminConfig';

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

function createJam({ name, description, statements }) {
  const db = fire.firestore();
  const jamsRef = db.collection('jams');

  const randomString = (Math.random() + 1).toString(36).substring(2);

  return jamsRef
    .add({
      // adminId: '',
      // statements: []
      name: name,
      createdAt: fire.firestore.Timestamp.now(),
      isOpen: true,
      description: description,
      urlPath: randomString,
    })
    .then((docRef) => {
      return jamsRef.doc(docRef.id).get();
    });
}

export default function handler(req, res) {
  const {
    query: { jamUrlPath },
    method,
  } = req;

  if (method == 'POST') {
    return createJam({
      name: req.body.name,
      description: req.body.description,
      statements: [],
    })
      .then((jam) => {
        res.status(200);
        res.setHeader('Content-Type', 'application/json');
        res.json(jam.data());
      })
      .catch((error) => {
        console.error('Error writing document: ', error);
      });
  }

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
