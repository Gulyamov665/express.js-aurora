export type Product = {
  quantity: number;
  price: number;
};

export const calcTotalPrice = (product: Product[]) => {
  if (product && product.length > 0) return product.reduce((sum, obj) => obj.price * obj.quantity + sum, 0);
};
