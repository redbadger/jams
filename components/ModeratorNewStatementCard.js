import {
  Box,
  Button,
  Flex,
  Spacer,
  Stack,
  Text,
  Textarea,
} from '@chakra-ui/react';
import { ChatIcon } from '@chakra-ui/icons';
import { useState } from 'react';

const ModeratorEditStatementCard = ({
  statement,
  jamId,
  patchRequest,
  invertEditable,
}) => {
  const [editedStatement, setEditedStatement] = useState(
    statement.text,
  );

  const handleStatementChange = (e) => {
    let statementValue = e.target.value;
    setEditedStatement(statementValue);
  };

  return (
    <Box
      border="1px"
      p={5}
      borderRadius="md"
      borderColor="gray.200"
      my={4}
      backgroundColor="white"
    >
      <Textarea
        defaultValue={statement.text}
        onChange={handleStatementChange}
        borderRadius="none"
        mb={4}
      ></Textarea>
      <Stack justify="flex-end" direction="row" spacing={2}>
        <Button onClick={() => invertEditable()} variant="outline">
          Cancel
        </Button>
        <Button
          onClick={() => {
            patchRequest({
              text: editedStatement,
              jamId: jamId,
              statementId: statement.key,
            });
            invertEditable();
          }}
          colorScheme="blue"
        >
          Save
        </Button>
      </Stack>
    </Box>
  );
};

const ModeratorDecisionStatementCard = ({
  statement,
  jamId,
  patchRequest,
  invertEditable,
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
          <Text color="gray.600">
            <ChatIcon></ChatIcon> Participant submitted{' '}
            {new Date(
              statement.createdAt?._seconds * 1000,
            ).toUTCString()}
          </Text>
        </Box>

        <Spacer />

        <Stack direction="row" spacing={2}>
          <Button onClick={() => invertEditable()} variant="outline">
            Edit
          </Button>
          <Button
            onClick={() =>
              patchRequest({
                state: -1,
                jamId: jamId,
                statementId: statement.key,
              })
            }
            colorScheme="blue"
          >
            Reject
          </Button>
          <Button
            onClick={() =>
              patchRequest({
                state: 1,
                jamId: jamId,
                statementId: statement.key,
              })
            }
            colorScheme="blue"
          >
            Approve
          </Button>
        </Stack>
      </Flex>
    </Box>
  );
};

const ModeratorNewStatementCard = ({
  statement,
  jamId,
  patchRequest,
}) => {
  const [isEditable, setIsEditable] = useState(false);

  const invertEditable = () => {
    setIsEditable((isEditable) => !isEditable);
  };

  if (isEditable) {
    return (
      <ModeratorEditStatementCard
        statement={statement}
        jamId={jamId}
        patchRequest={patchRequest}
        invertEditable={invertEditable}
      />
    );
  } else {
    return (
      <ModeratorDecisionStatementCard
        statement={statement}
        jamId={jamId}
        patchRequest={patchRequest}
        invertEditable={invertEditable}
      />
    );
  }
};

export default ModeratorNewStatementCard;
