import Cookies from 'cookies';
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';

const client = jwksClient({
  jwksUri: 'https://rb-jams-dev.eu.auth0.com/.well-known/jwks.json',
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, function (err, key) {
    var signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

function ensureAdmin(req, res) {
  return new Promise((resolve, reject) => {
    let cookies = new Cookies(req, res);
    let token = cookies.get('next-auth.session-token');

    if (!token) return reject({ message: 'No session found' });

    let decodedToken = jwt.decode(token);

    let accessToken = decodedToken.accessToken;

    jwt.verify(
      accessToken,
      getKey,
      {
        audience: 'https://functions.jams.com',
      },
      function (err, decoded) {
        if (err) {
          reject(err);
        }
        resolve(decoded);
      },
    );
  });
}

export default async function handler(req, res) {
  try {
    const token = await ensureAdmin(req, res);

    console.log(token);

    res.status(200).json({
      ok: 'true',
      userId: token.sub,
    });
  } catch (e) {
    res.status(500).json({ error: e });
  }
}
