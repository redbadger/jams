import {
  Text,
  Container,
  Heading,
  HStack,
  VStack,
  Button,
  Box,
  Stack,
  GridItem,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';

function Moderator() {
  const [jams, setJams] = useState();
  // const jamUrlPath = 'qwerty';

  useEffect(() => {
    // if (jams == null) {
    //   return;
    // }
    loadJams();
    // loadingJam();
  }, [jams]);

  // Call the API for a list of Jams
  const loadJams = () => {
    fetch('/api/jamming')
      .then((response) => {
        console.log(response);
        response.json();
      })
      .then((data) => {
        console.log(data);
        setJams(data);
      });
  };

  // const loadingJam = () => {
  //   fetch(`/api/jam?jamUrlPath=${encodeURIComponent(jamUrlPath)}`)
  //     .then((response) => response.json())
  //     .then((json) => {
  //       console.log(json);
  //     });
  // };
  const dummyData = [
    {
      title: 'Humanity in the Machine',
      buttonState: 'Open',
      dateStamp: 'Open for 23.37',
      created: 'Thur, 12 Aug, 11.04 am',
    },
    {
      title: 'Creating a culture of digital transformation',
      buttonState: 'Open',
      dateStamp: 'Open for 23.37',
      created: 'Thur, 12 Aug, 11.04 am',
    },
    {
      title: 'The Human Cloud at Work',
      buttonState: 'Closed',
      dateStamp: 'Open for 16.23',
      created: 'Thur, 11 Aug, 09.21 am',
    },
    {
      title: 'Project Virtual Assistant Mind Share',
      buttonState: 'Closed',
      dateStamp: 'Open for 16.29',
      created: 'Thur, 11 Aug, 09.21 am',
    },
    {
      title: 'The Human Cloud at Work',
      buttonState: 'Open',
      dateStamp: 'Open for 23.37',
      created: 'Thur, 12 Aug, 11.04 am',
    },
    {
      title: 'Humanity in the Machine',
      buttonState: 'Open',
      dateStamp: 'Open for 23.37',
      created: 'Thur, 12 Aug, 11.04 am',
    },
  ];

  const ModeratorCard = (props) => {
    const index = { props };
    return (
      <Box maxW="sm" borderWidth="1px" borderRadius="lg">
        <Box p="3">
          <Text fontSize="3xl">{dummyData[index].title}</Text>
        </Box>
        <Box p="3">
          <Button>{dummyData[index].buttonState}</Button>
        </Box>
        <Box p="3">{dummyData[index].dateStamp}</Box>
        <Box p="3">{dummyData[index].created}</Box>
      </Box>
    );
  };

  const list = ['homer', 'marge', 'bart', 'lisa', 'maggie'];

  return (
    <Container>
      <Heading>
        Jams Overview <Button>Create a new Jam</Button>
      </Heading>
      <HStack spacing="10">
        {list.map((item, index) => (
          <Text key={index}>{item}</Text>
        ))}
      </HStack>
    </Container>
  );
}

export default Moderator;
