import axios from "axios";
import { UserInfoType, UserLocationType } from "../controllers/orders/types";
import { Orders } from "../entities/Orders";
import { DeliveryData, DistanceMatrixResponse, DistanceResult, IGetPriceResponse, ProductItem } from "./types";
import dotenv from "dotenv";

dotenv.config();
const BASE_DJANGO = process.env.DJANGO_URL;
const API_KEY = process.env.GOOGLE_API_KEY;
interface UserInfo {
  fullName: string;
  location: UserLocationType;
}

interface UserChannel {
  user: number;
  fcm_token: string;
  device_type: string | null;
  device_model: string | null;
}

interface ChannelResponse {
  id: number;
  channels: UserChannel[];
}

interface VendorStatus {
  is_open: boolean;
  message: string;
  code: number;
}

export async function getUserInfo(userId: number): Promise<UserInfo> {
  try {
    // const userResponse = await axios.get<UserInfoType>(`https://new.aurora-api.uz/api/v1/auth/user/${userId}`);
    const userResponse = await axios.get<UserInfoType>(`${BASE_DJANGO}/v1/auth/user/${userId}`);
    const user = userResponse.data;

    return {
      fullName: `${user.first_name} ${user.last_name}`,
      location: user.location as UserLocationType,
    };
  } catch (error) {
    console.error("❌ Ошибка при получении пользователя:", error);
    return {
      fullName: "Unknown",
      location: { lat: "0", long: "0", address: "", user: 0 },
    };
  }
}

export async function getCourierInfo(userId: string): Promise<UserInfoType | null> {
  try {
    // const userResponse = await axios.get<UserInfoType>(`https://new.aurora-api.uz/api/v1/auth/user/${userId}`);
    const userResponse = await axios.get<UserInfoType>(`${BASE_DJANGO}/v1/auth/user/${userId}`);
    const user = userResponse.data;

    return user;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export const getChannel = async (id: number) => {
  try {
    const response = await axios.get<ChannelResponse>(`${BASE_DJANGO}/v1/restaurant/channel/${id}`);
    return response.data;
  } catch (error) {
    console.log("Channel error", error);
  }
};

export const getVendorStatus = async (id: number) => {
  try {
    const response = await axios.get<VendorStatus>(`${BASE_DJANGO}/v1/restaurant/${id}/status`);
    return response.data;
  } catch (error) {
    console.log("Channel error", error);
  }
};

export const notifyAboutNewOrder = async (order: Orders) => {
  try {
    await axios.post("https://notify.aurora-api.uz/fastapi/new-order", order);
  } catch (error) {
    console.error("Ошибка при отправке уведомления:", error);
  }
};

export const notifyAboutOrderStatusChange = async (order: Orders) => {
  try {
    const data = {
      id: order.id,
      orders_chat_id: order.orders_chat_id,
      courier: order.courier,
    };
    await axios.post("https://notify.aurora-api.uz/fastapi/accept-order", data);
  } catch (error) {
    console.error("Ошибка при отправке уведомления:", error);
  }
};

if (!API_KEY) {
  throw new Error("API ключ не найден в .env!");
}

export const getDistance = async (
  originLat: number,
  originLng: number,
  destLat: number,
  destLng: number
): Promise<DistanceResult | null> => {
  try {
    const response = await axios.get<DistanceMatrixResponse>(
      "https://maps.googleapis.com/maps/api/distancematrix/json",
      {
        params: {
          origins: `${originLat},${originLng}`,
          destinations: `${destLat},${destLng}`,
          key: API_KEY,
        },
      }
    );

    const data = response.data;
    const element = data.rows[0].elements[0];

    if (element.status !== "OK") {
      console.warn("Ошибка в элементе:", element.status);
      return null;
    }

    return {
      distance: element.distance.text,
      duration: element.duration.text,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios ошибка:", error.response?.data || error.message);
    } else {
      console.error("Неизвестная ошибка:", error);
    }
    return null;
  }
};

export const getProductById = async (id: number) => {
  try {
    const response = await axios.get<ProductItem>(`${BASE_DJANGO}/v1/menu/${id}`);
    return response.data;
  } catch (error) {
    console.error("Ошибка при получении продукта:", error);
    return null;
  }
};

export const getDeliveryRules = async (restaurant_id: number, user_id: number) => {
  try {
    const response = await axios.get<DeliveryData>(
      `${BASE_DJANGO}/v1/delivery/rule?restaurant_id=${restaurant_id}&user_id=${user_id}`
    );
    return response.data;
  } catch (error) {
    console.error("Ошибка при получении DeliveryRules", error);
  }
};

export const getDeliveryPrice = async (vendor_id: number, total_price: number, distance: number) => {
  try {
    const response = await axios.get<IGetPriceResponse>(
      `${BASE_DJANGO}/v1/delivery/calculate?vendor_id=${vendor_id}&order_cost=${total_price}&distance=${distance}`
    );
    return response.data;
  } catch (error) {
    console.error("Ошибка при получении getDeliveryPrice", error);
  }
};
