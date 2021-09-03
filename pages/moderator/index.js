import {
  Button,
  Text,
  Container,
  GridItem,
  Heading,
  HStack,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import OverviewJamCard from '@/components/OverviewJamCard';
import AdminHeader from '@/components/AdminHeader';
import Layout from '@/components/Layout';
import LoadingState from '@/components/LoadingState';
import router from 'next/router';
import { convertDate, timeSince } from '../../utils/date';
import EmptyState from '@/components/EmptyState';

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
      <Container maxW="100%" p="6">
        <HStack spacing="5" mb="8">
          <Heading as="h2" size="lg">
            Jams overview
          </Heading>
          <Button
            colorScheme="blue"
            onClick={() => router.push('/moderator/create-jam')}
          >
            Create a new Jam
          </Button>
        </HStack>
        <HStack spacing="5">
          <Layout>
            {!jams && (
              <GridItem colSpan="6">
                <LoadingState>Loading jams...</LoadingState>
              </GridItem>
            )}
            {jams && !jams.length ? (
              <GridItem colSpan="6">
                <EmptyState>
                  No jams found. Create one using the button above!
                </EmptyState>
              </GridItem>
            ) : (
              ''
            )}
            {jams && jams.length
              ? jams.map((jam, i) => {
                  return (
                    <GridItem key={i} colSpan={{ sm: 1, md: 2 }}>
                      <OverviewJamCard
                        jamUrl={jam.urlPath}
                        isOpen={jam.isOpen}
                        jamName={jam.name}
                        openFor={timeSince(jam.createdAt._seconds)}
                        createdAt={convertDate(
                          jam.createdAt._seconds,
                        )}
                      />
                    </GridItem>
                  );
                })
              : ''}
          </Layout>
        </HStack>
      </Container>
    </>
  );
}

Moderator.auth = true;
export default Moderator;
