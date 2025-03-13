"use client";

import StatusTab from "./status-tab";
import { useSession } from "next-auth/react";
import EmptyComponents from "@/components/empty-components";
import { Button } from "@heroui/button";
import Link from "next/link";
import { useFetchCPOsByUserIdQuery } from "@/store";
import Loading from "@/app/loading";

export default function MyOrderPage() {
  const session = useSession();

  const {
    currentData: cpos,
    isLoading,
    isSuccess,
  } = useFetchCPOsByUserIdQuery({
    userId: session.data?.userId,
    accessToken: session.data?.accessToken,
  });

  if (session.status === "unauthenticated") {
    return (
      <div className="flex items-center justify-center">
        <EmptyComponents
          title={"Please login to view your orders"}
          subTitle={"Your order is empty"}
          button={
            <Button
              as={Link}
              href="/login"
              radius="full"
              color="primary"
              className="px-10"
            >
              Login
            </Button>
          }
        />
      </div>
    );
  }

  if (isLoading || !isSuccess) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto px-4">
      <StatusTab cpos={cpos} isSuccess={isSuccess} />
    </div>
  );
}
