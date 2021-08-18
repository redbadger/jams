# Data structure

## Jams collection
 - id: String
 - adminId: String
 - name: String
 - description: String
 - createdAt: Timestamp

### List of statements subcollection
 - state???: number (approved: 1/ unseen(default): 0/ rejected: -1)
 - isUserSubmitted: boolean
 - text: String
 - numAgrees: number
 - numDisagrees: number

## Participant collection
 - id: String (cookie?)
 - hash: String
 - votes: Subcollection

### Votes (sub)collection
 - jamId: String
 - statementId: String
 - vote: number (agree: 1/ pass: 0/ disagree: -1???)


### Responding to statements loop

(Add a participant, set a cookie)
Get next statement for participantId, jamId
loop {
  Record vote
  Get next statement for participantId, jamId
}

### How to get next statement:

1. Get all the statement for jamId where state = 1
1. Get all the statements answered by participantId + jamId
1. Get the 1s that are not in 2
1. Return random entry from array

? How to get all answers for a jam:
Get all votes for jamId from Votes subcollection
Group (SUM) by statementId


