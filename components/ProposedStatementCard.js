import {
  Stack,
  HStack,
  VStack,
  Text,
  Button,
  Flex,
} from '@chakra-ui/react';
import { Fragment } from 'react';

function ProposedStatementCard({ children, index, onClick }) {
  return (
    <>
      <VStack>
        <Text>{children}</Text>
      </VStack>
      <Flex justifyContent="flex-end">
        <Button onClick={() => onClick(index)}>Delete</Button>
        <Button>Edit</Button>
      </Flex>
    </>
  );
}

export default ProposedStatementCard;
