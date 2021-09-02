import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
  Link as ChakraLink,
  Box,
} from '@chakra-ui/react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

function ModalCreateJam({
  successModalIsOpen,
  successModalOnClose,
  jamUrlPath,
}) {
  const [location, setLocation] = useState();

  useEffect(() => {
    setLocation(window.location.origin);
  }, []);

  return (
    <Modal isOpen={successModalIsOpen} onClose={successModalOnClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Your Jam is now live!</ModalHeader>
        <ModalBody>
          Everyone with the below link will now be able to participate
          in your Jam. You can toggle your Jam to closed at any time.
          <Box mt={5}>
            <ChakraLink href={`${location}/jams/${jamUrlPath}`}>
              {`${location}/jams/${jamUrlPath}`}
            </ChakraLink>
          </Box>
        </ModalBody>
        <ModalFooter>
          <Link href="/moderator" passHref>
            <Button mr={3}>Back to overview</Button>
          </Link>
          <Link href={`/jams/${jamUrlPath}`} passHref>
            <Button colorScheme="blue">View Jam</Button>
          </Link>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default ModalCreateJam;
