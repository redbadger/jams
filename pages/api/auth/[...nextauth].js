import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';

export default NextAuth({
  providers: [
    Providers.Auth0({
      clientId: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
      domain: process.env.AUTH0_ISSUER_BASE_URL,
      authorizationUrl: `https://${
        process.env.AUTH0_ISSUER_BASE_URL
      }/authorize?${new URLSearchParams({
        response_type: 'code',
        audience: 'https://functions.jams.com',
      })}`,
    }),
  ],
  callbacks: {
    async jwt(token, user, account, profile, isNewUser) {
      // Add access_token to the token right after signin
      if (account?.accessToken) {
        token.accessToken = account.accessToken;
      }
      return token;
    },
  },
});
