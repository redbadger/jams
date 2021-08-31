const ObjectsToCsv = require('objects-to-csv');

// Sample data - two columns, three rows:
const data = [
  { code: 'CA', name: 'California' },
  { code: 'TX', name: 'Texas' },
  { code: 'NY', name: 'New York' },
];

// If you use "await", code must be inside an asynchronous function:
export default async function handler(req, res) {
  const csv = await new ObjectsToCsv(data);

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
