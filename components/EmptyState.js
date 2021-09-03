import { Text } from '@chakra-ui/react';

const EmptyState = ({ children }) => (
  <Text
    fontSize="2xl"
    color="gray.300"
    textAlign="center"
    my="4"
    fontWeight={500}
  >
    {children}
  </Text>
);

export default EmptyState;
