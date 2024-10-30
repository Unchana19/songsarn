import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const response = await fetch(
      `${process.env.API_URL}/categories/product-categories`
    );

    const result = await response.json();
    if (!response.ok) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
