import NextAuth, { AuthOptions } from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";

const BASE_URL = `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect`;

const oidcFetch = async (endpoint: string, body: URLSearchParams) => {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!response.ok)
    throw new Error(`OIDC ${endpoint} failed: ${response.status}`);
  return response.json();
};

const refreshTokenRequest = async (refresh_token: string) =>
  oidcFetch(
    "/token",
    new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token,
      client_id: process.env.KEYCLOAK_CLIENT_ID!,
      ...(process.env.KEYCLOAK_CLIENT_SECRET
        ? { client_secret: process.env.KEYCLOAK_CLIENT_SECRET }
        : {}),
    })
  );

export const authOptions: AuthOptions = {
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_CLIENT_ID!,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET!,
      issuer: process.env.KEYCLOAK_ISSUER!,
      authorization: {
        params: {
          prompt: "login",
        },
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token!;
        token.refreshToken = account.refresh_token!;
        token.expiresAt = Math.floor(
          Date.now() / 1000 + ((account.expires_in as number) ?? 300)
        );

        const payload = JSON.parse(
          Buffer.from(account.access_token!.split(".")[1], "base64").toString()
        );

        token.user = {
          id: payload.sub || null,
          username: payload.preferred_username || null,
          email: payload.email || null,
          roles: [
            ...(payload.realm_access?.roles || []),
            ...(payload.resource_access?.[process.env.KEYCLOAK_CLIENT_ID!]
              ?.roles || []),
          ],
        };
        return token;
      }

      if (Date.now() / 1000 > (token.expiresAt as number) - 60) {
        try {
          const refreshed = await refreshTokenRequest(
            token.refreshToken as string
          );
          token.accessToken = refreshed.access_token;
          token.refreshToken = refreshed.refresh_token ?? token.refreshToken;
          token.expiresAt = Math.floor(
            Date.now() / 1000 + (refreshed.expires_in ?? 300)
          );
        } catch (err) {
          console.error("Refresh token failed:", err);
          token.error = "RefreshAccessTokenError";
        }
      }

      return token;
    },
    async session({ session, token }) {
      session.user = token.user as {
        id: string | null;
        username: string | null;
        email: string | null;
        roles: string[];
      };
      session.accessToken = token.accessToken as string;
      session.refreshToken = token.refreshToken as string;
      session.accessTokenExpires = token.expiresAt as number;
      session.error = token.error as string | undefined;
      return session;
    },
  },
  debug: true,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
