import { merge } from 'lodash';

import { Button } from '@chakra-ui/react';

export default function JamButton({
  vote,
  ids,
  onComplete,
  ...props
}) {
  const sendRequest = (vote) => {
    fetch('/api/vote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(merge({ vote: vote }, ids)),
    })
      .then(() => onComplete())
      .catch((error) => console.error('Error saving vote: ', error));
  };

  return (
    <Button onClick={() => sendRequest(vote)} {...props}>
      {vote}
    </Button>
  );
}
