"use client";

import PopupModal from "@/components/popup-modal";
import { paymentMethod } from "@/constants/paymentMethod";
import { MPOGetOne } from "@/interfaces/mpo-get-one.interface";
import {
  updateMPOSchema,
  UpdateMPOSchema,
} from "@/lib/schemas/updateMPOSchema";
import { convertTimestampToDateTime } from "@/utils/convert-timestamp";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@nextui-org/button";
import { Divider } from "@nextui-org/divider";
import { Input } from "@nextui-org/input";
import { useDisclosure } from "@nextui-org/modal";
import { Select, SelectItem } from "@nextui-org/select";
import { Skeleton } from "@nextui-org/skeleton";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { SetStateAction, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaArrowLeftLong } from "react-icons/fa6";

interface Props {
  params: { id: string };
}

export default function PurchaseOrderDetial({ params }: Props) {
  const { id } = params;
  const session = useSession();

  const [isLoading, setIsLoading] = useState(true);
  const [mpo, setMpo] = useState<MPOGetOne | null>(null);
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

  const handleSelectionChange = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setSelected(e.target.value);
  };

  useEffect(() => {
    fetchMpo();
  }, [session]);

  const fetchMpo = async () => {
    try {
      const token = session.data?.accessToken;
      const response = await fetch(`/api/material-purchase-orders/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (response.ok) {
        setMpo(result);
        calculateTotalPrice(result.materials);
        setSelected(result.payment_method);
        setValue("materials", result.materials);
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTotalPrice = (
    materials: {
      material_name: string;
      material_quantity: number;
      material_unit: string;
      material_price?: number;
    }[]
  ) => {
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
      const response = await fetch(
        "/api/material-purchase-orders/mpo-order-line",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.data?.accessToken}`,
          },
          body: JSON.stringify(dataWithPayment),
        }
      );
      const result = await response.json();
      if (response.ok) {
        setError("Save successfully");
        fetchMpo();
        onOpen();
      } else {
        setError(result.message);
      }
    } catch (error) {}
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div className="flex justify-between">
        <h3 className="text-lg font-bold">Purchase order detail</h3>
        <Button
          as={Link}
          href="/manager/purchase-order"
          variant="bordered"
          color="primary"
          radius="full"
          className="text-black"
        >
          <FaArrowLeftLong />
          <p>Back</p>
        </Button>
      </div>
      <div className="flex w-full mt-10">
        <div className="flex flex-col w-3/6 md:w-3/12 text-primary gap-8">
          <p>Supplier</p>
          <p>Purchase date and time</p>
          <p>Receive date and time</p>
          <p className="mt-1">Payment method</p>
        </div>
        {isLoading ? (
          <div className="flex flex-col w-3/6 md:w-4/12 gap-8">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
          </div>
        ) : (
          <div className="flex flex-col w-3/6 md:w-4/12 gap-8">
            <p>{mpo?.supplier}</p>
            <p>
              {mpo ? convertTimestampToDateTime(mpo?.create_date_time) : ""}
            </p>
            <p>
              {mpo
                ? mpo?.receive_date_time
                  ? convertTimestampToDateTime(mpo?.receive_date_time)
                  : "-"
                : ""}
            </p>
            <Select
              color="primary"
              variant="bordered"
              placeholder="Select a method"
              selectedKeys={[selected]}
              className="max-w-xs"
              onChange={handleSelectionChange}
            >
              {paymentMethod.map((payment) => (
                <SelectItem value={payment} key={payment}>
                  {payment}
                </SelectItem>
              ))}
            </Select>
          </div>
        )}
      </div>
      <Divider className="my-10" />
      <div className="flex w-full">
        <div className="flex flex-col w-3/12 gap-8">
          <p className="text-primary">Material name</p>
          {mpo?.materials.map((m) => <p className="my-2">{m.material_name}</p>)}
        </div>
        <div className="flex flex-col w-3/12 gap-8">
          <p className="text-primary">Quantity</p>
          {mpo?.materials.map((m) => (
            <p className="my-2">{m.material_quantity}</p>
          ))}
        </div>
        <div className="flex flex-col w-3/12 gap-8">
          <p className="text-primary">Unit</p>
          {mpo?.materials.map((m) => <p className="my-2">{m.material_unit}</p>)}
        </div>
        <div className="flex flex-col w-3/12 gap-8">
          <p className="text-primary">Price</p>
          {mpo?.materials.map((m, index) => (
            <div className="flex w-full">
              <Input
                fullWidth
                color="primary"
                variant="bordered"
                placeholder="Enter price"
                defaultValue={m.material_price?.toString() || ""}
                {...register(`materials.${index}.material_price`)}
                isInvalid={!!errors.materials?.[index]?.material_price}
                errorMessage={
                  errors.materials?.[index]?.material_price?.message as string
                }
              />
            </div>
          ))}
        </div>
      </div>
      <Divider className="mt-10 mb-5" />
      <div className="flex flex-col gap-10">
        <p className="text-primary">Summary</p>
        <div className="flex w-full font-bold">
          <div className="flex w-1/4">
            <p>Total price</p>
          </div>
          <div className="flex w-3/4">
            <p>{totalPrice === 0 ? "-" : totalPrice}</p>
          </div>
        </div>
      </div>
      <div className="flex w-full justify-center mt-10">
        <Button
          type="submit"
          color="primary"
          size="lg"
          radius="full"
          className="px-20 text-white text-lg"
          isDisabled={selected === "" || !isValid}
          isLoading={isSubmitting}
        >
          <p>Save</p>
        </Button>
      </div>
      <PopupModal
        message={error}
        isOpen={isOpen}
        onClose={onOpenChange}
      />
    </form>
  );
}
