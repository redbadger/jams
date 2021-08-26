import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Link,
} from '@chakra-ui/react';

function ModalCreateJam({
  successModalIsOpen,
  successModalOnClose,
  jamUrlPath,
}) {
  return (
    <Modal isOpen={successModalIsOpen} onClose={successModalOnClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Your Jam is now live!</ModalHeader>
        <ModalBody>
          Everyone with the below link will now be able to participate
          in your Jam. You can toggle your Jam to closed at any time.
        </ModalBody>
        <ModalFooter>
          <Link href="/moderator">
            <Button mr={3}>Back to overview</Button>
          </Link>
          <Link href={`/jams/${jamUrlPath}`}>
            <Button colorScheme="blue">View Jam</Button>
          </Link>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default ModalCreateJam;
