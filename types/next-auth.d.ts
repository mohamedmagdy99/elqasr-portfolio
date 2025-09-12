import NextAuth from 'next-auth';

declare module 'next-auth' {
    interface Session {
        user: {
            name?: string;
            email?: string;
            role?: string; // ✅ Add your custom field
        };
    }

    interface User {
        role?: string; // ✅ Add role to User
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        role?: string; // ✅ Add role to JWT token
    }
}