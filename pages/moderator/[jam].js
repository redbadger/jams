import {
  Badge,
  Box,
  Button,
  Flex,
  GridItem,
  Heading,
  Spacer,
  Stack,
  Switch,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from '@chakra-ui/react';
import { ArrowBackIcon, ChatIcon, LockIcon } from '@chakra-ui/icons';
import Layout from 'components/Layout';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import cloneDeep from 'lodash.clonedeep';
import merge from 'lodash.merge';

const LiveQuestionCard = ({ question, buttonText, onClick }) => {
  return (
    <Box
      border="1px"
      p={5}
      borderRadius="md"
      borderColor="gray.200"
      my={4}
      backgroundColor="white"
    >
      <Text pb={5}>{question.text}</Text>

      <Flex>
        <Box>
          {question.isUserSubmitted ? (
            <Text color="gray.600">
              <ChatIcon></ChatIcon> Participant submitted{' '}
              {new Date(
                question.createdAt?._seconds * 1000,
              ).toUTCString()}
            </Text>
          ) : (
            <Text color="gray.600">
              <LockIcon></LockIcon> Moderator submitted{' '}
              {new Date(
                question.createdAt?._seconds * 1000,
              ).toUTCString()}
            </Text>
          )}
        </Box>

        <Spacer />

        <Button variant="outline" onClick={onClick}>
          {buttonText}
        </Button>
      </Flex>
    </Box>
  );
};

const NewQuestionCard = ({ question }) => {
  return (
    <Box
      border="1px"
      p={5}
      borderRadius="md"
      borderColor="gray.200"
      my={4}
      backgroundColor="white"
    >
      <Text pb={5}>{question.text}</Text>

      <Flex>
        <Box>
          <Text color="gray.600">
            <ChatIcon></ChatIcon> Participant submitted{' '}
            {new Date(
              question.createdAt?._seconds * 1000,
            ).toUTCString()}
          </Text>
        </Box>

        <Spacer />

        <Stack direction="row" spacing={2}>
          <Button variant="outline">Edit</Button>
          <Button colorScheme="blue">Reject</Button>
          <Button colorScheme="blue">Approve</Button>
        </Stack>
      </Flex>
    </Box>
  );
};

const Jam = () => {
  const router = useRouter();
  const { jam: jamUrlPath } = router.query;
  const [jam, setJam] = useState({});
  const [published, setPublished] = useState();
  const [location, setLocation] = useState();
  const [approvedQuestions, setApprovedQuestions] = useState([]);
  const [rejectedQuestions, setRejectedQuestions] = useState([]);
  const [newQuestions, setNewQuestions] = useState([]);
  const [patchSuccess, setPatchTrigger] = useState();

  useEffect(() => {
    setLocation(window.location.origin);
  }, []);

  useEffect(() => {
    if (router.isReady) {
      loadJam();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  useEffect(() => {
    if (!jam.questions) {
      return;
    }

    setApprovedQuestions(
      jam.questions.filter((question) => question.state === 1),
    );
    setRejectedQuestions(
      jam.questions.filter((question) => question.state === -1),
    );
    setNewQuestions(
      jam.questions.filter((question) => question.state === 0),
    );
  }, [jam, patchSuccess]);

  const loadJam = () => {
    fetch(
      `/api/jam?jamUrlPath=${encodeURIComponent(
        jamUrlPath,
      )}&includeQuestions=true`,
    )
      .then((response) => response.json())
      .then((jam) => {
        setJam(jam);
        setPublished(jam.isOpen);
      });
  };

  const patchQuestion = (body) => {
    const { jamId, statementId, ...updateFields } = body;
    fetch('/api/statement', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
      .then(() => {
        setJam((jam) => {
          var questionIndex = jam.questions.findIndex(
            (q) => q.key == statementId,
          );

          jam.questions[questionIndex] = merge(
            jam.questions[questionIndex],
            updateFields,
          );

          return jam;
        });
        setPatchTrigger((patchTrigger) => !patchTrigger);
      })
      .catch(() => console.error('Bad request'));
  };

  return (
    <Box>
      <Link href="/moderator" passHref>
        <Text color="gray.700">
          <ArrowBackIcon /> Back to overview
        </Text>
      </Link>
      <Layout py={14}>
        <GridItem colSpan={6}>
          <Stack direction="column" spacing={5}>
            <Heading as="h1" size="lg">
              {jam.name}
            </Heading>
            <Link href={`${location}/jams/${jam.urlPath}`} passHref>
              {`${location}/jams/${jam.urlPath}`}
            </Link>
            <Stack direction="row" spacing={5}>
              <Switch
                size="md"
                colorScheme="green"
                isChecked={published}
                onChange={() =>
                  setPublished((published) => {
                    // SET JAM TO OPEN/CLOSED HERE
                    return !published;
                  })
                }
              ></Switch>
              {published ? (
                <Badge colorScheme="green">Open</Badge>
              ) : (
                <Badge colorScheme="gray">Closed</Badge>
              )}
            </Stack>
            <Text fontSize="md">{jam.description}</Text>
            <Text fontSize="sm" color="gray.600">
              {new Date(jam.createdAt?._seconds * 1000).toUTCString()}
            </Text>
            <Button w="150px" colorScheme="blue">
              Download CSV
            </Button>
            <Tabs>
              <TabList>
                <Tab>Approved {approvedQuestions.length}</Tab>
                <Tab>Rejected {rejectedQuestions.length}</Tab>
                <Tab>New {newQuestions.length}</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  {approvedQuestions.map((question, index) => (
                    <LiveQuestionCard
                      key={index}
                      question={question}
                      buttonText="Reject"
                      onClick={() =>
                        patchQuestion({
                          jamId: jam.key,
                          statementId: question.key,
                          state: -1,
                        })
                      }
                    />
                  ))}
                </TabPanel>
                <TabPanel>
                  {rejectedQuestions.map((question, index) => (
                    <LiveQuestionCard
                      key={index}
                      question={question}
                      buttonText="Approve"
                      onClick={() =>
                        patchQuestion({
                          jamId: jam.key,
                          statementId: question.key,
                          state: 1,
                        })
                      }
                    />
                  ))}
                </TabPanel>
                <TabPanel>
                  {newQuestions.map((question, index) => (
                    <NewQuestionCard
                      key={index}
                      question={question}
                      buttonText="Approve"
                    />
                  ))}
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Stack>
        </GridItem>
      </Layout>
    </Box>
  );
};

export default Jam;
