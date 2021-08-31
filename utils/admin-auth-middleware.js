import Cookies from 'cookies';
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';

const client = jwksClient({
  jwksUri: 'https://rb-jams-dev.eu.auth0.com/.well-known/jwks.json',
});

const cookieSuffix = 'next-auth.session-token';
const cookieName =
  process.env.NODE_ENV === 'production'
    ? `__Secure-${cookieSuffix}`
    : cookieSuffix;

function getKey(header, callback) {
  client.getSigningKey(header.kid, function (err, key) {
    var signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

export default function ensureAdmin(req, res) {
  return new Promise((resolve, reject) => {
    const cookies = new Cookies(req, res);
    const token = cookies.get(cookieName);

    if (!token) return reject({ message: 'No session found' });

    const decodedToken = jwt.decode(token);

    const accessToken = decodedToken.accessToken;

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
