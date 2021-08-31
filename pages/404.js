import { GridItem, Text, Box, Heading, Link } from '@chakra-ui/react';
import Layout from 'components/Layout';

export default function FourOhFour() {
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
            <strong>Error 404: This page can’t be found.</strong>
          </Text>
        </GridItem>
        <GridItem mt="6" colStart="2" colSpan="4">
          <Text fontSize="sm">
            The page your looking for may have been moved or deleted.
            Please contact your administrator for more information.
            <br />
            <br />
            Use your browser to navigate to the previous page.
          </Text>
        </GridItem>
      </Layout>
    </>
  );
}
