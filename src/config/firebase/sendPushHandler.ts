// controllers/notifyCourier.ts
import admin from "./firebase";

export const sendPushToCourier = async (deviceToken: string, orderId: number) => {
  const message = {
    notification: {
      title: "Новый заказ",
      body: `Заказ #${orderId} ожидает подтверждения`,
    },
    token: deviceToken,
  };

  try {
    const response = await admin.messaging().send(message);
    console.log("Уведомление отправлено:", response);
  } catch (error) {
    console.error("Ошибка отправки уведомления:", error);
  }
};
