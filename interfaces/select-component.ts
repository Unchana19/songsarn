import { Color } from "./color.interface";

export interface SelectedComponent {
  component: string;
  primaryColor: Color | null;
  patternColor: Color | null;
}
