import {
  VStack,
  Text,
  Button,
  Flex,
  Textarea,
  Stack,
  Box,
} from '@chakra-ui/react';
import { useState } from 'react';

const EditableStatement = ({
  children,
  index,
  onSave,
  invertEditable,
}) => {
  const [statement, setStatement] = useState(children);

  const handleStatementChange = (e) => {
    let statementValue = e.target.value;
    setStatement(statementValue);
  };

  return (
    <>
      <VStack>
        <Textarea
          size="md"
          defaultValue={children}
          onChange={handleStatementChange}
        />
      </VStack>
      <Flex justifyContent="flex-end">
        <Button onClick={() => invertEditable()} variant="outline">
          Cancel
        </Button>
        <Button
          onClick={() => {
            onSave(index, statement);
            invertEditable();
          }}
          variant="outline"
        >
          Save
        </Button>
      </Flex>
    </>
  );
};

const VisibleOnlyStatement = ({
  children,
  index,
  onDelete,
  invertEditable,
}) => {
  return (
    <Box w="100%">
      <Text>{children}</Text>

      <Stack justify="right" direction="row" spacing={2}>
        <Button onClick={() => onDelete(index)} variant="outline">
          Delete
        </Button>
        <Button onClick={() => invertEditable()} variant="outline">
          Edit
        </Button>
      </Stack>
    </Box>
  );
};

function ProposedStatementCard(props) {
  const [isEditable, setIsEditable] = useState(false);

  const invertEditable = () => {
    setIsEditable((isEditable) => !isEditable);
  };

  if (isEditable) {
    return (
      <EditableStatement
        index={props.index}
        onSave={props.onSave}
        invertEditable={invertEditable}
      >
        {props.children}
      </EditableStatement>
    );
  } else {
    return (
      <VisibleOnlyStatement
        index={props.index}
        onDelete={props.onDelete}
        invertEditable={invertEditable}
      >
        {props.children}
      </VisibleOnlyStatement>
    );
  }
}

export default ProposedStatementCard;
