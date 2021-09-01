import { useState } from 'react';
import { Container, Heading, Button } from '@chakra-ui/react';

function CSVObject() {
  const [exportData, setExportData] = useState();
  const jamId = '8vXobX0QDTo7cliXVtx5';

  const handleCsv = () => {
    console.log(`Calling the api with this jamId: ${jamId}`);
    window.location = `/api/exporting/data-csv?jamId=${jamId}`;
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
