import { Color } from "./color.interface";

export interface SelectedComponent {
  category_id: string;
  component: string;
  primary_color: Color | null;
  pattern_color: Color | null;
}
