import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { db, users } from "db"
import { eq } from "drizzle-orm"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async signIn({ user, profile }) {
      if (!profile?.sub) return false;
      
      // Upsert user to the database
      try {
        await db.insert(users).values({
          id: profile.sub,
          googleSub: profile.sub,
          email: user.email!,
          name: user.name!,
          avatarUrl: user.image,
        }).onConflictDoUpdate({
          target: users.googleSub,
          set: {
            name: user.name!,
            avatarUrl: user.image,
          }
        });
        return true;
      } catch (e) {
        console.error("Error saving user", e);
        return false;
      }
    },
    async jwt({ token, profile }) {
      if (profile) {
        token.sub = profile.sub;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub;
      }
      return session;
    }
  },
  secret: process.env.AUTH_SECRET,
})
