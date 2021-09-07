import { Text, Button, Textarea, Stack, Box } from '@chakra-ui/react';
import { useState, useRef, useEffect } from 'react';
import ComponentSwitcher from './ComponentSwitcher';
import { MAX_STATEMENT_LENGTH } from './constants';

const EditableStatement = ({
  children,
  index,
  onSave,
  invertComponent,
}) => {
  const [statement, setStatement] = useState(children);
  const textAreaRef = useRef(null);

  const handleStatementChange = (e) => {
    let statementValue = e.target.value;
    setStatement(statementValue);
  };

  useEffect(() => {
    textAreaRef.current.focus();
  }, [textAreaRef]);

  return (
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
        size="md"
        defaultValue={children}
        onChange={handleStatementChange}
        mb={2}
        borderRadius="none"
        maxlength={MAX_STATEMENT_LENGTH}
        ref={textAreaRef}
      />
      <Stack justify="flex-end" direction="row" spacing={2}>
        <Button
          onClick={() => invertComponent()}
          variant="outline"
          colorScheme="blue"
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
            onSave(index, statement);
            invertComponent();
          }}
          colorScheme="blue"
        >
          Save
        </Button>
      </Stack>
    </Box>
  );
};

const VisibleOnlyStatement = ({
  children,
  index,
  onDelete,
  invertComponent,
}) => {
  return (
    <Box
      w="100%"
      border="1px"
      borderColor="gray.200"
      p={4}
      borderRadius="md"
      bg="white"
    >
      <Text pb={2}>{children}</Text>

      <Stack justify="flex-end" direction="row" spacing={2}>
        <Button
          onClick={() => onDelete(index)}
          variant="outline"
          colorScheme="blue"
        >
          Delete
        </Button>
        <Button
          onClick={() => invertComponent()}
          variant="outline"
          colorScheme="blue"
        >
          Edit
        </Button>
      </Stack>
    </Box>
  );
};

function ProposedStatementCard(props) {
  return (
    <ComponentSwitcher
      primaryComponent={
        <VisibleOnlyStatement
          index={props.index}
          onDelete={props.onDelete}
        >
          {props.children}
        </VisibleOnlyStatement>
      }
      secondaryComponent={
        <EditableStatement index={props.index} onSave={props.onSave}>
          {props.children}
        </EditableStatement>
      }
    />
  );
}

export default ProposedStatementCard;
