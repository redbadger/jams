import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';
import fire from '../config/firebaseConfig';
import { pickBy } from 'lodash';
import { useCookies } from 'react-cookie';
import JamButton from '../components/JamButton'
import Layout from '../components/Layout'

const Post = () => {
  const router = useRouter();
  const { jam: jamId } = router.query;
  const db = fire.firestore();
  const participantsRef = db.collection('participants');
  const jamsRef = db.collection('jams');

  const [question, setQuestion] = useState();
  const [isDone, setIsDone] = useState(false);
  const [participantId, setParticipantId] = useState();
  const [cookies, setCookies] = useCookies();

  const ids = {
    participantId: participantId,
    jamId: jamId,
    statementId: question ? question.key : null
  }

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
            <JamButton vote='Agree' ids={ids} onComplete={loadQuestion}/>
            <JamButton vote='Disagree' ids={ids} onComplete={loadQuestion}/>
            <JamButton vote='Skip' ids={ids} onComplete={loadQuestion}/>
          </>
        )}
      </main>

    </div>
  );
};

export default Post;
