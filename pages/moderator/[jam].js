import {
  Badge,
  Box,
  Button,
  GridItem,
  Stack,
  Switch,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from '@chakra-ui/react';
import Layout from 'components/Layout';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const Jam = () => {
  const router = useRouter();
  const { jam: jamUrlPath } = router.query;
  const [jam, setJam] = useState({});
  const [published, setPublished] = useState();
  const [location, setLocation] = useState();
  const [approvedQuestions, setApprovedQuestions] = useState([]);
  const [rejectedQuestions, setRejectedQuestions] = useState([]);
  const [newQuestions, setNewQuestions] = useState([]);

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
  }, [jam]);

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

  return (
    <Box>
      <Layout py={14}>
        <GridItem colSpan={6}>
          <Stack direction="column" spacing={5}>
            <Text fontSize="xl">{jam.name}</Text>
            <Link href={`${location}/jams/${jam.urlPath}`} passHref>
              {`${location}/jams/${jam.urlPath}`}
            </Link>
            <Stack direction="row" spacing={5}>
              <Switch
                size="lg"
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
                <Badge
                  borderRadius="3xl"
                  border="1px"
                  borderColor="green.700"
                  colorScheme="green"
                  py={1}
                  pl={3}
                  pr={3}
                  textTransform="none"
                >
                  Open
                </Badge>
              ) : (
                <Badge
                  borderRadius="3xl"
                  border="1px"
                  borderColor="gray.700"
                  colorScheme="gray"
                  py={1}
                  pl={3}
                  pr={3}
                  textTransform="none"
                >
                  Closed
                </Badge>
              )}
            </Stack>
            <Text fontSize="md">{jam.description}</Text>
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
                  {approvedQuestions.map((question) => (
                    <Text>{question.text}</Text>
                  ))}
                </TabPanel>
                <TabPanel>
                  {rejectedQuestions.map((question) => (
                    <Text>{question.text}</Text>
                  ))}
                </TabPanel>
                <TabPanel>
                  {newQuestions.map((question) => (
                    <Text>{question.text}</Text>
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
