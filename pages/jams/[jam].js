import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import moment from 'moment';
import JamButton from '../../components/JamButton';
import { Box, Stack } from '@chakra-ui/layout';
import ParticipantAddNewStatement from '../../components/ParticipantAddNewStatement';
import Layout from '../../components/Layout';
import DefaultErrorPage from 'next/error';
import { InfoOutlineIcon } from '@chakra-ui/icons';
import { Heading, Text, GridItem, HStack } from '@chakra-ui/react';

function JamHeader({ title, description, participantId }) {
  return (
    <Box as="header" py={4} pb={0} bg={'white'}>
      <HStack px={4}>
        <Box w={'50%'}>Jammy jams</Box>
        <Box
          w={'50%'}
          align={'right'}
          color={'gray.400'}
          fontSize={'sm'}
        >
          Participant ID: {participantId}
        </Box>
      </HStack>
      <Layout>
        <GridItem colSpan={6} py={8}>
          <Heading as="h2" size="lg" fontWeight={400}>
            {title || 'Loading...'}
          </Heading>
          <Text color={'gray.600'} mt={4}>
            {description}&nbsp;
          </Text>
        </GridItem>
      </Layout>
    </Box>
  );
}

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
        if (!keys.length) {
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

  if (error) return <DefaultErrorPage statusCode={error} />;

  // TODO: replace with proper error page when those are done
  if (jam && !jam.isOpen) return <Text>Jam is no longer active</Text>;

  return (
    <Box>
      <Head>
        <title>Jams - participate in a jam</title>
      </Head>
      <JamHeader
        title={jam && jam.name}
        description={jam && jam.description}
        participantId={participantId}
      />
      <Layout py={14}>
        <GridItem colSpan={6}>
          <Heading as="h1" size="xl" fontWeight={500} mb={8}>
            {!isDone
              ? question
                ? question.text
                : 'Loading...'
              : 'All done'}
          </Heading>
        </GridItem>
        {question
          ? question.isUserSubmitted && (
              <GridItem colSpan={4}>
                <HStack>
                  <InfoOutlineIcon />
                  <Text fontSize="xs">
                    <strong>Participant</strong> submitted{' '}
                    {moment(
                      question.createdAt?._seconds * 1000,
                    ).format('DD MMM hh:mm A')}
                  </Text>
                </HStack>
                <br />
              </GridItem>
            )
          : ''}
        <br />
        {!isDone && (
          <GridItem colSpan={6}>
            <Text pb={4} color={'gray.600'}>
              What do you think about this statement?
            </Text>
            <Stack direction="row" spacing={4} align="left" pb={8}>
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
          <Text as="h5" fontWeight={600} mt={8} pb={4}>
            Add a new statement to this survey:
          </Text>
          <ParticipantAddNewStatement jamId={jam ? jam.key : null} />
        </GridItem>
      </Layout>
    </Box>
  );
};

export default Jam;
