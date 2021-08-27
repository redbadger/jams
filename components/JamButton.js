import { merge } from 'lodash';

import { Button } from '@chakra-ui/react';

export default function JamButton({ vote, ...props }) {
  return <Button {...props}>{vote}</Button>;
}
