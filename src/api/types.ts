// Типы для ответа от Google Distance Matrix API
export type DistanceMatrixResponse = {
  destination_addresses: string[];
  origin_addresses: string[];
  rows: {
    elements: {
      distance: {
        text: string;
        value: number; // в метрах
      };
      duration: {
        text: string;
        value: number; // в секундах
      };
      status: string;
    }[];
  }[];
  status: string;
};

export type DistanceResult = {
  distance: string;
  duration: string;
};

type Variant = {
  id: number;
  name: string;
  price: number;
  is_active: boolean;
};

type Option = {
  id: number;
  variants: Variant[];
};

export type ProductItem = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  photo: string;
  category: number;
  category_label: string;
  is_active: boolean;
  availability: boolean;
  restaurant: number;
  thumb: string;
  options: Option;
};

type Location = {
  lat: string;
  long: string;
};

type User = {
  location: Location;
};

type Restaurant = {
  location: Location;
};

export type DeliveryRule = {
  id: number;
  restaurant: number;
  name: string;
  description: string;
  calculation_type: "per_km" | "fixed" | "percent"; // перечисли все свои варианты
  min_distance: number;
  max_distance: number;
  price_per_km: number | null;
  fixed_price: number | null;
  price_per_percent: number | null;
  max_order_price_for_free_delivery: number | null;
  reverse_calculate: boolean;
  is_active: boolean;
};

export type Delivery = {
  type: "per_km" | "fixed" | "percent"; // перечисли свои варианты
  rule: DeliveryRule;
};

export type DeliveryData = {
  user: User;
  restaurant: Restaurant;
  delivery: Delivery;
};

export interface IGetPriceResponse {
  message: string;
  price: number | undefined;
  code: number;
}

export interface IVendorInfo {
  id: number;
  created_time: string;
  update_time: string;
  name: string;
  address: string;
  is_active: boolean;
  telegram_link: string;
  instagram_link: string;
  background_photo: string;
  logo: string;
  availability_orders: boolean;
  orders_chat_id: number;
  waiter_chat_id: number;
  lat: string;
  long: string;
  editors: number[];
  contacts: string[];
}
