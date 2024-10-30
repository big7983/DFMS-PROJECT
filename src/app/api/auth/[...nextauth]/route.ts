import NextAuth from "next-auth";
import AzureADProvider from "next-auth/providers/azure-ad";
import CredentialsProvider from 'next-auth/providers/credentials'

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const { AZURE_AD_CLIENT_ID, AZURE_AD_CLIENT_SECRET, AZURE_AD_TENANT_ID } =
  process.env;

if (!AZURE_AD_CLIENT_ID || !AZURE_AD_CLIENT_SECRET || !AZURE_AD_TENANT_ID) {
  throw new Error("The Azure AD environment variables are not set.");
}

const handler = NextAuth({
  secret: process.env.NEXTAUTH_SECRET, 
  providers: [
    AzureADProvider({
      name: 'AzureAD',
      clientId: AZURE_AD_CLIENT_ID,
      clientSecret: AZURE_AD_CLIENT_SECRET,
      tenantId: AZURE_AD_TENANT_ID,
    },
    
  ),   
  CredentialsProvider({
    name: 'Credentials',
    credentials: {
      email: { label: 'Email', type: 'email', placeholder: 'john@doe.com' },
      password: { label: 'Password', type: 'password' },
    },
    async authorize(credentials) {
      if (!credentials) return null
      const user = await prisma.user.findUnique({
        where: { email: credentials.email },
      })

      if (
        user && user.id === credentials.password
      ) {
        return {
          id: user.id,
          name: user.name,
          email: user.email
        }
      } else {
        throw new Error('Invalid email or password')
      }
    },
  })
    
  ],
  pages: {
    signIn: '/login',
    signOut: '/',
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, account, user }) {
      if (account?.provider === 'azure-ad') {
        // จัดการ token ของ Azure AD
        token.access_token = account.access_token;
      } else if (user) {
        // สำหรับ CredentialsProvider, ให้กำหนด user ID ถ้าผ่านการตรวจสอบ
        token.userid = user.id;
      }
      return token;
    },
    async session({ session }) {
      if (session.user?.email) {
        const existingUser = await prisma.user.findUnique({
          where: { email: session.user.email },
        });

        if (!existingUser) {
          // ถ้าไม่มีผู้ใช้ในฐานข้อมูล ให้สร้างผู้ใช้ใหม่
          await prisma.user.create({
            data: {
              email: session.user.email,
              name: session.user.name || " ",
              level: "...",
              position: "...",
              employee_id: "T...",
              section: "...",
              department: "....",
              role: "enduser",
              history: [],
            },
          });
        }else{
          session.user.id = existingUser.id
        }
      }
      return session;
    },
    
    
  },
});

export { handler as GET, handler as POST };
