import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { refreshAccessToken } from "./app/api/auth/refresh-token/route";
import { signOut } from "next-auth/react";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required");
        }

        try {
          const response = await fetch(`${process.env.API_URL}/auth/sign-in`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || "Authentication failed");
          }

          if (!data.accessToken || !data.refreshToken) {
            throw new Error("Token data is missing");
          }

          return {
            id: data.id,
            email: data.email,
            role: data.role || "customer",
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
          };
        } catch (error) {
          console.error("Authorization error:", error);
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({
      token,
      user,
      account,
    }: {
      token: any;
      user: any;
      account: any;
    }) {
      try {
        if (account?.provider === "google") {
          if (!account.id_token) {
            throw new Error("Google provider account ID is missing");
          }

          const response = await fetch(
            `${process.env.API_URL}/auth/google-authentication`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                token: account.id_token,
              }),
            }
          );

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || "Google authentication failed");
          }

          token.accessToken = data.accessToken;
          token.refreshToken = data.refreshToken;
          token.userId = data.id;
          token.role = data.role || "customer";
        } else {
          if (user) {
            token.accessToken = user.accessToken;
            token.refreshToken = user.refreshToken;
            token.userId = user.id;
            token.role = user.role || "customer";
          }
        }

        token.accessTokenExpires = Date.now() + 3600 * 1000;

        const now = Date.now();
        if (!token.accessTokenExpires || now < token.accessTokenExpires) {
          return token;
        }

        return await refreshAccessToken(token);
      } catch (error) {
        console.error("JWT callback error:", error);
        return { ...token, error: "TokenError" };
      }
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token.error === "RefreshTokenError") {
        await signOut({ callbackUrl: "/auth/signin" });
        return { ...session, error: "RefreshTokenError" };
      }

      session.accessToken = token.accessToken;
      session.userId = token.userId;
      session.role = token.role;

      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
} as NextAuthOptions;
