import { DeliveryData, DistanceResult } from "../api/types";

interface IOptions {
  id: number;
  name: string;
  price: number;
  is_active: boolean;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  photo: string;
  quantity: number;
  options?: IOptions;
}

export interface IAddOrUpdateCartType {
  user_id: number;
  restaurant_id: number;
  newProduct: Product;
  destination?: DistanceResult;
  delivery?: DeliveryData;
}

export interface IAddOrUpdateCartTypeArgs {
  user_id: number;
  restaurant: number;
  products: Product;
  cart_id?: number;
}
