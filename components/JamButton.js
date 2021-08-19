import fire from '../config/firebaseConfig';

export default function JamButton({vote, ids, onComplete}) {
  const db = fire.firestore();
  const participantsRef = db.collection('participants');

  const sendRequest = (vote) => {
    const STATES = {
      'Agree': 1,
      'Disagree': -1,
      'Skip': 0
    }

    if (!(vote in STATES)) {
        console.error('No vote');
        return;
    }
    let voteValue = STATES[vote]

    participantsRef
      .doc(ids.participantId)
      .collection('votes')
      .add({
        jamId: ids.jamId,
        statementId: ids.statementId,
        vote: voteValue,
        createdAt: fire.firestore.Timestamp.now(),
      })
      .then(() => {
        console.log('Document successfully written!');
        onComplete();
      })
      .catch((error) => {
        console.error('Error writing document: ', error);
      });
  };

  return (
    <button onClick={() => sendRequest(vote)}>
      {vote}
    </button>
  )
}
