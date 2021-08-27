import { Container, SimpleGrid } from '@chakra-ui/react';

export default function Layout({ children, ...props }) {
  return (
    <Container maxW={'container.lg'} {...props}>
      <SimpleGrid columns={6} spacing={10} spacingY={0}>
        {children}
      </SimpleGrid>
    </Container>
  );
}
