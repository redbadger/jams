import React from 'react';
import { signIn, signOut, useSession } from 'next-auth/client';
import {
  Box,
  Heading,
  Flex,
  Button,
  Link,
  Text,
} from '@chakra-ui/react';
import Logo from '@/components/Logo';

const AdminHeader = () => {
  const [session] = useSession();

  return (
    <Flex
      as="nav"
      justify="space-between"
      wrap="wrap"
      padding={4}
      bg="white"
      color="black"
    >
      <Flex align="center" mr={5}>
        <Link href="/moderator">
          <Logo />
        </Link>
      </Flex>

      <Box display={{ base: 'block' }}>
        {!session ? (
          <>
            <Button variant="outline" onClick={() => signIn()}>
              Sign in
            </Button>
          </>
        ) : (
          <>
            <Text
              d={{ md: 'inline-block', base: 'none' }}
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
    </Flex>
  );
};

export default AdminHeader;
