import {
  useIncreaseQuantityByIdMutation,
  useDecreaseQuantityByIdMutation,
  useDeleteOrderByIdMutation,
  useFetchCartsByIdQuery,
} from "@/store";

interface Props {
  userId: string;
  accessToken: string;
}

export function useCarts({ userId, accessToken }: Props) {
  const {
    currentData: orderLines,
    isLoading,
    isSuccess,
    refetch,
  } = useFetchCartsByIdQuery({
    userId,
    accessToken,
  });

  const [increaseQuantityById, increaseResults] =
    useIncreaseQuantityByIdMutation();
  const [decreaseQuantityById, decreaseResults] =
    useDecreaseQuantityByIdMutation();
  const [deleteOrderById, deleteResults] = useDeleteOrderByIdMutation();

  const handleIncreaseQuantityById = async (orderId: string) => {
    await increaseQuantityById({ orderId, accessToken });
  };

  const handleDecreaseQuantityById = async (orderId: string) => {
    await decreaseQuantityById({ orderId, accessToken });
  };

  const handleDeleteOrderById = async (orderId: string) => {
    await deleteOrderById({ orderId, accessToken });
  };

  return {
    orderLines,
    isLoading,
    isSuccess,
    refetch,
    handleIncreaseQuantityById,
    increaseResults,
    handleDecreaseQuantityById,
    decreaseResults,
    handleDeleteOrderById,
    deleteResults,
  };
}
