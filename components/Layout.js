import { Container, SimpleGrid } from '@chakra-ui/react';

export default function Layout({ children, ...props }) {
  return (
    <Container maxW={'container.lg'} {...props}>
      <SimpleGrid columns={{ sm: 1, md: 6 }} spacing={6} spacingY={0}>
        {children}
      </SimpleGrid>
    </Container>
  );
}
