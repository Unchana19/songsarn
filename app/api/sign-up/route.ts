import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const data = await req.json();

  const response = await fetch(`${process.env.API_URL}/api/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  return NextResponse.json(result, { status: response.status });
}
