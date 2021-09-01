import fire from '../../config/firebaseAdminConfig';

function buildVotesArray(querySnapshot) {
  let collection = [];
  querySnapshot.forEach((doc) => {
    const participantId = doc.ref.path.split('/')[1];
    const data = doc.data();
    collection.push({
      ...data,
      participantId,
      //id: doc.id,
    });
  });
  return collection;
}

export default async function handler(req, res) {
  if (!['GET'].includes(req.method)) {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  // TODO red from query param
  const jamId = '6y4qC5HoThwkMKJiBrLn';

  const db = fire.firestore();
  const statementsRef = db
    .collection('jams')
    .doc(jamId)
    .collection('statements');

  const statements = await statementsRef
    .where('state', '==', 1)
    .get()
    .then((querySnapshot) => {
      let statements = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        statements.push({
          id: doc.id,
          text: data.text,
        });
      });
      return statements;
    });

  const votesRef = db.collectionGroup('votes');
  const votes = await votesRef
    .where('jamId', '==', jamId)
    .get()
    .then(buildVotesArray);

  res.status(200).send(votes[0]);
}

/*
[
  {
    participantId: id,
    statementId2: vote,
    statementId3: vote,
  },
  {
    participantId2: id,
    statementId: vote,
    statementId2: vote,
  },
];
*/
