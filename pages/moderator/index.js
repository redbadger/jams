import {
  Container,
  Heading,
  HStack,
  Button,
  Wrap,
  WrapItem,
  Spinner,
  Center,
  Text,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import OverviewJamCard from '@/components/OverviewJamCard';
import Header from 'components/Header';

function Moderator() {
  const [jams, setJams] = useState();

  useEffect(() => {
    loadJams();
  }, []);

  // Call the API for a list of Jams
  const loadJams = async () => {
    await fetch('/api/jamming')
      .then((response) => response.json())
      .then((jam) => {
        console.log(jam);
        setJams(jam);
      });
  };

  const convertDate = (date) => {
    return new Date(date * 1000).toLocaleString('en-GB', {
      timeZone: 'UTC',
    });
  };

  const timeSince = (date) => {
    return 'not sure';
  };

  return (
    <>
      <Header />
      <Container maxW="100%" h="100vh" p="6" bgColor="#F5F5F5">
        <Heading
          ml="6px"
          mb="38px"
          mt="32px"
          fontSize="24px"
          fontWeight="500"
        >
          Jams overview
          <Button
            borderRadius="md"
            marginLeft="30px"
            bg="#595959"
            color="white"
            fontSize="14px"
            fontWeight="500"
            _hover={{ bg: '#454343' }}
          >
            Create a new Jam
          </Button>
        </Heading>
        <HStack spacing="5">
          <Wrap>
            {jams ? (
              jams.map((jam, i) => {
                return (
                  <WrapItem key={i}>
                    <OverviewJamCard
                      isOpen={jam.isOpen}
                      jamName={jam.name}
                      openFor={timeSince(jam.createdAt._seconds)}
                      createdAt={convertDate(jam.createdAt._seconds)}
                    />
                  </WrapItem>
                );
              })
            ) : (
              <Container p="30px">
                <Spinner
                  thickness="4px"
                  speed="0.65s"
                  emptyColor="gray.200"
                  color="blue.500"
                  size="xl"
                />
                <Text m="20px" fontSize="18px">
                  Loading jams...
                </Text>
              </Container>
            )}
          </Wrap>
        </HStack>
      </Container>
    </>
  );
}

export default Moderator;
