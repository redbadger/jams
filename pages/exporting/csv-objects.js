import { useState } from 'react';
import { Container, Heading, Button } from '@chakra-ui/react';

function CSVObject() {
  const [exportData, setExportData] = useState();

  const handleCsv = () => {
    console.log('Calling the api function...');

    return fetch('/api/exporting/data-csv')
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw new Error('404');
        }
      })
      .then((json) => {
        setExportData(json);
        console.log(json);
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
