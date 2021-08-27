import { Text, Button, Textarea, Stack, Box } from '@chakra-ui/react';
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
    <Box w="100%" border="1px" p={3} borderRadius="md" mb={3}>
      <Textarea
        size="md"
        defaultValue={children}
        onChange={handleStatementChange}
        mb={2}
        borderRadius="none"
      />
      <Stack justify="flex-end" direction="row" spacing={2}>
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
      </Stack>
    </Box>
  );
};

const VisibleOnlyStatement = ({
  children,
  index,
  onDelete,
  invertEditable,
}) => {
  return (
    <Box w="100%" border="1px" p={3} borderRadius="md" mb={3}>
      <Text>{children}</Text>

      <Stack justify="flex-end" direction="row" spacing={2}>
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
