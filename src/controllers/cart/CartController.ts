import { CartService } from "../../services/CartService";
import { Request, Response } from "express";
import { handleError } from "../../utils/handlerError";
import { calcTotalPrice } from "../../utils/countTotalPrice";
import { GetCartType } from "./types";
import { getDeliveryPrice, getDeliveryRules, getDistance, getVendorStatus } from "../../api/api";
import { IAddOrUpdateCartTypeArgs, Product } from "../../services/cartTypes";

export const addToCart = async (req: Request, res: Response) => {
  const { user_id, restaurant, products, cart_id }: IAddOrUpdateCartTypeArgs = req.body;

  const vendorStatus = await getVendorStatus(restaurant);

  let delivery;
  let destination;

  if (!vendorStatus?.is_open) {
    res.status(400).json({ message: vendorStatus?.message, is_open: vendorStatus?.is_open, code: vendorStatus?.code });
    return;
  }

  if (!cart_id) {
    try {
      delivery = await getDeliveryRules(restaurant, user_id);
      destination = await getDistance(
        Number(delivery?.restaurant.location.lat),
        Number(delivery?.restaurant.location.long),
        Number(delivery?.user.location.lat),
        Number(delivery?.user.location.long)
      );
    } catch (error) {
      console.error("ошибка получения getDeliveryRules в addToCart", error);
    }
  }

  try {
    const updatedCart = await CartService.addOrUpdateCartProducts({
      user_id,
      restaurant_id: restaurant,
      newProduct: products,
      destination: destination ?? undefined,
    });

    res.status(201).json(updatedCart);
  } catch (error) {
    handleError(res, error, 400);
  }
};

export const getCartItems = async (req: Request, res: Response) => {
  const user_id = req.query.user_id as string; // Приведение к строке
  const restaurant_id = req.query.restaurant_id as string; // Приведение к строке
  const loc_change = req.query.loc_change === "true"; // Приведение к строке

  let delivery;
  let destination;

  if (loc_change) {
    try {
      delivery = await getDeliveryRules(Number(restaurant_id), Number(user_id));
      destination = await getDistance(
        Number(delivery?.restaurant.location.lat),
        Number(delivery?.restaurant.location.long),
        Number(delivery?.user.location.lat),
        Number(delivery?.user.location.long)
      );
    } catch (error) {
      console.error("ошибка получения getDeliveryRules в addToCart", error);
    }
  }

  try {
    const cartData: GetCartType | null = await CartService.getCartItems(
      user_id,
      restaurant_id,
      destination ?? undefined
    );

    if (!cartData) {
      throw new Error("Корзина не найдена");
    }

    const totalPrice = calcTotalPrice(cartData.products);

    const deliveryCoast = await getDeliveryPrice(
      cartData?.restaurant,
      totalPrice,
      parseFloat(cartData?.destination.distance || "0")
    );

    // if (cartData?.destination?.distance) {
    //   deliveryCoast = deliveryPrice({
    //     calculation_type: cartData?.delivery?.calculation_type,
    //     distance: cartData.destination?.distance,
    //     orderPrice: totalPrice ?? 0,
    //     price_per_km: cartData.delivery?.price_per_km,
    //     price_per_percent: cartData.delivery?.price_per_percent,
    //     reverse: cartData.delivery?.reverse_calculate,
    //   });
    // }

    res.status(200).json({
      products: cartData?.products || [],
      totalPrice,
      user: cartData?.user_id,
      vendor: cartData?.restaurant,
      id: cartData?.id,
      destination: cartData?.destination?.distance,
      delivery_price: deliveryCoast?.price || 0,
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
