import { Text, Center, Spinner } from '@chakra-ui/react';

export default function LoadingState({ children }) {
  return (
    <Center mt="10vh">
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="blue.500"
        size="xl"
      />
      <Text m="10" fontSize="20px">
        {children}
      </Text>
    </Center>
  );
}
