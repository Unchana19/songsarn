export interface ProductDetail {
  id: string;
  category_id: string;
  name: string;
  price: number;
  sale: number;
  detail: string;
  img: string;
  components: Array<{
    component: {
      id: string;
      name: string;
      img: string;
    };
    primary_color: {
      id: string;
      name: string;
      color: string;
    } | null;
    pattern_color: {
      id: string;
      name: string;
      color: string;
    } | null;
  }>;
}