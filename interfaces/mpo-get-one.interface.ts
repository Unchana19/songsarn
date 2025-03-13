export interface MaterialMPO {
  mpo_ol_id: string;
  material_id: string;
  material_name: string;
  material_quantity: number;
  material_unit: string;
  material_price?: number;
}

export interface MPOGetOne {
  id: string;
  supplier: string;
  create_date_time: Date;
  receive_date_time?: Date;
  total_price?: Date;
  payment_method?: string;
  materials: MaterialMPO[];
}
