import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  try {
    const formData = await req.formData();
    const token = req.headers.get("authorization")?.split(" ")[1] || null;

    const userData = {
      id: formData.get("id"),
      name: formData.get("name"),
      phone_number: formData.get("phone_number"),
    };

    const bodyFormData = new FormData();
    bodyFormData.append("id", userData.id as string);
    bodyFormData.append("name", userData.name as string);
    bodyFormData.append("phone_number", userData.phone_number as string);

    const file = formData.get("file") as File | null;
    if (file) {
      bodyFormData.append("file", file);
    }

    const response = await fetch(`${process.env.API_URL}/users`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: bodyFormData,
    });

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
