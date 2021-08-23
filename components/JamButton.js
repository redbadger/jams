import { merge } from 'lodash';

export default function JamButton({ vote, ids, onComplete }) {
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

  return <button onClick={() => sendRequest(vote)}>{vote}</button>;
}
