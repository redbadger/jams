import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';
import fire from '../config/firebaseConfig';
import { pickBy } from 'lodash';
import { useCookies } from 'react-cookie';

const Post = () => {
  const router = useRouter();
  const { jam: jamId } = router.query;
  const db = fire.firestore();
  const participantsRef = db.collection('participants');
  const jamsRef = db.collection('jams');

  const [question, setQuestion] = useState();
  const [isDone, setIsDone] = useState(false);
  const [cookies, setCookies] = useCookies();

  const [participantId, setParticipantId] = useState();

  useEffect(() => {
    if (router.isReady && participantId) {
      loadQuestion();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, participantId]);

  useEffect(() => {
    const id = cookies['jams-participant'];
    if (id) {
      setParticipantId(id);
    } else {
      settingIdCookies();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cookies]);

  const loadQuestion = () => {
    jamsRef
      .where('urlPath', '==', jamId)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          let jamData = doc.data();
          jamData.statements = {};

          const statementsPromise = jamsRef
            .doc(doc.id)
            .collection('statements')
            .get()
            .then((query) => {
              query.forEach((statement) => {
                const statement_id = statement.id;
                jamData.statements[statement_id] = statement.data();
              });
              return jamData;
            });

          const allVotes = [];
          const votesPromise = participantsRef
            .doc(participantId)
            .collection('votes')
            .get()
            .then((query) => {
              query.forEach((vote) =>
                allVotes.push(vote.data().statementId),
              );
              return allVotes;
            });

          Promise.all([statementsPromise, votesPromise]).then(
            ([jam, votes]) => {
              const unansweredQs = pickBy(
                jamData.statements,
                (value, key) => !votes.includes(key),
              );

              const keys = Object.keys(unansweredQs);
              if (!keys.length) {
                setIsDone(true);
                return;
              }

              const randomKey =
                keys[(keys.length * Math.random()) << 0];
              const randomQ = unansweredQs[randomKey];
              randomQ.key = randomKey;

              setQuestion(randomQ);
            },
          );
        });
      });
  };

  const sendRequest = (vote) => {
    let voteValue = '';
    switch (vote) {
      case 'agree': {
        voteValue = 1;
        break;
      }
      case 'disagree': {
        voteValue = -1;
        break;
      }
      case 'skip': {
        voteValue = 0;
        break;
      }
      default:
        console.error('No vote');
    }

    participantsRef
      .doc(participantId)
      .collection('votes')
      .add({
        jamId: jamId,
        statementId: question.key,
        vote: voteValue,
        createdAt: fire.firestore.Timestamp.now(),
      })
      .then(() => {
        console.log('Document successfully written!');
        loadQuestion();
      })
      .catch((error) => {
        console.error('Error writing document: ', error);
      });
  };

  const settingIdCookies = () => {
    participantsRef.add({}).then((docRef) => {
      setCookies('jams-participant', docRef.id);
    });
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>JAMS</title>
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          {!isDone
            ? question
              ? question.text
              : 'Loading...'
            : 'All done'}
        </h1>

        <h3>Participant id: {participantId}</h3>
        {!isDone && (
          <>
            <button onClick={() => sendRequest('agree')}>
              Agree
            </button>
            <button onClick={() => sendRequest('disagree')}>
              Disagree
            </button>
            <button onClick={() => sendRequest('skip')}>Skip</button>
          </>
        )}
      </main>

      <footer className={styles.footer}>
        <a>Powered by Red Badger</a>
      </footer>
    </div>
  );
};

export default Post;
