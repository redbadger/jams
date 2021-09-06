import {
  Badge,
  Box,
  Heading,
  Spacer,
  Text,
  Flex,
  Stack,
  Link,
} from '@chakra-ui/react';

const overviewCard = ({
  isOpen,
  jamName,
  createdAt,
  openFor,
  jamUrl,
}) => {
  return (
    <Box
      bg="white"
      rounded={'md'}
      p={5}
      overflow={'hidden'}
      border="1px"
      borderColor="gray.200"
    >
      <Flex direction="column" align="flex-start" minH="120px">
        <Link href={`moderator/${jamUrl}`}>
          <Heading as="h4" fontSize="lg" mb={2}>
            {jamName}
          </Heading>
        </Link>
        {isOpen ? (
          <Badge p="1" colorScheme="green" variant="outline">
            Open
          </Badge>
        ) : (
          <Badge p="1" colorScheme="gray" variant="outline">
            Closed
          </Badge>
        )}
        <Spacer />
        <Stack direction={'column'} spacing={0} fontSize={'sm'}>
          <Text color="#535353" fontSize="12px">
            Open for {openFor}
          </Text>
          <Text color="#535353" fontSize="12px">
            Created: {createdAt}
          </Text>
        </Stack>
      </Flex>
    </Box>
  );
};

export default overviewCard;
