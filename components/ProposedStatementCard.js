import {
  Stack,
  HStack,
  VStack,
  Text,
  Button,
  Flex,
  Textarea,
} from '@chakra-ui/react';
import { Fragment } from 'react';
import { useState } from 'react';

const EditableStatement = ({ children, index, onSave, onCancel }) => {
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
        <Button onClick={() => onCancel()}>Cancel</Button>
        <Button
          onClick={() => {
            onSave(index, statement);
            onCancel();
          }}
        >
          Save
        </Button>
      </Flex>
    </>
  );
};

// Add visible only component.
const VisibleOnlyStatement = ({
  children,
  index,
  onDelete,
  onEdit,
}) => {
  return (
    <>
      <VStack>
        <Text>{children}</Text>
      </VStack>
      <Flex justifyContent="flex-end">
        <Button onClick={() => onClick(index)}>Delete</Button>
        <Button onClick={() => onEdit()}>Edit</Button>
      </Flex>
    </>
  );
};

function ProposedStatementCard(props) {
  const [isEditable, setIsEditable] = useState(false);

  const handleEdit = () => {
    setIsEditable((isEditable) => !isEditable);
    console.log('changing editable');
  };

  // show component based on whether editing or viewing only.
  if (isEditable) {
    return (
      <EditableStatement
        index={props.index}
        onSave={props.onSave}
        onCancel={handleEdit}
      >
        {props.children}
      </EditableStatement>
    );
  } else {
    return (
      <VisibleOnlyStatement
        index={props.index}
        onDelete={props.onDelete}
        onEdit={handleEdit}
      >
        {props.children}
      </VisibleOnlyStatement>
    );
  }
}

export default ProposedStatementCard;
