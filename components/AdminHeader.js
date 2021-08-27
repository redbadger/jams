import React from 'react';
import { signOut } from 'next-auth/client';
import { Box, Heading, Flex, Button, Link } from '@chakra-ui/react';

const AdminHeader = () => {
  return (
    <Flex
      as="nav"
      justify="space-between"
      wrap="wrap"
      padding="23px"
      bg="white"
      color="black"
    >
      <Flex align="center" mr={5}>
        <Heading as="h1" size="lg" letterSpacing={'tighter'}>
          <Link href="/">JAMS</Link>
        </Heading>
      </Flex>

      <Box display={{ base: 'block' }}>
        <Button
          border="1px"
          bg="white"
          borderColor=" #535353"
          rounded={'md'}
          size="md"
          fontSize="14px"
          fontWeight="500"
          _hover={{ bg: '#f4f2f2' }}
          onClick={() => signOut()}
        >
          Sign out
        </Button>
      </Box>
    </Flex>
  );
};

export default AdminHeader;
