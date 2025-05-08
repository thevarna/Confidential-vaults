import NextAuth, { NextAuthOptions } from 'next-auth';
import TwitterProvider from 'next-auth/providers/twitter';
import { JWT } from 'next-auth/jwt';

const authOptions: NextAuthOptions = {
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID!,
      clientSecret: process.env.TWITTER_CLIENT_SECRET!,
      version: '2.0', 
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, account }: { token: JWT; account?: any }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.id = account.id_token;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: JWT }) {
      if (token) {
        session.user.accessToken = token.accessToken;
        session.user.refreshToken = token.refreshToken;
        session.user.id = token.id;
      }
      return session;
    },
  },
  debug: true,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
