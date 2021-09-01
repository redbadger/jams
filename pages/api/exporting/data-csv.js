import fire from '../../../config/firebaseAdminConfig';
import { convertDate, timeSince } from '../../../utils/date';

const ObjectsToCsv = require('objects-to-csv');
const db = fire.firestore();
const jamsRef = db.collection('jams');

function getAllStatements(jamId) {
  return jamsRef
    .doc(jamId)
    .collection('statements')
    .get()
    .then((querySnapshot) => {
      var allStatements = [];

      querySnapshot.forEach((doc) => {
        const statement = doc.data();
        statement.key = doc.id;
        allStatements.push(statement);
      });
      return allStatements;
    });
}

function formatAllStatements(allStatements) {
  console.log('formateAllStatements function:');
  console.log(allStatements);
}

export default async function handler(req, res) {
  const {
    query: { jamId },
  } = req;

  // if (method !== 'GET') {
  //   res.setHeader('Allow', ['GET']);
  //   res.status(405).end(`Method ${method} Not Allowed`);
  //   return;
  // }

  if (!jamId) {
    res.status(404).end();
    return;
  }

  const allStatements = await getAllStatements(jamId);
  formatAllStatements(allStatements);

  const csv = await new ObjectsToCsv(allStatements);
  // console.log(allStatements);

  // Save to file:
  // await csv.toDisk('./test.csv');

  // Return the CSV file as string:
  // console.log(csv);
  console.log(`csv length: ${csv.data.length}`);
  console.log(await csv.toString());

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader(
    'Content-Disposition',
    'attachment; filename=JamsCSV.text',
  );
  res.status(200);
  res.send(await csv.toString());
}
