import { Button } from '@chakra-ui/react';
import { useDisclosure } from '@chakra-ui/hooks';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import { Textarea } from '@chakra-ui/textarea';
import { useState } from 'react';

export default function AddNewStatement({ jamId }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [statement, setStatement] = useState();
  const [submitted, setSubmitted] = useState(false);

  const sendRequest = () => {
    fetch('/api/statement', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ statement: statement, jamId: jamId }),
    })
      .then(() => {
        setSubmitted(true);
      })
      .catch((error) =>
        console.error('Error saving statement: ', error),
      );
  };

  let handleInputChange = (e) => {
    let inputValue = e.target.value;
    setStatement(inputValue);
  };

  return (
    <>
      <Button
        width="200px"
        variant="outline"
        onClick={onOpen}
        bg={'white'}
      >
        Add New Statement
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          {!submitted ? (
            <>
              <ModalHeader>Submit statements for voting</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                - Statements should be easy for everyone to understand
                without further explanation.
                <br />
                - Keep them clear and under 140 characters long.
                <br />- Each one should be unique and raise a
                different point.
                <Textarea
                  mt={5}
                  placeholder="Please enter your statement here"
                  value={statement}
                  onChange={handleInputChange}
                />
              </ModalBody>
              <ModalFooter>
                <Button mr={3} onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  colorScheme="blue"
                  onClick={() => sendRequest()}
                >
                  Submit
                </Button>
              </ModalFooter>
            </>
          ) : (
            <>
              <ModalHeader>
                Thank you for submitting a statement
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                One of our moderators will review your submission.
              </ModalBody>
              <ModalFooter>
                <Button
                  colorScheme="blue"
                  mr={3}
                  onClick={() => {
                    setStatement('');
                    setSubmitted(false);
                  }}
                >
                  Submit another
                </Button>
                <Button colorScheme="blue" onClick={onClose}>
                  Back to survey
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
