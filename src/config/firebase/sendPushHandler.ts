import admin from "./firebase";

export const sendPushToCouriers = async (deviceTokens: string[], orderId: number) => {
  if (!deviceTokens.length) return;

  const message = {
    tokens: deviceTokens,
    notification: {
      title: "Новый заказ",
      body: `Заказ #${orderId} ожидает подтверждения`,
    },
    data: {
      title: "Новый заказ",
      body: `Заказ #${orderId} ожидает подтверждения`,
      orderId: orderId.toString(),
    },
    android: {
      notification: {
        channelId: "aurora",
        vibrateTimingsMillis: [300, 500],
        priority: "high" as const,
        sound: "sound",
      },
      priority: "high" as const,
      ttl: 3600 * 1000, // 1 час в миллисекундах
    },
  };

  try {
    const response = await admin.messaging().sendEachForMulticast(message);
    console.log(`Уведомления отправлены. Success: ${response.successCount}, Failure: ${response.failureCount}`);
  } catch (error) {
    console.error("Ошибка при отправке уведомлений:", error);
  }
};
