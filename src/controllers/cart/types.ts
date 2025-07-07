import { DeliveryRule, DistanceResult } from "../../api/types";
import { Product } from "../../services/cartTypes";

export type GetCartType = {
  id: number;
  created_by?: string;
  user_id: number;
  restaurant: number;
  products: Product[];
  destination: DistanceResult;
  delivery: DeliveryRule;
};
