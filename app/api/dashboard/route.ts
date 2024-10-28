import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const timeframe = searchParams.get("timeframe");
    const date = searchParams.get("date");

    const token = req.headers.get("authorization")?.split(" ")[1] || null;

    const response = await fetch(
      `${process.env.API_URL}/dashboard?timeframe=${timeframe}&date=${date}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await response.json();
    if (!response.ok) {
      return NextResponse.json(
        { message: result.message },
        { status: response.status }
      );
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
