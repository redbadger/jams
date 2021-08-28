import { Text, Button, Textarea, Stack, Box } from '@chakra-ui/react';
import { useState } from 'react';
import ComponentSwitcher from './ComponentSwitcher';

const EditableStatement = ({
  children,
  index,
  onSave,
  invertComponent,
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
        <Button onClick={() => invertComponent()} variant="outline">
          Cancel
        </Button>
        <Button
          onClick={() => {
            onSave(index, statement);
            invertComponent();
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
  invertComponent,
}) => {
  return (
    <Box w="100%" border="1px" p={3} borderRadius="md" mb={3}>
      <Text>{children}</Text>

      <Stack justify="flex-end" direction="row" spacing={2}>
        <Button onClick={() => onDelete(index)} variant="outline">
          Delete
        </Button>
        <Button onClick={() => invertComponent()} variant="outline">
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
