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
      // 'user' is only available the very first time the user logs in
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.token = user.token; // This is the backend JWT
      }
      return token;
    },
    async session({ session, token }) {
      // Pass the properties from the JWT token to the session object
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.token = token.token as string; // This makes it available to your fetch call
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
};
