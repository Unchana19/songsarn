interface CPOGetOne {
  cpo: {
    id: string;
    payment_status: "Completed" | "Not paid";
    order_status: string;
    delivery_date: string;
    payment_method: string;
    delivery_details: {
      address: string;
      phone: string;
    };
    delivery_price: number;
    total_price: number;
  };
  order_lines: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
  }>;
}
