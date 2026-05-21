import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/auth/sign-in",
  },
  callbacks: {
    authorized: ({ token }) => !!token,
  },
});

export const config = {
  matcher: ["/upload", "/questionnaire", "/processing", "/checkout", "/report", "/account/:path*"],
};
