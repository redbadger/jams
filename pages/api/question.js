import fire from '../../config/firebaseAdminConfig';
import { pickBy } from 'lodash';

export default function handler(req, res) {
  const {
    query: { jamId, participantId },
    method,
  } = req;

  if (method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }

  const db = fire.firestore();
  const jamsRef = db.collection('jams');
  const participantsRef = db.collection('participants');

  return new Promise(() => {
    const questionsPromise = jamsRef
      .doc(jamId)
      .collection('statements')
      .get()
      .then((query) => {
        const questions = {};
        query.forEach((question) => {
          questions[question.id] = question.data();
        });
        return questions;
      });

    const votesPromise = participantsRef
      .doc(participantId)
      .collection('votes')
      .get()
      .then((query) => {
        const allVotes = [];
        query.forEach((vote) =>
          allVotes.push(vote.data().statementId),
        );
        return allVotes;
      });

    Promise.all([questionsPromise, votesPromise]).then(
      ([questions, votes]) => {
        const unansweredQs = pickBy(
          questions,
          (value, key) => !votes.includes(key),
        );

        const keys = Object.keys(unansweredQs);
        if (!keys.length) {
          res.status(200);
          res.setHeader('Content-Type', 'application/json');
          res.json({});
        } else {
          const randomKey = keys[(keys.length * Math.random()) << 0];
          const randomQ = unansweredQs[randomKey];
          randomQ.key = randomKey;
          randomQ.jamId = jamId;

          res.status(200);
          res.setHeader('Content-Type', 'application/json');
          res.json(randomQ);
        }
      },
    );
  });
}
