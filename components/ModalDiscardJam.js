import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
  Link,
} from '@chakra-ui/react';

function ModalDiscard({ cancelModalIsOpen, cancelModalOnClose }) {
  return (
    <Modal isOpen={cancelModalIsOpen} onClose={cancelModalOnClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          Are you sure you want to discard this Jam?
        </ModalHeader>
        <ModalBody>You will lose all unpublished work.</ModalBody>
        <ModalFooter>
          <Button mr={3} onClick={cancelModalOnClose}>
            Cancel
          </Button>
          <Link href="/moderator">
            <Button colorScheme="blue">Discard</Button>
          </Link>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default ModalDiscard;
