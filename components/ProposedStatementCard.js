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

const EditableStatement = ({
  children,
  index,
  onClick,
  onCancel,
}) => {
  return (
    <>
      <VStack>
        <Textarea size="md" defaultValue={children} />
      </VStack>
      <Flex justifyContent="flex-end">
        <Button onClick={() => onCancel()}>Cancel</Button>
        <Button>Save</Button>
      </Flex>
    </>
  );
};

// Add visible only component.
const VisibleOnlyStatement = ({
  children,
  index,
  onClick,
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
    console.log('edit clicked');
  };

  // show component based on whether editing or viewing only.
  if (isEditable) {
    return (
      <EditableStatement
        index={props.index}
        onClick={props.onClick}
        onCancel={handleEdit}
      >
        {props.children}
      </EditableStatement>
    );
  } else {
    return (
      <VisibleOnlyStatement
        index={props.index}
        onClick={props.onClick}
        onEdit={handleEdit}
      >
        {props.children}
      </VisibleOnlyStatement>
    );
  }
}

export default ProposedStatementCard;
