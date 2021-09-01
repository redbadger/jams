import { useState } from 'react';
import { Container, Heading, Button } from '@chakra-ui/react';

function CSVObject() {
  const [exportData, setExportData] = useState();
  const jamId = '8vXobX0QDTo7cliXVtx5';

  const handleCsv = () => {
    console.log(`Calling the api with this jamId: ${jamId}`);

    return fetch(`/api/exporting/data-csv?jamId=${jamId}`)
      .then((response) => {
        if (response.status === 200) {
          console.log(response.headers);
          return response.text();
          // return response.json();
        } else {
          throw new Error('404');
        }
      })
      .then((responseData) => {
        setExportData(responseData);
        console.log(responseData);
      })
      .catch((error) =>
        console.error('Error getting data from csv: ', error),
      );
  };

  return (
    <Container>
      <Heading mt="25px">CSV Objects</Heading>
      <Button mt="150px" onClick={() => handleCsv()}>
        Export Data
      </Button>
    </Container>
  );
}

export default CSVObject;
