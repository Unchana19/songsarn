export interface OrderLine {
  id: string;
  quantity: number;
  product_id: string;
  name: string;
  price: number;
  img?: string;
}
