interface Token {
  accessToken?: string;
  refreshToken?: string;
  userId?: string;
  role?: string;
  accessTokenExpires?: number;
  error?: string;
}

export async function refreshAccessToken(token: Token): Promise<Token> {
  try {
    if (!token.refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await fetch(`${process.env.API_URL}/auth/refresh-tokens`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refreshToken: token.refreshToken,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to refresh token");
    }

    if (!data.accessToken) {
      throw new Error("New access token is missing");
    }

    // Return a new token object with the updated access token and expiration time
    return {
      ...token,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken ?? token.refreshToken,
      accessTokenExpires: Date.now() + (data.expiresIn ?? 3600) * 1000,
    };
  } catch (error) {
    console.error("Token refresh error:", error);
    return { ...token, error: "RefreshAccessTokenError" };
  }
}
