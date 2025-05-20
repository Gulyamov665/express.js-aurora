// import admin from "./firebase";

// export const sendPushToCourier = async (deviceToken: string, orderId: number) => {
//   const message = {
//     token: deviceToken,
//     notification: {
//       title: "Новый заказ",
//       body: `Заказ #${orderId} ожидает подтверждения`,
//     },
//     android: {
//       notification: {
//         channelId: "aurora", // должен совпадать с createChannel в notifee
//         vibrateTimingsMillis: [300, 500],
//         priority: "high" as "high",
//         sound: "sound",
//       },
//     },
//   };

//   try {
//     const response = await admin.messaging().send(message);
//     console.log("Уведомление отправлено:");
//   } catch (error) {
//     console.error("Ошибка отправки уведомления:");
//   }
// };

import admin from "./firebase";

export const sendPushToCouriers = async (deviceTokens: string[], orderId: number) => {
  if (!deviceTokens.length) return;

  // Разбиваем токены на чанки по 500 (ограничение FCM)
  const CHUNK_SIZE = 500;

  const chunks = [];
  for (let i = 0; i < deviceTokens.length; i += CHUNK_SIZE) {
    chunks.push(deviceTokens.slice(i, i + CHUNK_SIZE));
  }

  const sendPromises = chunks.map((chunk) => {
    const message = {
      tokens: chunk,
      notification: {
        title: "Новый заказ",
        body: `Заказ #${orderId} ожидает подтверждения`,
      },
      android: {
        notification: {
          channelId: "aurora",
          vibrateTimingsMillis: [300, 500],
          priority: "high" as const,
          sound: "sound",
        },
      },
    };

    return admin.messaging().sendEachForMulticast(message);
  });

  try {
    const responses = await Promise.all(sendPromises);
    console.log(`Уведомления отправлены группам. Всего групп: ${responses.length}`);
  } catch (error) {
    console.error("Ошибка при отправке уведомлений:", error);
  }
};
