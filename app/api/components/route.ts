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
    const colorPrimaryUse = formData.get("color_primary_use") as string;
    const colorPatternUse = formData.get("color_pattern_use") as string;

    const price = parseFloat(priceString);
    if (isNaN(price)) {
      return NextResponse.json(
        { message: "Price must be a valid number" },
        { status: 400 }
      );
    }

    let materials: MaterialItem[];
    try {
      materials = JSON.parse(materialsString);
      if (!Array.isArray(materials)) {
        throw new Error("Materials must be an array");
      }
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

    const requestBody = new FormData();
    requestBody.append("category_id", category_id);
    requestBody.append("name", name);
    requestBody.append("price", price.toString());
    requestBody.append("color_primary_use", colorPrimaryUse.toString());
    requestBody.append("color_pattern_use", colorPatternUse.toString());
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

export async function GET(req: Request) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1] || null;

    const response = await fetch(`${process.env.API_URL}/components`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
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

export async function PATCH(req: Request) {
  try {
    const formData = await req.formData();
    const token = req.headers.get("authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const id = formData.get("id") as string;
    const category_id = formData.get("category_id") as string;
    const name = formData.get("name") as string;
    const priceString = formData.get("price") as string;
    const materialsString = formData.get("materials") as string;
    const colorPrimaryUse = formData.get("color_primary_use") as string;
    const colorPatternUse = formData.get("color_pattern_use") as string;

    const price = parseFloat(priceString);
    if (isNaN(price)) {
      return NextResponse.json(
        { message: "Price must be a valid number" },
        { status: 400 }
      );
    }

    let materials: MaterialItem[];
    try {
      materials = JSON.parse(materialsString);
      if (!Array.isArray(materials)) {
        throw new Error("Materials must be an array");
      }
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

    const requestBody = new FormData();
    requestBody.append("id", id);
    requestBody.append("category_id", category_id);
    requestBody.append("name", name);
    requestBody.append("price", price.toString());
    requestBody.append("color_primary_use", colorPrimaryUse.toString());
    requestBody.append("color_pattern_use", colorPatternUse.toString());
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
      method: "PATCH",
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

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Material ID is required" },
        { status: 400 }
      );
    }

    const token = req.headers.get("authorization")?.split(" ")[1] || null;

    const response = await fetch(`${process.env.API_URL}/components?id=${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const result = await response.json();
      return NextResponse.json(
        { message: result.message },
        { status: response.status }
      );
    }

    return NextResponse.json({
      status: 200,
      message: "Material deleted successfully",
    });
  } catch (error) {
    console.error("Error in DELETE request:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
