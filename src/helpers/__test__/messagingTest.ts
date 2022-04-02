import { UserLoader } from "./../../modules/user/user.model";
import { NotificationModel } from "../../modules/notifycation/notification.model";
import firebase from "../firebase";

export async function sendNotify(
  userId: string,
  title: string,
  body: any,
  // image?: string,
  id: string
) {
  const notification = await NotificationModel.create({
    userId: userId,
    title: title,
    body: body,
    // image: image,
    read: false,
    action: {
      type: "ORDER",
      orderId: id,
    },
  });
  const user = await UserLoader.load(userId);
  if (!user) {
    throw new Error("User not found");
  }
  const deviceTokens = user.deviceTokens;
  if (deviceTokens && deviceTokens.length > 0) {
    for (const token of deviceTokens) {
      const payload = {
        notification: {
          title: title,
          body: body,
        },
      };
      // if (image) {
      //   _.set(payload, "notification.icon", image);
      // }
      firebase.messaging().sendToDevice(token, payload);
    }
  }

  return "success";
}
