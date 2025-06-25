import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "admin" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Hardcoded admin user
        const adminUser = {
          id: "1",
          username: "admin",
          password: "your-password-here", // Change this to a strong password!
        };
        if (
          credentials.username === adminUser.username &&
          credentials.password === adminUser.password
        ) {
          return { id: adminUser.id, name: adminUser.username };
        }
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
});

export { handler as GET, handler as POST }; 
