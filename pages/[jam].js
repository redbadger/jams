import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';
import { useCookies } from 'react-cookie';
import JamButton from '../components/JamButton';

const Jam = () => {
  const router = useRouter();
  const { jam: jamId } = router.query;

  const [question, setQuestion] = useState();
  const [isDone, setIsDone] = useState(false);
  const [participantId, setParticipantId] = useState();
  const [cookies, setCookies] = useCookies();

  const ids = {
    participantId: participantId,
    jamId: question ? question.jamId : null,
    statementId: question ? question.key : null,
  };

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
    fetch(
      `/api/question?jamId=${encodeURIComponent(
        jamId,
      )}&participantId=${encodeURIComponent(participantId)}`,
    )
      .then((response) => response.json())
      .then((question) => {
        const keys = Object.keys(question);
        if (!keys.length) {
          setIsDone(true);
          return;
        }

        setQuestion(question);
      });
  };

  const settingIdCookies = () => {
    fetch('/api/participant', {
      method: 'POST',
    })
      .then((response) => response.json())
      .then((participant) => {
        // Can we do this using a Set-Cookie header?
        setCookies('jams-participant', participant.participantId);
      })
      .catch((error) =>
        console.error('Error saving participant: ', error),
      );
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
            <JamButton
              vote="Agree"
              ids={ids}
              onComplete={loadQuestion}
            />
            <JamButton
              vote="Disagree"
              ids={ids}
              onComplete={loadQuestion}
            />
            <JamButton
              vote="Skip"
              ids={ids}
              onComplete={loadQuestion}
            />
          </>
        )}
      </main>

      <footer className={styles.footer}>
        <a>Powered by Red Badger</a>
      </footer>
    </div>
  );
};

export default Jam;
