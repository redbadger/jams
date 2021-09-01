import {
  Link as ChakraLink,
  Container,
  Text,
} from '@chakra-ui/react';
import Layout from './Layout';
import AdminHeader from './AdminHeader';
import { ArrowBackIcon } from '@chakra-ui/icons';
import Link from 'next/link';

export default function AdminLayout({ children }) {
  return (
    <>
      <AdminHeader />
      <Container maxW="100%" p="6">
        <Link href="/moderator" passHref>
          <ChakraLink color="gray.700">
            <ArrowBackIcon /> Back to overview
          </ChakraLink>
        </Link>
        <Layout py={6}>{children}</Layout>
      </Container>
    </>
  );
}
