import { DeliveryRule } from "../api/types";

type IDelivery = Pick<DeliveryRule, "calculation_type" | "price_per_km" | "price_per_percent"> & {
  orderPrice: number;
  distance: string;
};

export const deliveryPrice = (args: IDelivery): number => {
  const { calculation_type, price_per_km, orderPrice, distance, price_per_percent } = args;

  console.log(price_per_km, "func");
  console.log(calculation_type, "func");
  console.log(distance, "func");
  if (calculation_type === "per_km" && price_per_km) return price_per_km * parseFloat(distance);
  if (calculation_type === "percent" && price_per_percent) return orderPrice * price_per_percent;

  return 0;
};
