import {
  Container,
  Heading,
  HStack,
  Button,
  GridItem,
  Spinner,
  Text,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import moment from 'moment';
import { useState, useEffect } from 'react';
import OverviewJamCard from '@/components/OverviewJamCard';
import AdminHeader from 'components/AdminHeader';
import Layout from 'components/Layout';

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

    return hours > 48
      ? Math.floor(hours / 24) + ' days'
      : hours + ':' + minutes;
  };

  return (
    <>
      <AdminHeader />
      <Container maxW="100%" h="100vh" p="6" bgColor="#F5F5F5">
        <Wrap spacing="10px">
          <WrapItem>
            <Heading
              as="h2"
              size="lg"
              fontWeight={400}
              ml="20px"
              mb="20px"
            >
              Jams overview
            </Heading>
          </WrapItem>
          <WrapItem>
            <Button ml="20px" mb="20px">
              Create a new Jam
            </Button>
          </WrapItem>
        </Wrap>
        <HStack spacing="5">
          <Layout>
            {jams ? (
              jams.map((jam, i) => {
                return (
                  <GridItem key={i} colSpan={{ sm: 1, md: 2 }}>
                    <OverviewJamCard
                      jamUrl={jam.urlPath}
                      isOpen={jam.isOpen}
                      jamName={jam.name}
                      openFor={timeSince(jam.createdAt._seconds)}
                      createdAt={convertDate(jam.createdAt._seconds)}
                    />
                  </GridItem>
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
          </Layout>
        </HStack>
      </Container>
    </>
  );
}

export default Moderator;
