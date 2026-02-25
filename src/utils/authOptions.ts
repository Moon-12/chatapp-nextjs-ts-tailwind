import CredentialsProvider from "next-auth/providers/credentials";
import { AuthOptions } from "next-auth";
import { jwtDecode } from "jwt-decode";
import { JWT } from "next-auth/jwt";
import { DecodedJWT } from "@/next-auth";

export const authOptions: AuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: Number(process.env.NEXTAUTH_TOKEN_MAXAGE), //2 hr , user automatically logs out after 1 hr
    updateAge: Number(process.env.NEXTAUTH_TOKEN_UPDATEAGE), //30 mins
  },

  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/chat-app", // important for your basePath
        secure: process.env.NODE_ENV === "production",
      },
    },
  },

  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        // console.log("**********");
        console.log("inside authorize callback");
        // console.log("auth url", process.env.NEXTAUTH_URL);
        // console.log("sso api url", process.env.SSO_API_URL);
        // console.log("**********" + "\n");

        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        const response = await fetch(`${process.env.SSO_API_URL}/login`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
            appKey: process.env.APP_KEY,
          }),
        });

        const result = await response.json();
        if (!response.ok) {
          // throw a custom error with the backend message
          throw new Error(result.message || "Login failed");
        }
        // result = { accessToken, refreshToken }

        return {
          id: credentials.email, // fake but stable ID
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, session, user }) {
      console.log("**********");
      console.log("inside jwt callback");
      // console.log({ token, session, user });
      // console.log("**********" + "\n");
      if (user) {
        // console.log("**********");
        // console.log("user present", user);
        // console.log("**********" + "\n");
        const decoded: DecodedJWT = jwtDecode(user.accessToken);
        // console.log("Decoded", decoded);
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.email = user.id;
        token.accessTokenExpires = decoded.exp * 1000;
      }

      //only use this if you want to trigger update
      // if (trigger === "update" && session?.accessToken) {
      //   token.accessToken = session.accessToken;
      // }

      // if (trigger === "update" && session?.refreshToken) {
      //   token.refreshToken = session.refreshToken;
      // }

      if (token.accessTokenExpires && Date.now() < token.accessTokenExpires) {
        return token; // still valid
      }

      // expired → refresh
      return await refreshAccessToken(token);
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.error = token.error;
      session.user = {
        email: token.email as string,
      };

      return session;
    },
  },
};

async function refreshAccessToken(token: JWT) {
  try {
    // console.log("inside refresh token");
    const response = await fetch(`${process.env.SSO_API_URL}/refresh-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        refreshToken: token.refreshToken,
      }),
    });

    const refreshed = await response.json();
    if (!response.ok) throw refreshed;

    const decoded: DecodedJWT = jwtDecode(refreshed.accessToken);
    console.log("inside refresh token", refreshed);
    return {
      ...token,
      accessToken: refreshed.accessToken,
      refreshToken: refreshed.refreshToken ?? token.refreshToken,
      accessTokenExpires: decoded.exp * 1000,
    };
  } catch (error) {
    console.log("error", error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}
