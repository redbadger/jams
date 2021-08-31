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
          <Heading as="h1" size="lg" letterSpacing={'tighter'}>
            Jams
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
                d={'inline-block'}
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
        <GridItem colSpan={6} py={20}>
          <Box as={'main'} align={'center'}>
            <Heading as="h1" size="4xl">
              Welcome to Jams!
            </Heading>
            {session && (
              <Box mt="4">
                <Link href="/moderator">
                  Click here for the Admin Dashboard
                </Link>
              </Box>
            )}
          </Box>
        </GridItem>
      </Layout>
      <HomeFooter />
    </Box>
  );
}
