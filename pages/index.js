import Head from 'next/head';
import { Center, Heading } from '@chakra-ui/react';
import styles from '../styles/Home.module.css';
import { signIn, signOut, useSession } from 'next-auth/client';

export default function Home() {
  const [session, _loading] = useSession();
  return (
    <Center h="100vh">
      <div>
        <Head>
          <title>Welcome to JAMS</title>
        </Head>

        <main>
          <Heading as="h1" size="4xl">
            Welcome to JAM
          </Heading>
        </main>

        {!session && (
          <>
            Not signed in <br />
            <button onClick={() => signIn()}>Sign in</button>
          </>
        )}
        {session && (
          <>
            <h2>Signed in as {session.user.email}</h2> <br />
            <button onClick={() => signOut()}>Sign out</button>
          </>
        )}
        <main className={styles.main}>
          <h1 className={styles.title}>Welcome to JAM</h1>
          <a href="/dashboard">Click here for the Admin Dashboard</a>
        </main>

        <footer>
          <a>Powered by Red Badger</a>
        </footer>
      </div>
    </Center>
  );
}
