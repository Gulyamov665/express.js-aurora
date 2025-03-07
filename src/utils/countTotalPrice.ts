type Product = {
  quantity: number;
  price: number;
};

export const calcTotalPrice = (product: Product[]) => {
  return product.reduce((sum, obj) => obj.price * obj.quantity + sum, 0);
};
