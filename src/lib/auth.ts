import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import UsersModel from "@/models/User";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await dbConnect();
        console.log("credentials :>> ", credentials);
        const user = await UsersModel.findOne({
          email: credentials?.email,
        }).select("+password");

        if (!user) throw new Error("Wrong Email");

        const passwordMatch = await bcrypt.compare(
          credentials!.password,

          user.password
        );

        if (!passwordMatch) throw new Error("Wrong Password");
        console.log("db user :>> ", user);
        return user;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      console.log("token jwttttt :>> ", token);
      if (user) token.id = user.id;
      // console.log('user :>> ', user);

      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      console.log("session :>> ", session);
      console.log("token :>> ", token);

      return session;
    },
  },
  // pages: {
  //   signIn: "/auth/signin",
  // },
});
