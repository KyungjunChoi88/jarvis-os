import GoogleProviderModule from "next-auth/providers/google";

const GoogleProvider = GoogleProviderModule.default ?? GoogleProviderModule;

async function refreshAccessToken(token) {
  try {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID || "",
        client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
        grant_type: "refresh_token",
        refresh_token: token.refreshToken || ""
      })
    });

    const refreshedTokens = await response.json();
    if (!response.ok) throw refreshedTokens;

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
      error: undefined
    };
  } catch (error) {
    console.error("[Google token refresh failed]", error);
    return { ...token, error: "RefreshAccessTokenError" };
  }
}

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          scope: "openid email profile https://www.googleapis.com/auth/calendar.readonly",
          access_type: "offline",
          prompt: "consent",
          response_type: "code"
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        return {
          ...token,
          accessToken: account.access_token,
          accessTokenExpires: account.expires_at ? account.expires_at * 1000 : Date.now() + 3600 * 1000,
          refreshToken: account.refresh_token ?? token.refreshToken
        };
      }

      if (token.accessTokenExpires && Date.now() < token.accessTokenExpires - 60 * 1000) {
        return token;
      }

      if (token.refreshToken) {
        return refreshAccessToken(token);
      }

      return { ...token, error: "MissingGoogleRefreshToken" };
    },
    async session({ session, token }) {
      session.error = token.error;
      session.hasGoogleCalendarAccess = Boolean(token.accessToken) && !token.error;
      return session;
    }
  }
};
