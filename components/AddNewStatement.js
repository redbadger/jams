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

export default function AddNewStatement() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button width="200px" variant="outline" onClick={onOpen}>
        Add New Statement
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Submit statements for voting</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            - Statements should be easy for everyone to understand
            without further explanation.
            <br />
            - Keep them clear and under 140 characters long.
            <br />- Each one should be unique and raise a different
            point.
            <Textarea
              mt={5}
              placeholder="Please enter your statement here"
            />
          </ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue">Submit</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
