import ImagePlaceholder from "@/components/image-placeholder";
import type { TopSeller } from "@/interfaces/dashboard.interface";
import { formatId } from "@/utils/format-id";
import { formatNumberWithComma } from "@/utils/num-with-comma";
import { Card } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Image } from "@heroui/image";
import { FaTrophy } from "react-icons/fa";

interface Props {
  topSellers: TopSeller[];
}

export default function TopSellersCard({ topSellers }: Props) {
  return (
    <Card className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mb-6">
        <div>
          <h2 className="text-xl font-bold">Top 5 Sellers</h2>
          <p className="text-default-500 text-sm">Best performing products</p>
        </div>
        <Chip
          color="primary"
          variant="flat"
          startContent={<FaTrophy size={16} />}
          className="self-start sm:self-auto"
        >
          Total:{" "}
          {formatNumberWithComma(
            topSellers.reduce(
              (sum: number, item: TopSeller) => sum + item.total,
              0
            )
          )}
        </Chip>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {topSellers.map((item: TopSeller, index: number) => (
          <div
            key={item.product_id}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-lg bg-default-50 hover:bg-default-100 transition-colors"
          >
            {/* Top Section for Mobile - Ranking, Image, and Basic Info */}
            <div className="flex items-center gap-4 w-full sm:w-auto">
              {/* Ranking Number - Minimal Style */}
              <div className="flex-shrink-0 w-8 text-center">
                <span
                  className={`text-xl font-semibold ${
                    index === 0
                      ? "text-primary"
                      : index === 1
                        ? "text-zinc-400"
                        : "text-default-400"
                  }`}
                >
                  {index + 1}
                </span>
              </div>

              {/* Product Image */}
              <div className="flex-shrink-0">
                {item.image_url ? (
                  <Image
                    src={item.image_url}
                    alt={item.product_name}
                    className="w-16 h-16 object-cover rounded-lg bg-default-200"
                  />
                ) : (
                  <ImagePlaceholder
                    name={item.product_name.substring(0, 2).toUpperCase()}
                    classNames="w-16 h-16"
                  />
                )}
              </div>

              {/* Basic Product Info for Mobile */}
              <div className="flex-grow min-w-0 sm:hidden">
                <h3 className="font-medium text-default-900 truncate">
                  {item.product_name}
                </h3>
                <p className="text-small text-default-500">{item.category}</p>
              </div>
            </div>

            {/* Product Details - Hidden on Mobile */}
            <div className="hidden sm:block flex-grow min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-default-900 truncate">
                  {item.product_name}
                </h3>
                <Chip
                  size="sm"
                  variant="flat"
                  className="bg-default-100 text-default-600"
                >
                  {formatId("P", item.product_id)}
                </Chip>
              </div>
              <p className="text-small text-default-500">{item.category}</p>
              <div className="flex items-center gap-2 mt-1">
                <Chip variant="flat" className="bg-primary-100 text-primary">
                  {item.quantity} units
                </Chip>
                <span className="text-default-500">•</span>
                <span className="text-default-700">
                  {formatNumberWithComma(item.price)} /unit
                </span>
              </div>
            </div>

            {/* Additional Info for Mobile */}
            <div className="sm:hidden w-full pl-12">
              <div className="flex flex-wrap gap-2 mb-2">
                <Chip
                  size="sm"
                  variant="flat"
                  className="bg-default-100 text-default-600"
                >
                  {formatId("P", item.product_id)}
                </Chip>
                <Chip variant="flat" className="bg-primary-100 text-primary">
                  {item.quantity} units
                </Chip>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-default-700">
                  {formatNumberWithComma(item.price)} /unit
                </span>
                <div className="text-right">
                  <p className="font-semibold text-primary">
                    {formatNumberWithComma(item.total)}
                  </p>
                  <p className="text-small text-default-500">Total Sales</p>
                </div>
              </div>
            </div>

            {/* Total Sales - Hidden on Mobile */}
            <div className="hidden sm:block flex-shrink-0 text-right">
              <p className="font-semibold text-primary">
                {formatNumberWithComma(item.total)}
              </p>
              <p className="text-small text-default-500">Total Sales</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
