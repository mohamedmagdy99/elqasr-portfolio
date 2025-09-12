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
                const res = await fetch("http://localhost:3000/api/auth/backend/signin", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(credentials),
                });

                const data = await res.json();
                console.log("Backend response:", data);
                if (res.ok && data.user?.id) {
                    return {
                        id: data.user.id,
                        name: data.user.name,
                        email: data.user.email,
                        role: data.user.role,
                    };
                }
                return null;
            },
        }),
    ],
    session: { strategy: "jwt" },
    callbacks: {
        async jwt({ token, user }) {
            if (user) token.role = user.role;
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.role = token.role;
            }
            return session;
        },
    },
};
