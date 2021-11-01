import ensureAdmin from 'utils/admin-auth-middleware.js';
import fire from '../../config/firebaseAdminConfig';

async function handler(req, res) {
  const jamId = 'AdaCMpU5JPYuSs8k9Yl3';

  const { method } = req;
  if (method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${method} Not Allowed`);
    return;
  }

  try {
    const token = await ensureAdmin(req, res);
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
        console.log(getStatment);
        statements.push(getStatment);
      });
      return statements;
    });

    const jam = await jamsRef
      .where('adminId', '==', token.sub)
      .get()
      .then((querySnapshot) => {
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
    return res.status(500).json({ error: error });
  }
}

export default handler;
