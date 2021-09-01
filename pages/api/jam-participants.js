import fire from '../../config/firebaseAdminConfig';

export default async function handler(req, res) {
  const {
    query: { jamId },
    method,
  } = req;

  if (method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${method} Not Allowed`);
    return;
  }

  if (!jamId) {
    res.status(404).end();
    return;
  }

  const db = fire.firestore();
  const votesRef = db.collectionGroup('votes');
  const participantIds = await votesRef
    .where('jamId', '==', jamId)
    .get()
    .then((querySnapshot) => {
      let allIds = new Set();
      querySnapshot.forEach((doc) => {
        const participantId = doc.ref.path.split('/')[1];
        allIds.add(participantId);
      });
      return allIds;
    });

  res.status(200).json({ count: participantIds.size });
}
