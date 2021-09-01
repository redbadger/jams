import {
  Badge,
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
import Link from 'next/link';
import merge from 'lodash.merge';
import LoadingState from '@/components/LoadingState';
import ModeratorNewStatementCard from '../../components/ModeratorNewStatementCard';
import ModeratorAddNewStatement from '../../components/ModeratorAddNewStatement';
import { convertDate, timeSince } from '../../utils/date';
import _ from 'lodash';

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
      <Text pb={5}>{statement.text}</Text>

      <Flex>
        <Box>
          {statement.isUserSubmitted ? (
            <Text fontSize="sm" color="gray.600">
              <ChatIcon /> Participant submitted{' '}
              {convertDate(statement.submittedAt?._seconds)}
              <br />
              {stateChangeText}{' '}
              {convertDate(statement.stateChangeTime?._seconds)}
            </Text>
          ) : (
            <Text fontSize="sm" color="gray.600">
              <LockIcon /> Moderator submitted{' '}
              {convertDate(statement.submittedAt?._seconds)}
              <br />
              {stateChangeText}{' '}
              {convertDate(statement.stateChangeTime?._seconds)}
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

const Jam = () => {
  const router = useRouter();
  const { jam: jamUrlPath } = router.query;
  const [jam, setJam] = useState({});
  const [published, setPublished] = useState();
  const [location, setLocation] = useState();
  const [approvedStatements, setApprovedStatements] = useState([]);
  const [rejectedStatements, setRejectedStatements] = useState([]);
  const [newStatements, setNewStatements] = useState([]);
  const [updateSuccess, setUpdateTrigger] = useState();
  const [totalVotes, setTotalVotes] = useState(0);
  const [participantsCount, setParticipantsCount] = useState(0);

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
    if (!jam.statements) {
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
    if (!jam.statements) {
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
    fetch(
      `/api/jam?jamUrlPath=${encodeURIComponent(
        jamUrlPath,
      )}&includeStatements=true`,
    )
      .then((response) => response.json())
      .then((jam) => {
        setJam(jam);
        setPublished(jam.isOpen);
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

  const handleDownload = (jamId, name) => {
    const dateTimeStampDownload =
      _.snakeCase(new Date().toLocaleDateString()) +
      '_' +
      _.snakeCase(new Date().toLocaleTimeString());
    const jamName = _.truncate(_.snakeCase(name), { length: 30 });

    window.location = `/api/csv-export?jamId=${jamId}&jamName=${jamName}&jamStamp=${dateTimeStampDownload}`;
  };

  return (
    <AdminLayout>
      {jam ? (
        <GridItem colSpan={6}>
          <Stack direction="column" spacing={5}>
            <Heading as="h2" size="lg">
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
                onChange={(e) => {
                  patchJamRequest({
                    isOpen: e.target.checked,
                    jamId: jam.key,
                  });
                  setPublished(e.target.checked);
                }}
              ></Switch>
              {published ? (
                <Badge p="1" colorScheme="green">
                  Open
                </Badge>
              ) : (
                <Badge pt="1" colorScheme="gray">
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
                <TabPanel>
                  {approvedStatements.map((statement, index) => (
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
                  ))}
                  <ModeratorAddNewStatement
                    jamId={jam.key}
                    postRequest={postStatementRequest}
                  />
                </TabPanel>
                <TabPanel>
                  {rejectedStatements.map((statement, index) => (
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
                  ))}
                </TabPanel>
                <TabPanel>
                  {newStatements.map((statement, index) => (
                    <ModeratorNewStatementCard
                      key={index}
                      statement={statement}
                      patchRequest={patchStatementRequest}
                      jamId={jam.key}
                    />
                  ))}
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Stack>
        </GridItem>
      ) : (
        <GridItem colSpan="4">
          <LoadingState>Loading jam...</LoadingState>
        </GridItem>
      )}
    </AdminLayout>
  );
};

Jam.auth = true;
export default Jam;
