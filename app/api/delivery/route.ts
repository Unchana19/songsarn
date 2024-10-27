import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const response = await fetch(
      `${process.env.API_URL}/delivery/calculate-fee`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const result = await response.json();
      return NextResponse.json(
        { message: result.message },
        { status: response.status }
      );
    }

    const result = await response.json();

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
