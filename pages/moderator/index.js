import {
  Text,
  Container,
  Heading,
  HStack,
  Button,
} from '@chakra-ui/react';
import { useState } from 'react';

function Moderator() {
  const [jams, setJams] = useState();

  // Call the API for a list of Jams
  const loadJams = () => {
    fetch(`/api/jam?jamUrlPath=${encodeURIComponent(jamUrlPath)}`)
      .then((response) => response.json())
      .then((data) => setJams(data))
      .then((error) => {
        console.log('Error loading the jams', error);
      });
  };

  return (
    <Container>
      <Heading>Jams Overview</Heading>
    </Container>
  );
}

export default Moderator;
