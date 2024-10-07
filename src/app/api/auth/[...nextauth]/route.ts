import NextAuth from "next-auth";
import AzureADProvider from "next-auth/providers/azure-ad";

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const { AZURE_AD_CLIENT_ID, AZURE_AD_CLIENT_SECRET, AZURE_AD_TENANT_ID } =
  process.env;

if (!AZURE_AD_CLIENT_ID || !AZURE_AD_CLIENT_SECRET || !AZURE_AD_TENANT_ID) {
  throw new Error("The Azure AD environment variables are not set.");
}

const handler = NextAuth({
  
  secret: AZURE_AD_CLIENT_SECRET,
  providers: [
    AzureADProvider({
      clientId: AZURE_AD_CLIENT_ID,
      clientSecret: AZURE_AD_CLIENT_SECRET,
      tenantId: AZURE_AD_TENANT_ID,
    }),
  ],
  pages:{
    signIn: "/dashboard",
    signOut: "/login"
  },
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token = Object.assign({}, token, {
          access_token: account.access_token,
        });
        //console.log(account);
      }
      return token;
    },
    async session({ session, token }) {
      if (session) {
        session = Object.assign({}, session, {
          access_token: token.access_token,
        });
        console.log(session);
      }

      if(session.user?.email){
        const existingUser = await prisma.user.findUnique({
          where: { email: session.user.email },
        })

        if (!existingUser) {
          // ถ้าไม่มีผู้ใช้ในฐานข้อมูล ให้สร้างผู้ใช้ใหม่
          await prisma.user.create({
            data: {
              email: session.user.email,
              name: session.user.name,
              rank: "...",
              position: "...",
              employee_id: "T...",
              department: "....",
            },
          });
        }
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };