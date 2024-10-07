import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    role: string;
    accessToken: string;
    refreshToken: string;
  }

  interface Session {
    accessToken?: string;
    userId?: string;
    role: string;
    error?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    userId?: string;
    error?: string;
  }
}
