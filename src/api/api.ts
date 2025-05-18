import axios from "axios";
import { UserInfoType, UserLocationType } from "../controllers/orders/types";
import { Orders } from "../entities/Orders";
import { DistanceMatrixResponse, DistanceResult } from "./types";
import dotenv from "dotenv";

dotenv.config();

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

export async function getUserInfo(userId: number): Promise<UserInfo> {
  try {
    // const userResponse = await axios.get<UserInfoType>(`https://new.aurora-api.uz/api/v1/auth/user/${userId}`);
    const userResponse = await axios.get<UserInfoType>(`https://stage.aurora-api.uz/api/v1/auth/user/${userId}`);
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

export const getChannel = async (id: number) => {
  try {
    const response = await axios.get<ChannelResponse[]>(
      `https://stage.aurora-api.uz/api/v1/restaurant/channel/?id=${id}`
    );
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

const API_KEY = process.env.GOOGLE_API_KEY;

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
