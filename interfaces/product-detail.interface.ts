export interface ProductDetail {
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
}
