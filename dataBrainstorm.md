
Jams collection
  -- id: String
  -- admin_id: String
  -- name: String
  -- description: String
  -- list of statements: Subcollection

   Statements (sub)collection
    -- state???: number (approved: 1/ unseen(default): 0/ rejected: -1)
    -- isUserSubmitted: boolean
    -- text: String
    -- num_agree: number
    -- num_disagree: number

Participant collection
  -- id: String (cookie?)
  -- hash: String
  -- votes: Subcollection

  Votes (sub)collection
  -- jam_id
  -- statement_id
  -- vote: number (agree: 1/ pass: 0/ disagree: -1???)

(Add a participant, set a cookie)
Get next statement for participant_id, jam_id
loop {
  Record vote
  Get next statement for participant_id, jam_id
}

? How to get next statement:
1. Get all the statement for jam_id where state = 1
2. Get all the statements answered by participant_id + jam_id
3. Get the 1s that are not in 2
4. Return random entry from array

? How to get all answers for a jam:
Get all votes for jam_id from Votes subcollection
Group (SUM) by statement_id


