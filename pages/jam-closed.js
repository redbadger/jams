import { GridItem, Text, Box, Heading, Link } from '@chakra-ui/react';
import Layout from 'components/Layout';

export default function JamClosed() {
  return (
    <>
      <Heading as="h1" size="md" p={6} bg="white">
        <Box align="left">
          <Link href="/">JAMS</Link>
        </Box>
      </Heading>
      <Layout mt={40}>
        <GridItem colStart="2" colSpan="4">
          <Text fontSize="lg">
            <strong>This Jam is now closed.</strong>
          </Text>
        </GridItem>
        <GridItem mt="6" colStart="2" colSpan="4">
          <Text fontSize="sm">
            Thank you for your participation! Please contact your
            administrator for more information.
          </Text>
        </GridItem>
      </Layout>
    </>
  );
}
