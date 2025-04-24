import { Orders } from "../entities/Orders";

export type Product = {
  quantity: number;
  price: number;
};

export const calcTotalPrice = (product: Product[]) => {
  if (product && product.length > 0) return product.reduce((sum, obj) => obj.price * obj.quantity + sum, 0);
};

export const totalSum = (orders: Orders[]) => {
  if (orders && orders.length > 0) return orders.reduce((acc, order) => acc + Number(order.total_price), 0);
};
