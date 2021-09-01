import fire from '../../../config/firebaseAdminConfig';

const ObjectsToCsv = require('objects-to-csv');
const db = fire.firestore();
const jamsRef = db.collection('jams');

// Sample data - two columns, three rows:
const data = [
  { code: 'CA', name: 'California' },
  { code: 'TX', name: 'Texas' },
  { code: 'NY', name: 'New York' },
];

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
      // console.log(allStatements[0]);
      return allStatements;
    });
}

// If you use "await", code must be inside an asynchronous function:
export default async function handler(req, res) {
  const {
    query: { jamId },
  } = req;

  const allStatements = await getAllStatements(jamId);
  const csv = await new ObjectsToCsv(allStatements);
  console.log(allStatements);

  // Save to file:
  // await csv.toDisk('./test.csv');

  // Return the CSV file as string:
  console.log(csv);
  console.log(`csv length: ${csv.data.length}`);
  console.log(await csv.toString());

  res.setHeader('Content-Type', 'application/json');
  // res.setHeader('Content-Disposition', 'jamscsv.html');
  res.status(200);
  res.json(csv);
}
