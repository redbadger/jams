import {
  Heading,
  VStack,
  HStack,
  Container,
  Input,
  Text,
  Textarea,
  Button,
  Spacer,
  Flex,
  Divider,
  Box,
} from '@chakra-ui/react';

function Moderator() {
  return (
    <Container>
      <VStack align="start" spacing={5}>
        <Heading>Create a new Jam</Heading>

        <Text fontSize="xl">Title</Text>
        <Text fontSize="xs" color="gray.500">
          The title cannot be edited after the Jam is published
        </Text>
        <Input placeholder="title" size="md" />

        <Text fontSize="xl">Description</Text>
        <Text fontSize="xs" color="gray.500">
          The description cannot be edited after the Jam is published
        </Text>
        <Textarea placeholder="description" size="md" />

        <Text fontSize="xl">Statements</Text>

        <VStack spacing={1} align="start">
          <Text fontSize="xs" color="gray.500">
            <span>&bull;</span>Staments should be easy for everyone to
            understand
          </Text>

          <Text fontSize="xs" color="gray.500">
            <span>&bull;</span>Keep them clear and under 140
            characters
          </Text>
          <Text fontSize="xs" color="gray.500">
            <span>&bull;</span>Each one should be unique and raise a
            different point
          </Text>
        </VStack>
        <Textarea placeholder="statements" size="md" />
      </VStack>

      <Flex>
        <Box p="3" />
      </Flex>

      <Flex justifyContent="flex-end">
        <Button>Delete</Button>
        <Box p="1"></Box>
        <Button>Edit</Button>
      </Flex>
      <Flex>
        <Box p="6" />
      </Flex>

      <Flex justifyContent="flex-end">
        <Button>Cancel</Button>
        <Box p="1"></Box>
        <Button>Publish</Button>
      </Flex>
    </Container>
  );
}

export default Moderator;
