import { Orders } from "../entities/Orders";
import { Product } from "../services/CartService";

export const calcTotalPrice = (products: Product[]): number => {
  if (!products || products.length === 0) return 0;

  return products.reduce((sum, product) => {
    const price = product.options?.price ?? product.price ?? 0;
    const quantity = product.quantity ?? 0;
    return sum + price * quantity;
  }, 0);
};

export const totalSum = (orders: Orders[]) => {
  if (orders && orders.length > 0) return orders.reduce((acc, order) => acc + Number(order.total_price), 0);
};

export const totalSumFee = (orders: Orders[]) => {
  if (orders && orders.length > 0) return orders.reduce((acc, order) => acc + Number(order.fee), 0);
};
