import { NextResponse } from "next/server";

interface MaterialItem {
  material_id: string;
  quantity: string;
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const token = req.headers.get("authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const category_id = formData.get("category_id") as string;
    const name = formData.get("name") as string;
    const priceString = formData.get("price") as string;
    const materialsString = formData.get("materials") as string;

    if (!category_id || !name || !priceString || !materialsString) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate and parse price
    const price = parseFloat(priceString);
    if (isNaN(price)) {
      return NextResponse.json(
        { message: "Price must be a valid number" },
        { status: 400 }
      );
    }

    // Parse and validate materials
    let materials: MaterialItem[];
    try {
      materials = JSON.parse(materialsString);
      if (!Array.isArray(materials)) {
        throw new Error("Materials must be an array");
      }
      // Validate each material item
      materials.forEach((item) => {
        if (typeof item !== "object" || item === null) {
          throw new Error("Each material must be an object");
        }
        if (!("material_id" in item) || !("quantity" in item)) {
          throw new Error("Each material must have material_id and quantity");
        }
      });
    } catch (error) {
      console.error("Error parsing materials:", error);
      return NextResponse.json(
        { message: "Invalid materials data: " + (error as Error).message },
        { status: 400 }
      );
    }

    // Create the request body
    const requestBody = new FormData();
    requestBody.append("category_id", category_id);
    requestBody.append("name", name);
    requestBody.append("price", price.toString());

    // Append each material as a separate entry in FormData
    materials.forEach((material, index) => {
      requestBody.append(
        `materials[${index}][material_id]`,
        material.material_id
      );
      requestBody.append(`materials[${index}][quantity]`, material.quantity);
    });

    const file = formData.get("file") as File | null;
    if (file) {
      requestBody.append("file", file);
    }

    const response = await fetch(`${process.env.API_URL}/components`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: requestBody,
    });

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: result.message || "Failed to create component" },
        { status: response.status }
      );
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Error creating component:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
