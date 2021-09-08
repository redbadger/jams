import {
  Badge,
  HStack,
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Heading,
  Spacer,
  Stack,
  Switch,
  Tab,
  Link,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from '@chakra-ui/react';
import {
  CheckIcon,
  ChatIcon,
  LockIcon,
  CloseIcon,
} from '@chakra-ui/icons';
import AdminLayout from 'components/AdminLayout';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import merge from 'lodash.merge';
import LoadingState from '@/components/LoadingState';
import ModeratorNewStatementCard from '../../components/ModeratorNewStatementCard';
import ModeratorAddNewStatement from '../../components/ModeratorAddNewStatement';
import { convertDate, timeSince } from '../../utils/date';
import FourOhThree from '../../components/403';
import EmptyState from '@/components/EmptyState';

const ApprovedStatementCard = ({ statement, onClick }) => {
  return (
    <LiveStatementCard
      statement={statement}
      buttonText="Reject"
      stateChangeText={
        <>
          <CheckIcon /> Approved
        </>
      }
      onClick={onClick}
    />
  );
};

const RejectedStatementCard = ({ statement, onClick }) => {
  return (
    <LiveStatementCard
      statement={statement}
      buttonText="Approve"
      stateChangeText={
        <>
          <CloseIcon /> Rejected
        </>
      }
      onClick={onClick}
    />
  );
};

const StatementList = ({ list, render, type }) => {
  if (!list.length) {
    return <EmptyState>No {type} statements yet.</EmptyState>;
  } else {
    return render(list);
  }
};

const LiveStatementCard = ({
  statement,
  buttonText,
  stateChangeText,
  onClick,
}) => {
  return (
    <Box
      border="1px"
      p={5}
      borderRadius="md"
      borderColor="gray.200"
      my={4}
      backgroundColor="white"
    >
      <Text>{statement.text}</Text>

      <HStack spacing="4" mb="8">
        <Text as="span" fontSize="sm" color="gray.600">
          Agree: {statement.numAgrees || 0}
        </Text>
        <Text as="span" fontSize="sm" color="gray.600">
          Disagree: {statement.numDisagrees || 0}
        </Text>
        <Text as="span" fontSize="sm" color="gray.600">
          Pass: {statement.numSkipped || 0}
        </Text>
      </HStack>

      <Flex>
        <Box>
          {statement.isUserSubmitted ? (
            <>
              <Text fontSize="xs" color="gray.600">
                <ChatIcon /> Participant submitted{' '}
                {convertDate(statement.submittedAt?._seconds)}
              </Text>
              <Text fontSize="xs" color="gray.600">
                {stateChangeText}{' '}
                {convertDate(statement.stateChangeTime?._seconds)}
              </Text>
            </>
          ) : (
            <>
              <Text fontSize="xs" color="gray.600">
                <LockIcon /> Moderator submitted{' '}
                {convertDate(statement.submittedAt?._seconds)}
              </Text>
              <Text fontSize="xs" color="gray.600">
                {stateChangeText}{' '}
                {convertDate(statement.stateChangeTime?._seconds)}
              </Text>
            </>
          )}
        </Box>

        <Spacer />

        <Button
          variant="outline"
          colorScheme="blue"
          onClick={onClick}
        >
          {buttonText}
        </Button>
      </Flex>
    </Box>
  );
};

const Jam = () => {
  const router = useRouter();
  const { jam: jamUrlPath } = router.query;
  const [jam, setJam] = useState();
  const [published, setPublished] = useState();
  const [location, setLocation] = useState();
  const [approvedStatements, setApprovedStatements] = useState([]);
  const [rejectedStatements, setRejectedStatements] = useState([]);
  const [newStatements, setNewStatements] = useState([]);
  const [updateSuccess, setUpdateTrigger] = useState();
  const [totalVotes, setTotalVotes] = useState(0);
  const [participantsCount, setParticipantsCount] = useState(0);
  const [error, setError] = useState();

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
    if (!jam || !jam.statements) {
      return;
    }

    setApprovedStatements(
      jam.statements.filter((statement) => statement.state === 1),
    );
    setRejectedStatements(
      jam.statements.filter((statement) => statement.state === -1),
    );
    setNewStatements(
      jam.statements.filter((statement) => statement.state === 0),
    );
  }, [jam, updateSuccess]);

  useEffect(() => {
    if (!jam || !jam.statements) {
      return;
    }

    setTotalVotes(
      jam.statements.reduce((acc, statement) => {
        return (
          acc +
          (statement.numAgrees || 0) +
          (statement.numDisagrees || 0)
        );
      }, 0),
    );

    fetch(
      `/api/jam-participants?jamId=${encodeURIComponent(jam.key)}`,
    )
      .then((response) => response.json())
      .then((json) => {
        setParticipantsCount(json.count);
      });
  }, [jam]);

  const loadJam = () => {
    const fourOhThree = '403';

    fetch(
      `/api/jam?jamUrlPath=${encodeURIComponent(
        jamUrlPath,
      )}&includeStatements=true`,
    )
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw new Error(fourOhThree);
        }
      })
      .then((jam) => {
        setJam(jam);
        setPublished(jam.isOpen);
      })
      .catch((e) => {
        if (e.message === fourOhThree) {
          setError(403);
        } else {
          setError(500);
        }
      });
  };

  const postStatementRequest = (body) => {
    const { statement, jamId } = body;
    const extraFields = { isUserSubmitted: false, state: 1 };

    fetch('/api/statement', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(
        merge({ statement: statement, jamId: jamId }, extraFields),
      ),
    })
      .then((response) => response.json())
      .then((json) => {
        setJam((jam) => {
          jam.statements.push(
            merge(
              {
                text: statement,
                jamId: jamId,
                key: json.key,
                submittedAt: {
                  _seconds: new Date().getTime() / 1000,
                },
                stateChangeTime: {
                  _seconds: new Date().getTime() / 1000,
                },
              },
              extraFields,
            ),
          );

          return jam;
        });
        setUpdateTrigger((updateTrigger) => !updateTrigger);
      })
      .catch(() => console.error('Bad request'));
  };

  const patchStatementRequest = (body) => {
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
          if ('state' in updateFields) {
            updateFields['stateChangeTime'] = {
              _seconds: new Date().getTime() / 1000,
            };
          }

          var statementIndex = jam.statements.findIndex(
            (s) => s.key == statementId,
          );

          jam.statements[statementIndex] = merge(
            jam.statements[statementIndex],
            updateFields,
          );

          return jam;
        });
        setUpdateTrigger((updateTrigger) => !updateTrigger);
      })
      .catch(() => console.error('Bad request'));
  };

  const patchJamRequest = (body) => {
    const { jamId, ...updateFields } = body;
    fetch('/api/jam', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
      .then(() => {
        setJam((jam) => {
          jam = merge(jam, updateFields);
          return jam;
        });
        setUpdateTrigger((updateTrigger) => !updateTrigger);
      })
      .catch(() => console.error('Bad request'));
  };

  const handleDownload = (jamId) => {
    window.location = `/api/csv-export?jamId=${jamId}`;
  };
  if (error == 403) return <FourOhThree />;

  return (
    <AdminLayout>
      {jam ? (
        <GridItem colSpan={6}>
          <Stack direction="column" spacing={5}>
            <Heading as="h2" size="lg">
              {jam.name}
            </Heading>
            <Box>
              <Link href={`${location}/jams/${jam.urlPath}`}>
                {`${location}/jams/${jam.urlPath}`}
              </Link>
            </Box>
            <Stack direction="row" spacing={5}>
              <Switch
                size="md"
                pt={0.5}
                colorScheme="green"
                isChecked={published}
                onChange={(e) => {
                  patchJamRequest({
                    isOpen: e.target.checked,
                    jamId: jam.key,
                  });
                  setPublished(e.target.checked);
                }}
              ></Switch>
              {published ? (
                <Badge p="1" colorScheme="green" variant="outline">
                  Open
                </Badge>
              ) : (
                <Badge p="1" colorScheme="gray" variant="outline">
                  Closed
                </Badge>
              )}
            </Stack>
            <Text fontSize="md">{jam.description}</Text>
            <Grid templateColumns="repeat(2, 1fr)">
              <Text fontSize="sm" color="gray.600">
                Open for {timeSince(jam.createdAt?._seconds)} <br />
                Created: {convertDate(jam.createdAt?._seconds)}
              </Text>
              <Text fontSize="sm" color="gray.600">
                Total votes: {totalVotes}
                <br />
                Participants voted: {participantsCount}
              </Text>
            </Grid>
            <Stack direction="row">
              <Button
                colorScheme="blue"
                onClick={() => handleDownload(jam.key, jam.name)}
              >
                Download CSV
              </Button>
            </Stack>
            <Tabs>
              <TabList>
                <Tab>Approved {approvedStatements.length}</Tab>
                <Tab>Rejected {rejectedStatements.length}</Tab>
                <Tab>New {newStatements.length}</Tab>
              </TabList>
              <TabPanels>
                <TabPanel p={0}>
                  <StatementList
                    list={approvedStatements}
                    type="approved"
                    render={(list) =>
                      list.map((statement, index) => (
                        <ApprovedStatementCard
                          key={index}
                          statement={statement}
                          onClick={() =>
                            patchStatementRequest({
                              jamId: jam.key,
                              statementId: statement.key,
                              state: -1,
                            })
                          }
                        />
                      ))
                    }
                  ></StatementList>
                  <ModeratorAddNewStatement
                    jamId={jam.key}
                    postRequest={postStatementRequest}
                  />
                </TabPanel>
                <TabPanel p={0}>
                  <StatementList
                    type="rejected"
                    list={rejectedStatements}
                    render={(list) =>
                      list.map((statement, index) => (
                        <RejectedStatementCard
                          key={index}
                          statement={statement}
                          onClick={() =>
                            patchStatementRequest({
                              jamId: jam.key,
                              statementId: statement.key,
                              state: 1,
                            })
                          }
                        />
                      ))
                    }
                  ></StatementList>
                </TabPanel>
                <TabPanel p={0}>
                  <StatementList
                    type="new"
                    list={newStatements}
                    render={(list) =>
                      list.map((statement, index) => (
                        <ModeratorNewStatementCard
                          key={index}
                          statement={statement}
                          patchRequest={patchStatementRequest}
                          jamId={jam.key}
                        />
                      ))
                    }
                  ></StatementList>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Stack>
        </GridItem>
      ) : (
        <GridItem colSpan="6">
          <LoadingState>Loading Jam...</LoadingState>
        </GridItem>
      )}
    </AdminLayout>
  );
};

Jam.auth = true;
export default Jam;
