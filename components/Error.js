import { GridItem, Text, Box, Heading, Link } from '@chakra-ui/react';
import Layout from 'components/Layout';
import JamHeader from 'components/ParticipantJamHeader';

export default function Error({ errorMessage, errorAction }) {
  return (
    <>
      <JamHeader />
      <Layout mt={40}>
        <GridItem colStart="2" colSpan="4">
          <Text fontSize="lg">
            <strong>{errorMessage}</strong>
          </Text>
        </GridItem>
        <GridItem mt="6" colStart="2" colSpan="4">
          <Text fontSize="sm">{errorAction}</Text>
        </GridItem>
      </Layout>
    </>
  );
}
