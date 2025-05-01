// controllers/notifyCourier.ts
import admin from "./firebase";

export const sendPushToCourier = async (deviceToken: string, orderId: number) => {
  const channel = [];

  const message = {
    token: deviceToken,
    notification: {
      title: "Новый заказ",
      body: `Заказ #${orderId} ожидает подтверждения`,
    },
    android: {
      notification: {
        channelId: "aurora", // должен совпадать с createChannel в notifee
        vibrateTimingsMillis: [300, 500],
        priority: "high" as "high",
        sound: "my_sound",
      },
    },
  };

  try {
    const response = await admin.messaging().send(message);
    console.log("Уведомление отправлено:");
  } catch (error) {
    console.error("Ошибка отправки уведомления:");
  }
};
