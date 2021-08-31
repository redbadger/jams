import {
  Box,
  Heading,
  Text,
  Stack,
  Tag,
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
      p="20px"
      m="5px"
      overflow={'hidden'}
      border="1px"
      borderColor="#8D8D8D"
    >
      <Stack>
        <Link href={`moderator/${jamUrl}`}>
          <Heading fontSize="lg" mb={2}>
            {jamName}
          </Heading>
        </Link>
      </Stack>
      <Tag
        color={isOpen ? '#00681D' : '#535353'}
        border="1px"
        borderColor={isOpen ? '#00681D' : '#8D8D8D'}
        rounded="16px"
        size="sm"
        bg={isOpen ? '#EEFFF3' : '#F5F5F5'}
      >
        {isOpen ? 'Open' : 'Closed'}
      </Tag>
      <Stack mt={2} direction={'row'} spacing={4} align={'center'}>
        <Stack direction={'column'} spacing={0} fontSize={'sm'}>
          <Text color="#535353" fontSize="12px">
            Open for {openFor}
          </Text>
          <Text color="#535353" fontSize="12px">
            Created: {createdAt}
          </Text>
        </Stack>
      </Stack>
    </Box>
  );
};

export default overviewCard;
