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
