import ImagePlaceholder from "@/components/image-placeholder";
import type { UnsoldProduct } from "@/interfaces/dashboard.interface";
import { formatId } from "@/utils/format-id";
import { formatNumberWithComma } from "@/utils/num-with-comma";
import { Button } from "@heroui/button";
import { Card } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Image } from "@heroui/image";
import Link from "next/link";

interface Props {
  unsoldProducts: UnsoldProduct[];
}

export default function UnsoldProductsCard({ unsoldProducts }: Props) {
  return (
    <Card className="p-4 sm:p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold">Unsold Products</h2>
          <p className="text-default-500 text-sm">
            Products without sales in 30 days
          </p>
        </div>
        <Button
          as={Link}
          color="primary"
          variant="light"
          href="/manager/product-component"
          className="font-medium"
        >
          View All
        </Button>
      </div>

      <div className="space-y-4">
        {unsoldProducts.map((product: UnsoldProduct) => (
          <div
            key={product.product_id}
            className="flex gap-4 p-4 rounded-lg bg-default-50"
          >
            {/* Product Image */}
            <div className="flex-shrink-0">
              {product.image_url ? (
                <Image
                  src={product.image_url}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded-lg bg-default-200"
                />
              ) : (
                <ImagePlaceholder
                  name={product.name.substring(0, 2).toUpperCase()}
                  classNames="w-16 h-16"
                />
              )}
            </div>

            {/* Product Details */}
            <div className="flex-grow min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-medium text-default-900 truncate">
                  {product.name}
                </h3>
                <Chip
                  size="sm"
                  variant="flat"
                  className="bg-default-100 text-default-600"
                >
                  {formatId("P", product.product_id)}
                </Chip>
              </div>
              <p className="text-small text-default-500">{product.category}</p>

              <div className="flex flex-wrap items-center gap-2 mt-1">
                <span className="text-default-700 font-medium">
                  {formatNumberWithComma(product.price)}
                </span>
                <span className="text-default-600">•</span>
                <Chip size="sm" color="danger" variant="flat">
                  {product.days_without_sale_text}
                </Chip>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
