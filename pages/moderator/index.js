import {
  Container,
  Heading,
  HStack,
  Button,
  Wrap,
  WrapItem,
  Spinner,
  Text,
} from '@chakra-ui/react';
import moment from 'moment';
import { useState, useEffect } from 'react';
import OverviewJamCard from '@/components/OverviewJamCard';
import AdminHeader from 'components/AdminHeader';

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
        setJams(jam);
      });
  };

  const convertDate = (date) => {
    return moment(date * 1000).format('DD MMM hh:mm');
  };

  const timeSince = (date) => {
    const openedAt = moment(new Date(date * 1000));
    const now = moment();

    const hours = now.diff(openedAt, 'hours');
    const minutes = now.diff(openedAt, 'minutes') - hours * 60;

    return hours + ':' + minutes;
  };

  return (
    <>
      <AdminHeader />

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
                console.log(jam);
                return (
                  <WrapItem key={i}>
                    <OverviewJamCard
                      jamUrl={jam.urlPath}
                      isOpen={jam.isOpen}
                      jamName={jam.name}
                      openFor={timeSince(jam.createdAt._seconds)}
                      createdAt={convertDate(jam.createdAt._seconds)}
                    />
                  </WrapItem>
                );
              })
            ) : (
              <Container p="10px">
                <Spinner
                  thickness="4px"
                  speed="0.65s"
                  emptyColor="gray.200"
                  color="blue.500"
                  size="xl"
                />
                <Text fontSize="18px">Loading jams...</Text>
              </Container>
            )}
          </Wrap>
        </HStack>
      </Container>
    </>
  );
}

export default Moderator;
