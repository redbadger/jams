import Head from 'next/head';
import { Center, Heading } from '@chakra-ui/react';

export default function Home() {
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

        <footer>
          <a>Powered by Red Badger</a>
        </footer>
      </div>
    </Center>
  );
}
