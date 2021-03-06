import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import JamButton from '../../components/JamButton';
import { Box, Stack } from '@chakra-ui/layout';
import ParticipantAddNewStatement from '../../components/ParticipantAddNewStatement';
import Layout from '../../components/Layout';
import JamClosed from '../../components/JamClosed';
import LoadingState from '@/components/LoadingState';
import FourOhFour from '../../components/404';
import { InfoOutlineIcon } from '@chakra-ui/icons';
import { convertDate } from '../../utils/date';
import {
  Heading,
  Text,
  GridItem,
  HStack,
  Progress,
} from '@chakra-ui/react';
import JamHeader from '@/components/ParticipantJamHeader';

const Jam = () => {
  const router = useRouter();
  const { jam: jamUrlPath } = router.query;

  const [jam, setJam] = useState();
  const [question, setQuestion] = useState();
  const [isDone, setIsDone] = useState(false);
  const [votingOn, setVotingOn] = useState();
  const [participantId, setParticipantId] = useState();
  const [cookies, setCookies] = useCookies();
  const [error, setError] = useState();

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw new Error('404');
        }
      })
      .then((json) => {
        setJam(json);
      })
      .catch((e) => {
        if (e.message === '404') {
          setError(404);
        } else {
          setError(500);
        }
      });
  };

  const loadQuestion = () => {
    return fetch(
      `/api/question?jamId=${encodeURIComponent(
        jam.key,
      )}&participantId=${encodeURIComponent(participantId)}`,
    )
      .then((response) => response.json())
      .then((question) => {
        const keys = Object.keys(question);
        // TODO maybe indicate this differently
        if (!keys.length) {
          setQuestion();
          setIsDone(true);
          return;
        }

        setQuestion(question);
      });
  };

  const sendRequest = (vote) => {
    return fetch('/api/vote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ vote, ...ids }),
    }).catch((error) => console.error('Error saving vote: ', error));
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

  const handleVote = (vote) => (e) => {
    setVotingOn(vote);
    sendRequest(vote)
      .then(loadQuestion)
      .then(() => {
        setVotingOn(null);
      });
  };

  if (error) return <FourOhFour />;
  if (jam && !jam.isOpen) return <JamClosed />;

  return jam && (question || isDone) ? (
    <Box>
      <Head>
        <title>Jams - Participate in a Jam.</title>
      </Head>
      <JamHeader
        title={jam && jam.name}
        description={jam && jam.description}
        participantId={participantId}
      />
      <Progress
        h="0.5"
        value={
          question
            ? (question.meta.numVotes / question.meta.numQuestions) *
              100
            : 100
        }
      />
      <Layout py={14}>
        <GridItem colSpan={6}>
          {question && (
            <Text color="gray.400">
              {question.meta.numVotes + 1} /{' '}
              {question.meta.numQuestions}
            </Text>
          )}
          <Heading as="h1" size="xl" mb={2}>
            {!isDone ? question.text : 'All done'}
          </Heading>
          {isDone && (
            <Text color="gray.600">
              Thanks for completing this Jam. Check back later for new
              statements!
            </Text>
          )}
          <HStack pb="2">
            {question && question.isUserSubmitted ? (
              <>
                <InfoOutlineIcon />
                <Text fontSize="xs" color="gray.600">
                  <strong>Participant</strong> submitted{' '}
                  {convertDate(question.submittedAt?._seconds)}
                </Text>
              </>
            ) : (
              <Box h="18px" />
            )}
          </HStack>
        </GridItem>
        {!isDone && (
          <GridItem colSpan={6}>
            <Text pb={4} color={'gray.600'}>
              What do you think about this statement?
            </Text>
            <Stack direction="row" spacing={4} align="left" pb={12}>
              <JamButton
                vote="Agree"
                colorScheme={'blue'}
                votingOn={votingOn}
                voteClickHandler={handleVote}
              />
              <JamButton
                vote="Disagree"
                colorScheme={'blue'}
                votingOn={votingOn}
                voteClickHandler={handleVote}
              />
              <JamButton
                variant="link"
                vote="Skip"
                colorScheme={'blue'}
                votingOn={votingOn}
                voteClickHandler={handleVote}
              />
            </Stack>
          </GridItem>
        )}
        <GridItem colSpan={6}>
          <Text as="h5" fontWeight={600} pb={4}>
            Have another statement in mind? Suggest a new one to be
            voted on as part of this Jam.
          </Text>
          <ParticipantAddNewStatement jamId={jam ? jam.key : null} />
        </GridItem>
      </Layout>
    </Box>
  ) : (
    <GridItem colSpan="4">
      <LoadingState>Loading jam...</LoadingState>
    </GridItem>
  );
};

export default Jam;
