import { DistanceResult } from "../../api/types";
import { DeliverySnapshot } from "../../entities/Cart";
import { Product } from "../../services/cartTypes";

export type GetCartType = {
  id: number;
  created_by?: string;
  user_id: number;
  restaurant: number;
  products: Product[];
  destination: DistanceResult;
  delivery: DeliverySnapshot;
};
