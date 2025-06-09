import { Product } from "../../services/CartService";

export type GetCartType = {
  id: number;
  created_by?: string;
  user_id: number;
  restaurant: number;
  products: Product[];
};
