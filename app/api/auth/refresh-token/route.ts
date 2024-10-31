import { NextResponse } from "next/server";

export async function refreshAccessToken(token: any) {
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

    return NextResponse.json(
      {
        ...token,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken ?? token.refreshToken,
        accessTokenExpires: Date.now() + (data.expiresIn ?? 3600) * 1000,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Token refresh error:", error);
    return NextResponse.json({
      ...token,
      error: "RefreshAccessTokenError",
    });
  }
}
