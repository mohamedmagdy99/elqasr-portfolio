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
                    const res = await fetch("https://api.elqasr-development.com/api/auth/backend/signin", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(credentials),
                    });

                    if (!res.ok) {
                        console.log("API call failed. Response status is not OK (200-299).");
                        return null;
                    }

                    const data = await res.json();

                    // Log the full JSON response to inspect its structure
                    console.log("Full API Response Data:", data);

                    // Check both conditions before returning the user
                    if (data.user?.id) {
                        console.log("API call was successful and user data is present. Returning user object.");
                        return {
                            id: data.user.id,
                            name: data.user.name,
                            email: data.user.email,
                            role: data.user.role,
                            token: data.token,
                        };
                    } else {
                        console.log("Authentication failed. User data was missing from the response. Returning null.");
                        return null;
                    }

                } catch (error) {
                    console.error("An error occurred during the fetch to the external API:", error);
                    return null;
                }
            },
        }),
    ],
    session: { strategy: "jwt" },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role;
                token.token = user.token; // store the token in JWT
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            session.user.id = token.id as string;
            session.user.role = token.role as string;
            session.user.token = token.token as string; // now session has token
            return session;
        },
    }
};
