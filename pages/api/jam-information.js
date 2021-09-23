import fire from '../../config/firebaseAdminConfig';

async function handler(req, res) {
  const jamId = 'hZLVrK2lhig19cbLuMBx';

  try {
    const db = fire.firestore();
    const jamsRef = db.collection('jams');
    const statementsRef = db
      .collection('jams')
      .doc(jamId)
      .collection('statements');

    const allStatements = await statementsRef.get().then((query) => {
      let statements = [];

      query.forEach((document) => {
        const getStatment = document.data();
        statements.push(getStatment);
      });
      return statements[0];
    });

    // .where('adminId', '==', 'auth0|614c41b3de45d300692bc589')
    const jam = await jamsRef.get().then((querySnapshot) => {
      let jar = [];
      querySnapshot.forEach((document) => {
        const jam = document.data();
        jam.id = document.id;
        jar.push(jam);
      });
      return jar[0];
    });

    return res
      .status(200)
      .json({ jam: jam, statement: allStatements });
  } catch {
    return res.status(500).json({ error: 'Well, that did not work' });
  }
}

export default handler;
