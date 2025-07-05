import { CartService } from "../../services/CartService";
import { Request, Response } from "express";
import { handleError } from "../../utils/handlerError";
import { calcTotalPrice } from "../../utils/countTotalPrice";
import { GetCartType } from "./types";
import { getDeliveryRules, getDistance, getVendorStatus } from "../../api/api";
import { IAddOrUpdateCartTypeArgs, Product } from "../../services/cartTypes";

export const addToCart = async (req: Request, res: Response) => {
  const { user_id, restaurant, products, cart_id }: IAddOrUpdateCartTypeArgs = req.body;
  const vendorStatus = await getVendorStatus(restaurant);

  let delivery;
  let distance;

  if (!vendorStatus?.is_open) {
    res.status(400).json({ message: vendorStatus?.message, is_open: vendorStatus?.is_open, code: vendorStatus?.code });
    return;
  }

  console.log(cart_id);

  if (!cart_id) {
    console.log("cart_id", cart_id);
    try {
      console.log("delivery request");
      delivery = await getDeliveryRules(restaurant, user_id);
      distance = await getDistance(
        Number(delivery?.restaurant.location.lat),
        Number(delivery?.restaurant.location.long),
        Number(delivery?.user.location.lat),
        Number(delivery?.user.location.long)
      );
    } catch (error) {
      console.error("ошибка получения getDeliveryRules в addToCart", error);
    }
  }

  console.log(delivery, "deliver");
  console.log(distance, "distance");

  try {
    const updatedCart = await CartService.addOrUpdateCartProducts({
      user_id,
      restaurant_id: restaurant,
      newProduct: products,
      distance: parseFloat(distance?.distance ?? "0"),
    });

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
      distance: cartData?.distance,
    });
  } catch (error) {
    handleError(res, error, 400);
  }
};

export const decreaseItem = async (req: Request, res: Response) => {
  const { user_id, restaurant_id, product }: { user_id: number; restaurant_id: number; product: Product } = req.body;

  try {
    const updatedCart = await CartService.decreaseProductQuantity(Number(user_id), Number(restaurant_id), product);

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
