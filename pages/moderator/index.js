import {
  Button,
  Center,
  Container,
  GridItem,
  Heading,
  HStack,
  Spinner,
  Text,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import OverviewJamCard from '@/components/OverviewJamCard';
import AdminHeader from 'components/AdminHeader';
import Layout from 'components/Layout';
import { convertDate, timeSince } from '../../utils/date';

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

  return (
    <>
      <AdminHeader />
      <Container maxW="100%" h="100vh" p="6" bgColor="#F5F5F5">
        <Wrap spacing="10px">
          <WrapItem>
            <Heading size="lg" m="25px" fontWeight="400">
              Jams overview
            </Heading>
          </WrapItem>
          <WrapItem>
            <Button m="20px">Create a new Jam</Button>
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
              <GridItem colSpan="4">
                <Center mt="30vh">
                  <Spinner
                    thickness="4px"
                    speed="0.65s"
                    emptyColor="gray.200"
                    color="blue.500"
                    size="xl"
                  />
                  <Text ml="10" fontSize="18px">
                    Loading jams...
                  </Text>
                </Center>
              </GridItem>
            )}
          </Layout>
        </HStack>
      </Container>
    </>
  );
}

export default Moderator;
