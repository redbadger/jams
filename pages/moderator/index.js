import {
  Heading,
  VStack,
  HStack,
  Container,
  Input,
  Text,
  Textarea,
  Button,
  Spacer,
  Flex,
  Divider,
  Box,
} from '@chakra-ui/react';
import { hello } from '../../dummy_data';
import { useEffect, useState } from 'react';
import ProposedStatementCard from '../../components/ProposedStatementCard';

function Moderator() {
  const greeting = hello();
  const [title, setTitle] = useState();
  const [allStatements, setAllStatements] = useState([]);
  const [currentStatement, setCurrentStatement] = useState('');
  const [description, setDescriptionValue] = useState();
  const [submitted, setSubmitted] = useState();
  // const jamId = encodeURIComponent('6y4qC5HoThwkMKJiBrLn');

  // useEffect(() => {
  //   uploadStatement();
  // }, []);

  // Call API to upload new statement into firestore
  const createStatementRequest = () => {
    fetch(`/api/statement`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jamId: '6y4qC5HoThwkMKJiBrLn',
        description: description,
        statement: allStatements,
      }),
    })
      .then((response) => {
        setSubmitted(response.status);
        console.log(`status code: ${submitted}`);
      })
      .catch((error) => {
        console.error('Error saving statement: ', error);
      });
  };

  // Collect user input from the form
  const handleTitleChange = (e) => {
    let titleValue = e.target.value;
    setTitle(titleValue);
  };

  // Add a description.
  const handleDescriptionChange = (e) => {
    let descriptionValue = e.target.value;
    setDescriptionValue(descriptionValue);
  };

  useEffect(() => {
    if (!submitted) {
      return;
    }

    setAllStatements((allStatements) => [
      ...allStatements,
      currentStatement,
    ]);
    setCurrentStatement('');

    setSubmitted(false);
  }, [submitted]);

  const handleStatementChange = (e) => {
    let statementValue = e.target.value;
    setCurrentStatement(statementValue);
  };

  // save handler
  const handleSave = () => {
    setSubmitted(true);
  };

  const handleForm = () => {
    console.log(`title: ${title}, statement: ${statement}`);
  };

  const handleDeletePropsedStatement = (deleteIndex) => {
    console.log(deleteIndex);
    setAllStatements((allStatements) =>
      allStatements.filter(
        (statement, index) => index !== deleteIndex,
      ),
    );
  };

  return (
    <Container>
      <VStack align="start" spacing={5}>
        <Heading>Create a new Jam: {greeting}</Heading>

        <Text fontSize="xl">Title</Text>
        <Text fontSize="xs" color="gray.500">
          The title cannot be edited after the Jam is published
        </Text>
        <Input
          placeholder="title"
          size="md"
          onChange={handleTitleChange}
        />

        <Text fontSize="xl">Description</Text>
        <Text fontSize="xs" color="gray.500">
          The description cannot be edited after the Jam is published
        </Text>
        <Textarea
          placeholder="description"
          size="md"
          onChange={handleDescriptionChange}
        />

        <Text fontSize="xl">Statements</Text>

        <ul>
          {allStatements.map((statement, index) => (
            <ProposedStatementCard
              key={index}
              index={index}
              onClick={handleDeletePropsedStatement}
            >
              {statement}
            </ProposedStatementCard>
          ))}
        </ul>

        <VStack spacing={1} align="start">
          <Text fontSize="xs" color="gray.500">
            <span>&bull;</span>Staments should be easy for everyone to
            understand
          </Text>

          <Text fontSize="xs" color="gray.500">
            <span>&bull;</span>Keep them clear and under 140
            characters
          </Text>
          <Text fontSize="xs" color="gray.500">
            <span>&bull;</span>Each one should be unique and raise a
            different point
          </Text>
        </VStack>
        <Textarea
          placeholder="statements"
          size="md"
          value={currentStatement}
          onChange={handleStatementChange}
        />
      </VStack>

      <Flex>
        <Box p="3" />
      </Flex>

      <Flex justifyContent="flex-end">
        <Button>Cancel</Button>
        <Box p="1"></Box>
        <Button onClick={() => handleSave()}>Save</Button>
      </Flex>
      <Flex>
        <Box p="6" />
      </Flex>

      <Flex justifyContent="flex-end">
        <Button>Cancel</Button>
        <Box p="1"></Box>
        <Button onClick={() => createStatementRequest()}>
          Publish
        </Button>
      </Flex>
    </Container>
  );
}

export default Moderator;
