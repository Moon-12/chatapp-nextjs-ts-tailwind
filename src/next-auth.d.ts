import "next-auth";

declare module "next-auth" {
  interface User {
    accessToken: string;
    refreshToken: string;
  }

  interface Session {
    accessToken: string;
    refreshToken: string;
    error?: string;
    user: {
      email: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string;
    refreshToken: string;
    accessTokenExpires?: number;
    error?: string;
  }
}

export interface DecodedJWT {
  exp: number; // expiry timestamp in seconds
  iat: number; // issued at
  sub: string; // optional subject
}
