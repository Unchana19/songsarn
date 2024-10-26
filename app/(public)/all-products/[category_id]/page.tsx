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

export default function ProductCategoryPage() {
  const params = useParams();
  const category_id = params.category_id as string;

  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
                        }}
                        radius="full"
                        className="z-10"
                        isIconOnly
                        color="primary"
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
    </div>
  );
}
