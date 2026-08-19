import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { db, users } from "db"


export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async signIn({ user, profile }) {
      if (!profile?.sub) return false;
      
      // Upsert user to the database safely
      try {
        const { eq } = await import("drizzle-orm");
        const existing = await db.query.users.findFirst({
          where: (users, { eq, or }) => or(
            eq(users.googleSub, profile.sub!),
            eq(users.email, user.email!)
          )
        });

        if (existing) {
          await db.update(users).set({
            name: user.name!,
            avatarUrl: user.image,
            googleSub: profile.sub,
          }).where(eq(users.id, existing.id));
        } else {
          await db.insert(users).values({
            id: profile.sub,
            googleSub: profile.sub,
            email: user.email!,
            name: user.name!,
            avatarUrl: user.image,
          });
        }
        return true;
      } catch (e) {
        console.error("Error saving user", e);
        return false;
      }
    },
    async jwt({ token, profile }) {
      if (profile?.sub) {
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
