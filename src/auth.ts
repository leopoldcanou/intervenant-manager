import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error("NEXTAUTH_SECRET must be set");
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Email et mot de passe requis");
          }

          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email as string,
            },
          });

          if (!user) {
            throw new Error("Utilisateur non trouvé");
          }

          const isValidPassword = await bcrypt.compare(
            credentials.password as string,
            user.password as string
          );

          if (!isValidPassword) {
            throw new Error("Mot de passe incorrect");
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
          };
        } catch (error) {
          console.error("Erreur d'authentification:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  trustHost: true, // Ajout de trustHost pour contourner l'erreur d'hôte non fiable
});
