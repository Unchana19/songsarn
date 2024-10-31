import { User } from "@/interfaces/user.interface";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const response = await fetch(`${process.env.API_URL}/users/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const userData = await response.json();

    if (!response.ok) {
      console.error(`Error fetching user: ${userData}`); response
      return NextResponse.json(
        { data: `User with id ${id} not found` },
        { status: response.status }
      );
    }
    if (!userData) {
      return NextResponse.json(
        { data: `User with id ${id} not found` },
        { status: 404 }
      );
    }

    return NextResponse.json(userData as User, { status: 200 });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ data: "Something went wrong" }, { status: 500 });
  }
}
