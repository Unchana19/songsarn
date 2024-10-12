export interface MPOGetOne {
  id: string;
  supplier: string;
  create_date_time: Date;
  receive_date_time: null;
  total_amount: null;
  materials: {
    material_name: string;
    material_quantity: number;
    material_unit: string;
    material_price?: number;
  }[];
}
