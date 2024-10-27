import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const token = req.headers.get("authorization")?.split(" ")[1] || null;

    const slipData = {
      orderId: formData.get("orderId"),
      expectedAmount: formData.get("expectedAmount"),
    };

    const bodyFormData = new FormData();
    bodyFormData.append("orderId", slipData.orderId as string);
    bodyFormData.append("expectedAmount", slipData.expectedAmount as string);

    const file = formData.get("file") as File | null;
    if (file) {
      bodyFormData.append("file", file);
    }

    const response = await fetch(
      `${process.env.API_URL}/payments/verify-slip`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: bodyFormData,
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
