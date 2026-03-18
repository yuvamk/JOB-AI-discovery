import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import LinkedInProvider from "next-auth/providers/linkedin";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID || "",
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      id: "email-password",
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user || !user.passwordHash) return null;

        const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!isValid) return null;

        return { 
          id: user.id, 
          email: user.email, 
          name: user.name,
          role: user.role,
          tenantId: user.tenantId,
          profileComplete: user.profileComplete
        };
      },
    }),
    CredentialsProvider({
      id: "phone-otp",
      name: "Phone OTP",
      credentials: {
        phone: { label: "Phone", type: "text" },
        otp: { label: "OTP", type: "text" },
      },
      async authorize(credentials) {
        // Placeholder for Twilio OTP verification (otp: 123456)
        if (credentials?.phone && credentials?.otp === "123456") {
          let user = await prisma.user.findFirst({
            where: { phone: credentials.phone }
          });
          
          if (!user) {
            const defaultTenant = await prisma.tenant.findFirst() || await prisma.tenant.create({
              data: { name: "Default", slug: "default" }
            });
            
            user = await prisma.user.create({
              data: {
                phone: credentials.phone,
                email: `${credentials.phone}@otp.local`,
                role: "JOB_SEEKER",
                tenantId: defaultTenant.id,
                profileComplete: false
              }
            });
          }
          return { 
            id: user.id, 
            email: user.email, 
            name: user.name,
            role: user.role,
            tenantId: user.tenantId,
            profileComplete: user.profileComplete
          };
        }
        return null;
      },
    }),
    CredentialsProvider({
      id: "email-otp",
      name: "Email OTP",
      credentials: {
        email: { label: "Email", type: "text" },
        otp: { label: "OTP", type: "text" },
      },
      async authorize(credentials) {
        if (credentials?.email && credentials?.otp === "123456") {
          let user = await prisma.user.findUnique({
            where: { email: credentials.email }
          });
          
          if (!user) {
            const defaultTenant = await prisma.tenant.findFirst() || await prisma.tenant.create({
              data: { name: "Default", slug: "default" }
            });
            
            user = await prisma.user.create({
              data: {
                email: credentials.email,
                name: credentials.email.split('@')[0],
                role: "JOB_SEEKER",
                tenantId: defaultTenant.id,
                profileComplete: false
              }
            });
          }
          return { 
            id: user.id, 
            email: user.email, 
            name: user.name,
            role: user.role,
            tenantId: user.tenantId,
            profileComplete: user.profileComplete
          };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update" && session?.profileComplete !== undefined) {
        token.profileComplete = session.profileComplete;
      }
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.tenantId = (user as any).tenantId;
        token.profileComplete = (user as any).profileComplete;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).tenantId = token.tenantId;
        (session.user as any).profileComplete = token.profileComplete;
      }
      return session;
    },
  },
  pages: {
    signIn: "/?login=true",
  },
  session: {
    strategy: "jwt",
  },
};
