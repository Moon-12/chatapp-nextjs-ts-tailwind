import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized({ token, req }) {
      // console.log("starts here**********");

      // console.log("token", token);
      // console.log("**********" + "\n");
      const path = req.nextUrl.pathname;
      console.log("inside middleware callback", path);

      if (path.includes("/api/auth")) return true;
      // Exclude signup API from auth check
      if (path === "/api/signup") {
        return true; // allow access without token
      }

      return !!token;
    },
  },
  pages: {
    signIn: "/",
  },
});

export const config = {
  matcher: ["/:path*"],
};
