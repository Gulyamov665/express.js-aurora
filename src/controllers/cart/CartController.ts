import { CartService } from "../../services/CartService";
import { Request, Response } from "express";
import { handleError } from "../../utils/handlerError";
import { calcTotalPrice } from "../../utils/countTotalPrice";
import { GetCartType } from "./types";

export const addToCart = async (req: Request, res: Response) => {
  const { user_id, restaurant, products } = req.body;

  try {
    const updatedCart = await CartService.addOrUpdateCartProducts(user_id, restaurant, products);

    res.status(201).json(updatedCart);
  } catch (error) {
    handleError(res, error, 400);
  }
};

export const getCartItems = async (req: Request, res: Response) => {
  const user_id = req.query.user_id as string; // Приведение к строке
  const restaurant_id = req.query.restaurant_id as string; // Приведение к строке

  try {
    const cartData: GetCartType | null = await CartService.getCartItems(user_id, restaurant_id);
    const totalPrice = cartData ? calcTotalPrice(cartData.products) : null;

    res.status(200).json({
      products: cartData?.products || [],
      totalPrice,
      user: cartData?.user_id,
      vendor: cartData?.restaurant,
      id: cartData?.id,
    })
  } catch (error) {
    handleError(res, error, 400);
  }
};

export const decreaseItem = async (req: Request, res: Response) => {
  const { user_id, restaurant_id, product_id } = req.body;

  try {
    const updatedCart = await CartService.decreaseProductQuantity(
      Number(user_id),
      Number(restaurant_id),
      Number(product_id)
    );

    res.status(200).json(updatedCart);
  } catch (error) {
    handleError(res, error, 400);
  }
};

export const removeCart = async (req: Request, res: Response) => {
  const { cartId } = req.params;

  try {
    await CartService.removeCartByUserAndRestaurant({ id: Number(cartId) });

    res.status(200).json({ message: "Cart deleted successfully" });
  } catch (error) {
    handleError(res, error, 500);
  }
};
