import Head from 'next/head';
import {
  Box,
  Heading,
  Button,
  GridItem,
  HStack,
  Text,
} from '@chakra-ui/react';
import { signIn, signOut, useSession } from 'next-auth/client';
import Link from 'next/link';
import Layout from '../components/Layout';

function HomeHeader({ session }) {
  return (
    <Box as="header" p={4} bg={'white'}>
      <HStack>
        <Box w={'50%'}>
          <Heading
            as="h1"
            size="lg"
            letterSpacing={'tighter'}
            fontWeight={600}
          >
            Jam
          </Heading>
        </Box>
        <Box w={'50%'} align={'right'}>
          {!session ? (
            <>
              <Button variant="outline" onClick={() => signIn()}>
                Sign in
              </Button>
            </>
          ) : (
            <>
              <Text
                d={{ md: 'inline-block', base: 'none' }}
                color={'gray.400'}
                px={2}
                fontSize={'sm'}
              >
                {session.user.email}
              </Text>
              <Button variant="outline" onClick={() => signOut()}>
                Sign out
              </Button>
            </>
          )}
        </Box>
      </HStack>
    </Box>
  );
}

function HomeFooter() {
  return <></>;
}

export default function Home() {
  const [session, _loading] = useSession();

  return (
    <Box>
      <Head>
        <title>Jams</title>
      </Head>
      <HomeHeader session={session} />
      <Layout>
        <GridItem colSpan={4} colStart={2} py={20}>
          <Box as={'main'} align={'center'}>
            <Heading as="h1" size="4xl">
              Welcome to Jam!
            </Heading>
            <Box m={14}>
              {session && (
                <Link href="/moderator">Admin dashboard</Link>
              )}
              {!session && (
                <Text color="gray.600">
                  Please sign in to get started.
                </Text>
              )}
            </Box>
          </Box>
          <Heading as="h4" fontSize="lg" mb={1}>
            What is a jam?
          </Heading>
          <Text color="gray.600">
            Jam is a collaborative surveying tool that’s used to
            gather how certain statements are received within a large
            group of people who are invited to take part. Each user
            responding to the lightweight survey (called a Jam) will
            be shown these statements, one by one, being able to vote
            in agreement, disagreement or abstaining, passing on to
            the next one. Users can themselves suggest new sentences
            to be included in that Jam for others to agree/disagree
            on, provided they get approved by the administrator.
          </Text>
        </GridItem>
      </Layout>
      <HomeFooter />
    </Box>
  );
}
