import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import JamButton from '../../components/JamButton';
import { Stack } from '@chakra-ui/layout';
import AddNewStatement from '../../components/AddNewStatement';
import { Center, Heading, Text } from '@chakra-ui/react';

const Jam = () => {
  const router = useRouter();
  const { jam: jamUrlPath } = router.query;

  const [jam, setJam] = useState();
  const [question, setQuestion] = useState();
  const [isDone, setIsDone] = useState(false);
  const [participantId, setParticipantId] = useState();
  const [cookies, setCookies] = useCookies();

  const ids = {
    participantId: participantId,
    jamId: jam ? jam.key : null,
    statementId: question ? question.key : null,
  };

  useEffect(() => {
    if (router.isReady && participantId) {
      loadJam();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, participantId]);

  useEffect(() => {
    if (jam == null) {
      return;
    }

    loadQuestion();
  }, [jam]);

  useEffect(() => {
    const id = cookies['jams-participant'];
    if (id) {
      setParticipantId(id);
    } else {
      settingIdCookies();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cookies]);

  const loadJam = () => {
    fetch(`/api/jam?jamUrlPath=${encodeURIComponent(jamUrlPath)}`)
      .then((response) => response.json())
      .then((json) => {
        setJam(json);
      });
  };

  const loadQuestion = () => {
    fetch(
      `/api/question?jamId=${encodeURIComponent(
        jam.key,
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
        setCookies('jams-participant', participant.participantId);
      })
      .catch((error) =>
        console.error('Error saving participant: ', error),
      );
  };

  return (
    <Center h="100vh">
      <div>
        <Head>
          <title>JAMS</title>
        </Head>

        <Stack direction="column" spacing={2} mb={5}>
          {jam && (
            <>
              <Heading as="h1" size="2xl">
                {jam.name}
              </Heading>
              <Text>{jam.description}</Text>
            </>
          )}

          <Heading as="h1" size="3xl">
            {!isDone
              ? question
                ? question.text
                : 'Loading...'
              : 'All done'}
          </Heading>

          <h3>Participant id: {participantId}</h3>
          {!isDone && (
            <>
              <Stack direction="row" spacing={4} align="left" mb={3}>
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
                  variant="link"
                  vote="Skip"
                  ids={ids}
                  onComplete={loadQuestion}
                />
              </Stack>
            </>
          )}

          <AddNewStatement jamId={jam ? jam.key : null} />
        </Stack>

        <footer>
          <a href="https://red-badger.com">Powered by Red Badger</a>
        </footer>
      </div>
    </Center>
  );
};

export default Jam;
