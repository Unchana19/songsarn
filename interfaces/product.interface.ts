import { Component } from "./component.interface";

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  sale: number;
  img?: string;
  component?: Component[];
} 