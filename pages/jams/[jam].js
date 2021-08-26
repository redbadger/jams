import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import JamButton from '../../components/JamButton';
import { Box, Stack } from '@chakra-ui/layout';
import AddNewStatement from '../../components/AddNewStatement';
import Layout from 'components/Layout';
import {
  Center,
  Heading,
  Text,
  GridItem,
  HStack,
} from '@chakra-ui/react';

function JamHeader({ title, description, participantId }) {
  return (
    <Box as="header" p={4} pb={0} bg={'white'}>
      <HStack>
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
        <GridItem colSpan={6} py={12}>
          <Heading as="h3" size="lg" fontWeight={500}>
            {title || 'Loading...'}
          </Heading>
          <Text color={'gray.400'} mt={4}>
            {description || "Won't take long."}
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
    <Box>
      <Head>
        <title>Jams - participate in a jam</title>
      </Head>
      <JamHeader
        title={jam && jam.name}
        description={jam && jam.description}
        participantId={participantId}
      />
      <Layout py={12}>
        <GridItem colSpan={6}>
          <Heading as="h4" size="2xl" fontWeight={500}>
            {!isDone
              ? question
                ? question.text
                : 'Loading...'
              : 'All done'}
          </Heading>
        </GridItem>

        {!isDone && (
          <GridItem colSpan={6}>
            <Text pb={4} color={'gray.500'} fontWeight={500}>
              What do you think about this statement?
            </Text>
            <Stack direction="row" spacing={4} align="left" mb={3}>
              <JamButton
                vote="Agree"
                ids={ids}
                onComplete={loadQuestion}
                variant={'dark-grey'}
              />
              <JamButton
                vote="Disagree"
                ids={ids}
                onComplete={loadQuestion}
                variant={'dark-grey'}
              />
              <JamButton
                variant="link"
                vote="Skip"
                ids={ids}
                onComplete={loadQuestion}
              />
            </Stack>
          </GridItem>
        )}

        <GridItem colSpan={6}>
          <Heading as={'h5'} size={'sm'} fontWeight={500} py={2}>
            Add a new statement to this survey:
          </Heading>
          <AddNewStatement jamId={jam ? jam.key : null} />
        </GridItem>
      </Layout>
    </Box>
  );
};

export default Jam;
