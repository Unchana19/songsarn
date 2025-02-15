import type { NextAuthOptions, Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { signOut } from "next-auth/react";
import { refreshAccessToken } from "./utils/refresh-token";
import type { JWT } from "next-auth/jwt";

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

          // Return user data along with tokens (only on first sign in)
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
      token: {
        accessToken?: string;
        refreshToken?: string;
        userId?: string;
        role?: string;
        accessTokenExpires?: number;
        error?: string;
      };
      user?: {
        accessToken: string;
        refreshToken: string;
        id: string;
        role?: string;
      };
      account?: { provider: string; id_token?: string } | null;
    }): Promise<JWT> {
      // First sign in: add tokens and set expiration time
      if (user) {
        // Handle Google provider
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
          // Handle credentials provider
          token.accessToken = user.accessToken;
          token.refreshToken = user.refreshToken;
          token.userId = user.id;
          token.role = user.role || "customer";
        }
        // Set expiration once on first sign in or after a refresh
        token.accessTokenExpires = Date.now() + 3600 * 1000;
        return token;
      }

      // Return previous token if the access token has not expired yet
      if (token.accessTokenExpires && Date.now() < token.accessTokenExpires) {
        return token;
      }

      // Access token has expired, try to refresh it
      if (token.refreshToken) {
        return await refreshAccessToken(token);
      }

      // If no refresh token is available, attach an error
      return { ...token, error: "RefreshTokenError" };
    },

    async session({
      session,
      token,
    }: {
      session: Session;
      token: {
        accessToken?: string;
        refreshToken?: string;
        userId?: string;
        role?: string;
        accessTokenExpires?: number;
        error?: string;
      };
    }) {
      // If token refresh failed, sign out the user
      if (token.error === "RefreshTokenError") {
        await signOut({ callbackUrl: "/login" });
        return { ...session, error: "RefreshTokenError" };
      }

      session.accessToken = token.accessToken;
      session.userId = token.userId;
      session.role = token.role as string;

      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
} as NextAuthOptions;
