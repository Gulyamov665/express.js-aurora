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
