import { merge } from 'lodash';

import { Button } from '@chakra-ui/react';

export default function JamButton({
  vote,
  votingOn,
  voteClickHandler,
  ...props
}) {
  return (
    <Button
      isLoading={votingOn === vote}
      disabled={!!votingOn}
      onClick={voteClickHandler(vote)}
      {...props}
    >
      {vote}
    </Button>
  );
}
