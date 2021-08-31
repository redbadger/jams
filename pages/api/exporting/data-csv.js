import fire from '../../../config/firebaseAdminConfig';

const ObjectsToCsv = require('objects-to-csv');

// Sample data - two columns, three rows:
const data = [
  { code: 'CA', name: 'California' },
  { code: 'TX', name: 'Texas' },
  { code: 'NY', name: 'New York' },
];

async function getAllStatements() {
  const jamId = '6y4qC5HoThwkMKJiBrLn';
  console.log(`jamId: ${jamId}`);

  const db = fire.firestore();
  const jamsRef = db.collection('jams');

  await jamsRef
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
      res.json(allStatements[0]);
      // console.log(allStatements[0]);
      // return allStatements[0];
    });
}

// If you use "await", code must be inside an asynchronous function:
export default async function handler(req, res) {
  const csv = await new ObjectsToCsv(data);

  const jamStatements = await getAllStatements();
  console.log(jamStatements);

  // Save to file:
  // await csv.toDisk('./test.csv');

  // Return the CSV file as string:
  console.log(csv);
  console.log(`csv length: ${csv.data.length}`);
  console.log(await csv.toString());

  res.setHeader('Content-Type', 'application/json');
  res.status(200);
  res.json(csv);
}
