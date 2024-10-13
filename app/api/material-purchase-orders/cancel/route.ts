import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  try {
    const data = await req.json();
    const token = req.headers.get("authorization")?.split(" ")[1] || null;

    const response = await fetch(
      `${process.env.API_URL}/material-purchase-orders/cancel`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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

    return NextResponse.json({ status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
