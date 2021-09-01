import fire from '../../config/firebaseAdminConfig';
const ObjectsToCsv = require('objects-to-csv');

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
        statements[doc.id] = data.text;
      });

      // this is a map {id: text} for all the approved statements
      return statements;
    });

  const votesRef = db.collectionGroup('votes');

  // array with the votes and participantIds in
  const votes = await votesRef
    .where('jamId', '==', jamId)
    .get()
    .then(buildVotesArray);

  const participants = votes.reduce((acc, vote) => {
    // statement deleted or no longer approved
    if (!(vote.statementId in statements)) return acc;

    if (!(vote.participantId in acc)) {
      // add participant id as a column
      acc[vote.participantId] = { id: vote.participantId };
    }

    // prefixing question text with Q_
    acc[vote.participantId][`q_${statements[vote.statementId]}`] =
      vote.vote;

    return acc;
  }, {});

  const csv = await new ObjectsToCsv(Object.values(participants));

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename=JamsCSV-${jamId}.csv`,
  );
  res.status(200);
  res.send(await csv.toString(true, true));
}