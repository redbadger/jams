import { GridItem, Text, Box, Heading, Link } from '@chakra-ui/react';
import Layout from 'components/Layout';
import JamHeader from 'components/ParticipantJamHeader';

export default function JamClosed() {
  return (
    <>
      <JamHeader />
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
