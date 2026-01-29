import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";


export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          // Make the external API call
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/backend/signin`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(credentials),
            },
          );

          if (!res.ok) {
            console.log(
              "API call failed. Response status is not OK (200-299).",
            );
            return null;
          }

          const data = await res.json();
          if (data.user?.id) {
            console.log(
              "API call was successful and user data is present. Returning user object.",
            );
            return {
              id: data.user.id,
              name: data.user.name,
              email: data.user.email,
              role: data.user.role,
              token: data.token,
            };
          } else {
            console.log(
              "Authentication failed. User data was missing from the response. Returning null.",
            );
            return null;
          }
        } catch (error) {
          console.error(
            "An error occurred during the fetch to the external API:",
            error,
          );
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.accessToken = user.token; // store the token in JWT
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.token = token.accessToken;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
};
