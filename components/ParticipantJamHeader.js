import {
  Heading,
  Text,
  GridItem,
  HStack,
  Box,
} from '@chakra-ui/react';
import Layout from '@/components/Layout';
import Logo from '@/components/Logo';

function JamHeader({ title, description, participantId }) {
  return (
    <Box as="header" bg={'white'} p={4}>
      <HStack>
        <Box w={'50%'}>
          <Logo />
        </Box>
        {participantId && (
          <Box
            w={'50%'}
            align={'right'}
            color={'gray.400'}
            fontSize={'sm'}
          >
            Participant ID: {participantId}
          </Box>
        )}
      </HStack>
      {(title || description) && (
        <Layout>
          <GridItem colSpan={6} py={8}>
            {title && (
              <Heading as="h2" size="lg">
                {title}
              </Heading>
            )}
            {description && (
              <Text color={'gray.600'} mt={4}>
                {description}
              </Text>
            )}
          </GridItem>
        </Layout>
      )}
    </Box>
  );
}

export default JamHeader;
