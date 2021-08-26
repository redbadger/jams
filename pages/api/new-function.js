import ensureAdmin from 'utils/admin-auth-middleware.js';

export default async function handler(req, res) {
  try {
    const token = await ensureAdmin(req, res);

    res.status(200).json({
      ok: 'true',
      userId: token.sub,
    });
  } catch (e) {
    res.status(500).json({ error: e });
  }
}
