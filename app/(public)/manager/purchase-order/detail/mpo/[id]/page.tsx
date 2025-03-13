"use client";

import PopupModal from "@/components/popup-modal";
import type { MaterialMPO } from "@/interfaces/mpo-get-one.interface";
import {
  updateMPOSchema,
  type UpdateMPOSchema,
} from "@/lib/schemas/updateMPOSchema";
import { convertTimestampToDateTime } from "@/utils/convert-timestamp";
import { formatId } from "@/utils/format-id";
import { formatNumberWithComma } from "@/utils/num-with-comma";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { useDisclosure } from "@heroui/modal";
import { Select, SelectItem } from "@heroui/select";
import { Spinner } from "@heroui/spinner";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaArrowLeftLong } from "react-icons/fa6";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { useEditMPOOrderLineMutation, useFetchMPOByIdQuery } from "@/store";

interface Props {
  params: { id: string };
}

export default function MaterialPurchaseOrderDetail({ params }: Props) {
  const { id } = params;
  const session = useSession();

  const {
    currentData: mpo,
    isLoading,
    isSuccess,
  } = useFetchMPOByIdQuery({
    id,
    accessToken: session.data?.accessToken || "",
  });

  const [editMPOOrderLine, results] = useEditMPOOrderLineMutation();

  const [selected, setSelected] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [error, setError] = useState("");

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors, isValid, isSubmitting },
  } = useForm<UpdateMPOSchema>({
    resolver: zodResolver(updateMPOSchema),
    mode: "onTouched",
  });

  useEffect(() => {
    if (!isLoading && isSuccess) {
      calculateTotalPrice(mpo.materials);
      setSelected(mpo.payment_method);
      setValue("materials", mpo.materials);
    }
  }, [mpo, setValue, isLoading, isSuccess]);

  const calculateTotalPrice = (materials: MaterialMPO[]) => {
    const total = materials.reduce((sum, material) => {
      const price = material.material_price || 0;
      return sum + price;
    }, 0);
    setTotalPrice(total);
  };

  const onSubmit = async (data: UpdateMPOSchema) => {
    try {
      const dataWithPayment = {
        mpo_id: id,
        payment_method: selected,
        ...data,
      };

      await editMPOOrderLine({
        data: dataWithPayment,
        accessToken: session.data?.accessToken || "",
      });

      setError("Save successfully");
      onOpen();
    } catch (error) {
      setError("Failed to save changes");
      onOpen();
    }
  };

  if (isLoading || !isSuccess) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="container mx-auto px-4 py-6"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-bold text-xl">Material Purchase Order Detail</h1>
        <Button
          as={Link}
          href="/manager/purchase-order?type=material"
          variant="bordered"
          color="primary"
          radius="full"
          className="px-8"
        >
          <FaArrowLeftLong />
          Back
        </Button>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-8 md:grid-cols-2">
        {/* Left Column - Order Details */}
        <div className="space-y-6">
          {/* Order Information */}
          <Card>
            <CardBody className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Purchase order ID</span>
                <span className="font-mono">{formatId("MPO", id)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold">Supplier</span>
                <span>{mpo?.supplier}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold">Purchase date</span>
                <span>
                  {mpo && convertTimestampToDateTime(mpo.create_date_time)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold">Receive date</span>
                <span>
                  {mpo?.receive_date_time
                    ? convertTimestampToDateTime(mpo.receive_date_time)
                    : "-"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold">Payment method</span>
                <Select
                  color="primary"
                  variant="bordered"
                  placeholder="Select a method"
                  selectedKeys={[selected]}
                  className="max-w-xs"
                  onChange={(e) => setSelected(e.target.value)}
                >
                  <SelectItem value="Cash" key="cash">
                    Cash
                  </SelectItem>
                  <SelectItem value="Mobile banking" key="mobile">
                    Mobile banking
                  </SelectItem>
                </Select>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Right Column - Materials and Summary */}
        <div className="space-y-6">
          {/* Materials List */}
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-lg">
                Materials ({mpo?.materials.length})
              </h3>
            </CardHeader>
            <CardBody className="p-6">
              {mpo?.materials.map((material: MaterialMPO, index: number) => (
                <div
                  key={material.material_id}
                  className="bg-white p-4 rounded-lg mb-4 border border-default-200"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium">{material.material_name}</p>
                      <p className="text-sm text-default-600">
                        {material.material_quantity} {material.material_unit}
                      </p>
                    </div>
                    <div>
                      <Input
                        fullWidth
                        color="primary"
                        variant="bordered"
                        placeholder="Enter price"
                        defaultValue={material.material_price?.toString() || ""}
                        {...register(`materials.${index}.material_price`)}
                        isInvalid={!!errors.materials?.[index]?.material_price}
                        errorMessage={
                          errors.materials?.[index]?.material_price
                            ?.message as string
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardBody>
          </Card>

          {/* Summary */}
          <Card>
            <CardBody className="p-6">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total Amount</span>
                <span className="text-primary">
                  {totalPrice === 0 ? "-" : formatNumberWithComma(totalPrice)}
                </span>
              </div>
            </CardBody>
          </Card>

          {/* Save Button */}
          <div className="flex justify-center">
            <Button
              type="submit"
              color="primary"
              size="lg"
              radius="full"
              className="px-20 text-white text-lg"
              isDisabled={selected === "" || !isValid}
              isLoading={isSubmitting}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>

      <PopupModal message={error} isOpen={isOpen} onClose={onOpenChange} />
    </form>
  );
}
