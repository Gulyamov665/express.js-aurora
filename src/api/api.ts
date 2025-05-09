import axios from "axios";
import { UserInfoType, UserLocationType } from "../controllers/orders/types";
import { Orders } from "../entities/Orders";

interface UserInfo {
  fullName: string;
  location: UserLocationType;
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
