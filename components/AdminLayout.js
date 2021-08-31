import { Link, Container, Text } from '@chakra-ui/react';
import Layout from './Layout';
import AdminHeader from './AdminHeader';
import { ArrowBackIcon } from '@chakra-ui/icons';

export default function AdminLayout({ children }) {
  return (
    <>
      <AdminHeader />
      <Container maxW="100%" p="6">
        <Link href="/moderator" passHref>
          <Text color="gray.700">
            <ArrowBackIcon /> Back to overview
          </Text>
        </Link>
        <Layout py={6}>{children}</Layout>
      </Container>
    </>
  );
}
