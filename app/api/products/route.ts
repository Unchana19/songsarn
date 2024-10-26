import { NextResponse } from "next/server";

interface ComponentItem {
  id: string;
  primary_color: string;
  pattern_color: string;
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const token = req.headers.get("authorization")?.split(" ")[1] || null;

    const productData = {
      category_id: formData.get("category_id"),
      name: formData.get("name"),
      detail: formData.get("detail"),
      price: formData.get("price"),
    };

    const bodyFormData = new FormData();
    bodyFormData.append("category_id", productData.category_id as string);
    bodyFormData.append("name", productData.name as string);
    bodyFormData.append("detail", productData.detail as string);
    bodyFormData.append("price", productData.price as string);

    const file = formData.get("file") as File | null;
    if (file) {
      bodyFormData.append("file", file);
    }

    const componentsString = formData.get("components") as string;
    if (componentsString) {
      let components: ComponentItem[];
      components = JSON.parse(componentsString);
      components.forEach((component, index) => {
        bodyFormData.append(`components[${index}][id]`, component.id);
        bodyFormData.append(
          `components[${index}][primary_color]`,
          component.primary_color
        );
        bodyFormData.append(
          `components[${index}][pattern_color]`,
          component.pattern_color
        );
      });
    }

    const response = await fetch(`${process.env.API_URL}/products`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: bodyFormData,
    });

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

export async function GET(req: Request) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1] || null;

    const response = await fetch(`${process.env.API_URL}/products`, {
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

    const response = await fetch(`${process.env.API_URL}/products?id=${id}`, {
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