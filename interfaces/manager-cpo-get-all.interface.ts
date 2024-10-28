export interface ManagerCPOGetAll {
  id: string;
  user_name: string;
  status: string;
  total_price: number;
  est_delivery_date: string;
  last_updated: Date;
  paid_date_time?: Date;
  material_status?: string;
  material_details?: MaterialDetail[];
}

interface MaterialDetail {
  needed: number;
  available: number;
  is_sufficient: boolean;
  material_name: string;
}
