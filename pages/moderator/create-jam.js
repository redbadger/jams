import {
  Heading,
  VStack,
  Input,
  GridItem,
  Text,
  Textarea,
  Button,
  Box,
  Stack,
  ListItem,
  UnorderedList,
} from '@chakra-ui/react';

import AdminLayout from '@/components/AdminLayout';
import { useEffect, useState, useRef } from 'react';
import ProposedStatementCard from '../../components/ProposedStatementCard';
import ModalCreateJam from '../../components/ModalCreateJam';
import ModalDiscardJam from '../../components/ModalDiscardJam';
import { cloneDeep } from 'lodash';
import { useDisclosure } from '@chakra-ui/hooks';
import { MAX_STATEMENT_LENGTH } from '../../components/constants';

function CreateJam() {
  const [title, setTitle] = useState();
  const [allStatements, setAllStatements] = useState([]);
  const [currentStatement, setCurrentStatement] = useState('');
  const [description, setDescriptionValue] = useState('');
  const [statementSubmitted, setStatementSubmitted] = useState(false);
  const [jamUrlPath, setJamUrlPath] = useState();
  const {
    isOpen: successModalIsOpen,
    onOpen: successModalOnOpen,
    onClose: successModalOnClose,
  } = useDisclosure();
  const {
    isOpen: cancelModalIsOpen,
    onOpen: cancelModalOnOpen,
    onClose: cancelModalOnClose,
  } = useDisclosure();
  const titleElRef = useRef(null);
  const newStatementElRef = useRef(null);

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
        setJamUrlPath(jamData.urlPath);
        successModalOnOpen();
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
    titleElRef.current.focus();
  }, [titleElRef]);

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

    newStatementElRef.current.focus();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statementSubmitted]);

  const handleStatementChange = (e) => {
    let statementValue = e.target.value;
    setCurrentStatement(statementValue);
  };

  const handleSave = () => {
    setStatementSubmitted(true);
  };

  const handleDeleteProposedStatement = (deleteIndex) => {
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
      <AdminLayout>
        <GridItem colSpan="4" colStart="2">
          <VStack align="start" spacing={4}>
            <Heading as="h2" size="lg" mb="4">
              Create a new Jam
            </Heading>

            <Heading size="md" pt="4">
              Title
            </Heading>
            <Text color="gray.600">
              The title cannot be edited after the Jam is published
            </Text>
            <Input
              placeholder="Jam title"
              size="md"
              onChange={handleTitleChange}
              borderRadius="none"
              ref={titleElRef}
              backgroundColor="white"
            />

            <Heading size="md" pt="4">
              Description
            </Heading>
            <Text color="gray.600">
              The description cannot be edited after the Jam is
              published
            </Text>
            <Textarea
              placeholder="Jam description (optional)"
              size="md"
              onChange={handleDescriptionChange}
              borderRadius="none"
              backgroundColor="white"
            />

            <Heading size="md" pt="4">
              Statements
            </Heading>
            <VStack spacing={4} align="start" w="100%">
              <UnorderedList size="sm" color="gray.600">
                <ListItem>
                  Statements should be easy for everyone to understand
                </ListItem>
                <ListItem>
                  Keep them clear and under 140 characters
                </ListItem>
                <ListItem>
                  Each one should be unique and raise a different
                  point
                </ListItem>
              </UnorderedList>
              {allStatements.map((statement, index) => (
                <ProposedStatementCard
                  key={index}
                  index={index}
                  onDelete={handleDeleteProposedStatement}
                  onSave={handleEditExistingStatement}
                >
                  {statement}
                </ProposedStatementCard>
              ))}
            </VStack>
            <Box
              w="100%"
              border="1px"
              borderColor="gray.200"
              bg="white"
              p={4}
              borderRadius="md"
              mb={4}
            >
              <Textarea
                placeholder="Add a new statement"
                size="md"
                value={currentStatement}
                onChange={handleStatementChange}
                mb={2}
                borderRadius="none"
                maxLength={MAX_STATEMENT_LENGTH}
                ref={newStatementElRef}
              />

              <Stack justify="flex-end" direction="row" spacing={2}>
                <Button
                  onClick={() => handleSave()}
                  colorScheme="blue"
                >
                  Save
                </Button>
              </Stack>
            </Box>
          </VStack>

          <Stack
            justify="flex-end"
            direction="row"
            spacing={2}
            mt={6}
          >
            <Button
              onClick={cancelModalOnOpen}
              variant="outline"
              colorScheme="blue"
            >
              Cancel
            </Button>
            <Button onClick={() => createJam()} colorScheme="blue">
              Publish
            </Button>
          </Stack>
        </GridItem>
      </AdminLayout>

      <ModalCreateJam
        successModalIsOpen={successModalIsOpen}
        successModalOnClose={successModalOnClose}
        jamUrlPath={jamUrlPath}
      />

      <ModalDiscardJam
        cancelModalIsOpen={cancelModalIsOpen}
        cancelModalOnClose={cancelModalOnClose}
      />
    </>
  );
}

CreateJam.auth = true;
export default CreateJam;
