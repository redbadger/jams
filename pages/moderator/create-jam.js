import {
  Heading,
  VStack,
  Container,
  Input,
  Text,
  Textarea,
  Button,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Box,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import ProposedStatementCard from '../../components/ProposedStatementCard';
import { cloneDeep } from 'lodash';
import { useDisclosure } from '@chakra-ui/hooks';
import Link from 'next/link';

function Moderator() {
  const [title, setTitle] = useState();
  const [allStatements, setAllStatements] = useState([]);
  const [currentStatement, setCurrentStatement] = useState('');
  const [description, setDescriptionValue] = useState();
  const [statementSubmitted, setStatementSubmitted] = useState(false);
  const [jamSubmitted, setJamSubmitted] = useState(false);
  const [jamUrlPath, setJamUrlPath] = useState();
  const {
    isOpen: successModalIsOpen,
    onOpen: successModalOnOpen,
    onClose: successModalOnClose,
  } = useDisclosure();

  // Call API to upload new statement into firestore
  const createJam = () => {
    fetch(`/api/jam`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: title,
        description: description,
        statements: allStatements,
      }),
    })
      .then((response) => response.json())
      .then((jamData) => {
        console.log(jamData);
        setJamUrlPath(jamData.urlPath);
        successModalOnOpen();
        console.log(`status code: ${statementSubmitted}`);
      })
      .catch((error) => {
        console.error('Error saving statement: ', error);
      });
  };

  const handleTitleChange = (e) => {
    let titleValue = e.target.value;
    setTitle(titleValue);
  };

  const handleDescriptionChange = (e) => {
    let descriptionValue = e.target.value;
    setDescriptionValue(descriptionValue);
  };

  useEffect(() => {
    if (!statementSubmitted) {
      return;
    }

    setAllStatements((allStatements) => [
      ...allStatements,
      currentStatement,
    ]);
    setCurrentStatement('');

    setStatementSubmitted(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statementSubmitted]);

  const handleStatementChange = (e) => {
    let statementValue = e.target.value;
    setCurrentStatement(statementValue);
  };

  const handleSave = () => {
    setStatementSubmitted(true);
  };

  const handleDeletePropsedStatement = (deleteIndex) => {
    setAllStatements((allStatements) =>
      allStatements.filter((_, index) => index !== deleteIndex),
    );
  };

  const handleEditExistingStatement = (editIndex, statement) => {
    setAllStatements((allStatements) => {
      const copyStatements = cloneDeep(allStatements);
      copyStatements[editIndex] = statement;
      return copyStatements;
    });
  };

  return (
    <>
      <Container>
        <VStack align="start" spacing={5}>
          <Heading>Create a new Jam:</Heading>

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
            The description cannot be edited after the Jam is
            published
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
                onDelete={handleDeletePropsedStatement}
                onSave={handleEditExistingStatement}
              >
                {statement}
              </ProposedStatementCard>
            ))}
          </ul>

          <VStack spacing={1} align="start">
            <Text fontSize="xs" color="gray.500">
              <span>&bull;</span>Staments should be easy for everyone
              to understand
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
          <Button onClick={successModalOnOpen}>Cancel</Button>
          <Box p="1"></Box>
          <Button onClick={() => createJam()}>Publish</Button>
        </Flex>
      </Container>

      <Modal
        isOpen={successModalIsOpen}
        onClose={successModalOnClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Your Jam is now live!</ModalHeader>
          {/* GET RID OF THIS  */}
          <ModalCloseButton />
          <ModalBody>
            Everyone with the below link will now be able to
            participate in your Jam. You can toggle your Jam to closed
            at any time.
          </ModalBody>
          <ModalFooter>
            <Link href="/moderator">
              <a>
                <Button mr={3}>Back to overview</Button>
              </a>
            </Link>
            <Link href={`/jams/${jamUrlPath}`}>
              <a>
                <Button colorScheme="blue">View Jam</Button>
              </a>
            </Link>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default Moderator;
