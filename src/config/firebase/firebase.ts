import admin from "firebase-admin";
import serviceAccount from "./aurora-couriers-firebase-adminsdk-fbsvc-7f82fcbb50.json";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

export default admin;
