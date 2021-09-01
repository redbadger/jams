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
  const jamId = req.query.jamId;

  if (!jamId) {
    res
      .status(400)
      .json({ error: 'Required jamId query parameter missing.' });
    return;
  }

  const db = fire.firestore();
  const statementsRef = db
    .collection('jams')
    .doc(jamId)
    .collection('statements');

  const statements = await statementsRef
    .where('state', '==', 1)
    .get()
    .then((querySnapshot) => {
      let statements = {};
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.state === 1) {
          statements[doc.id] = data.text;
        }
      });

      // this is a map {id: text} for all the approved statements
      return statements;
    });

  const votesRef = db.collectionGroup('votes');
  const votes = await votesRef
    .where('jamId', '==', jamId)
    .get()
    .then(buildVotesArray);

  const participants = votes.reduce((acc, vote) => {
    if (!(vote.statementId in statements)) return acc;

    if (!(vote.participantId in acc)) {
      acc[vote.participantId] = { id: vote.participantId };
    }

    acc[vote.participantId][`Q_${statements[vote.statementId]}`] =
      vote.vote;

    return acc;
  }, {});

  res.status(200).send(Object.values(participants));
}
