"use client";
import { Category } from "@/interfaces/category.interface";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Product } from "@/interfaces/product.interface";
import EmptyComponents from "@/components/empty-components";
import ProductCardSmall from "@/components/product-card-small";
import { Button } from "@nextui-org/button";
import { FaCartPlus } from "react-icons/fa";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useDisclosure } from "@nextui-org/modal";
import PopupModal from "@/components/popup-modal";

export default function ProductCategoryPage() {
  const session = useSession();
  const params = useParams();
  const category_id = params.category_id as string;

  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const fetchCategory = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/categories/find-one?id=${category_id}`
      );
      const result = await response.json();
      if (response.ok) {
        setCategory(result);
      }
    } catch (error) {
      console.error("Error fetching category:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/products/find-by-category?categoryId=${category_id}`
      );
      const result = await response.json();
      if (response.ok) {
        setProducts(result);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategory();
    fetchProducts();
  }, [category_id]);

  const handleAddToCart = async (product: Product) => {
    if (session.status === "authenticated" && session.data?.userId) {
      await addToCart(product);
    } else {
      setModalMessage("Please login to add items to cart");
      onOpen();
    }
  };

  const addToCart = async (product: Product) => {
    if (isAddingToCart) return;

    setIsAddingToCart(true);

    try {
      if (!session.data?.userId) {
        setModalMessage("Unable to add to cart. Please try again.");
        onOpen();
        return;
      }

      const data = {
        product_id: product.id,
        order_id: session.data.userId,
      };

      const response = await fetch("/api/carts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.data.accessToken}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setModalMessage("Product added to cart successfully!");
      } else {
        setModalMessage("Failed to add product to cart");
      }
      onOpen();
    } catch (error) {
      setModalMessage("An error occurred. Please try again.");
      onOpen();
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <div className="">
      <h3 className="font-bold text-lg">{category?.name}</h3>
      <div className="flex flex-wrap justify-start min-h-[200px]">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="w-full md:w-1/2 xl:w-1/4 p-5">
              <Link href={`/product/${product.id}`}>
                <ProductCardSmall
                  product={product}
                  cardButton={
                    <div className="flex gap-4">
                      <Button
                        as={Link}
                        href={`/product/${product.id}`}
                        color="primary"
                        variant="bordered"
                      >
                        <p>See detail</p>
                      </Button>
                      <Button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleAddToCart(product);
                        }}
                        radius="full"
                        className="z-10"
                        isIconOnly
                        color="primary"
                        isLoading={isAddingToCart}
                      >
                        <FaCartPlus color="white" size={20} />
                      </Button>
                    </div>
                  }
                />
              </Link>
            </div>
          ))
        ) : (
          <div className="w-full flex items-center justify-center">
            <EmptyComponents
              title="No products available in this category"
              subTitle=""
            />
          </div>
        )}
      </div>
      <PopupModal
        message={modalMessage}
        isOpen={isOpen}
        onClose={onOpenChange}
      />
    </div>
  );
}
