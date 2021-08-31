import { Box, Button, Stack, Textarea } from '@chakra-ui/react';
import ComponentSwitcher from './ComponentSwitcher';
import { useState } from 'react';

const ModeratorAddStatementCard = ({
  jamId,
  postRequest,
  invertComponent,
}) => {
  const [newStatement, setNewStatement] = useState();

  const handleStatementChange = (e) => {
    let statementValue = e.target.value;
    setNewStatement(statementValue);
  };

  return (
    <Box
      border="1px"
      p={5}
      borderRadius="md"
      borderColor="gray.200"
      my={4}
      backgroundColor="white"
    >
      <Textarea
        onChange={handleStatementChange}
        borderRadius="none"
        mb={4}
      ></Textarea>
      <Stack justify="flex-end" direction="row" spacing={2}>
        <Button onClick={() => invertComponent()} variant="outline">
          Cancel
        </Button>
        <Button
          onClick={() => {
            postRequest({
              statement: newStatement,
              jamId: jamId,
            });
            invertComponent();
          }}
          colorScheme="blue"
        >
          Submit
        </Button>
      </Stack>
    </Box>
  );
};
const AddNewStatementButton = ({ invertComponent }) => {
  return (
    <Button colorScheme="blue" onClick={() => invertComponent()}>
      Add new statement
    </Button>
  );
};

export default function ModeratorAddNewStatement({
  jamId,
  postRequest,
}) {
  return (
    <ComponentSwitcher
      primaryComponent={<AddNewStatementButton />}
      secondaryComponent={
        <ModeratorAddStatementCard
          jamId={jamId}
          postRequest={postRequest}
        />
      }
    />
  );
}
