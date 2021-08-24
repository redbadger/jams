import Head from 'next/head';
import { Center, Heading, Button } from '@chakra-ui/react';
import { signIn, signOut, useSession } from 'next-auth/client';
import Link from 'next/link';

export default function Home() {
  const [session, _loading] = useSession();
  return (
    <Center h="100vh">
      <div>
        <Head>
          <title>Welcome to JAMS</title>
        </Head>

        {!session && (
          <>
            Not signed in <br />
            <Button onClick={() => signIn()}>Sign in</Button>
          </>
        )}
        {session && (
          <>
            <h2>Signed in as {session.user.email}</h2> <br />
            <Button onClick={() => signOut()}>Sign out</Button>
          </>
        )}
        <main>
          <Heading as="h1" size="4xl">
            Welcome to JAM
          </Heading>
          <Link href="/dashboard">
            Click here for the Admin Dashboard
          </Link>
        </main>

        <footer>
          <a>Powered by Red Badger</a>
        </footer>
      </div>
    </Center>
  );
}
