import { DeliveryRule } from "../api/types";

type IDelivery = Pick<DeliveryRule, "calculation_type" | "price_per_km" | "price_per_percent"> & {
  orderPrice: number;
  distance: string;
  reverse?: boolean;
};

export const deliveryPrice = (args: IDelivery): number => {
  const { calculation_type, price_per_km, orderPrice, distance, price_per_percent, reverse } = args;

  if (calculation_type === "per_km" && price_per_km) return price_per_km * parseFloat(distance);
  if (calculation_type === "percent" && price_per_percent) return (orderPrice * price_per_percent) / 100;

  return 0;
};
