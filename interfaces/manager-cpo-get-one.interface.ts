export interface MaterialDetail {
  name: string;
  quantity: number;
  unit: string;
}

interface ColorDetail {
  name: string;
  color: string;
}

export interface ComponentDetail {
  id: string;
  name: string;
  img: string;
  primary_color: ColorDetail;
  pattern_color: ColorDetail;
  materials: MaterialDetail[];
}

export interface OrderLineDetail {
  id: string;
  name: string;
  img: string;
  price: number;
  quantity: number;
  components: ComponentDetail[];
}

interface DeliveryDetail {
  address: string;
  phone: string;
}

export interface ManagerCPOGetOne {
  id: string;
  status: string
  user_name: string;
  last_updated: Date;
  paid_date_time: Date | null;
  payment_method: string;
  est_delivery_date: string;
  delivery_details: DeliveryDetail;
  delivery_price: number;
  total_price: number;
  order_lines: OrderLineDetail[];
}
