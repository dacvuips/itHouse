import { Context } from "../../helpers/graphql/context";
import { gql } from "apollo-server-express";
import { UserLoader } from "../user/user.model";
import { NotificationLoader, NotificationModel } from "./notification.model";
import { notificationService } from "./notification.service";
import _ from "lodash";
import firebase from "../../helpers/firebase";
import { json } from "express";

export default {
  schema: gql`
    extend type Mutation {
      sendNotify(data: SendNotifyInput): String
      updateNotify(id: ID!): String
    }
    input SendNotifyInput {
      userId: ID!
      title: String!
      body: String!
      image: String
      action: ActionInput
    }
    input UpdateNotifyInput {
      id: ID!
    }
  `,
  resolvers: {
    Mutation: {
      sendNotify: async (root: any, args: any, context: Context) => {
        // context.auth(["ADMIN"]);
        const { userId, title, body, image, action } = args.data;
        //Check user is exist

        sendNotify(userId, title, body);
        // const user = await UserLoader.load(userId);
        // if (!user) {
        //   throw new Error("User not found");
        // }
        // const notification = await NotificationModel.create({
        //   userId: user._id,
        //   title: title,
        //   body: body,
        //   image: image,
        //   read: false,
        //   action: action,
        // });

        // const deviceTokens = user.deviceTokens;
        // if (deviceTokens && deviceTokens.length > 0) {
        //   for (const token of deviceTokens) {
        //     const payload = {
        //       notification: {
        //         title: title,
        //         body: body,
        //       },
        //     };
        //     if (image) {
        //       _.set(payload, "notification.icon", image);
        //     }
        //     firebase.messaging().sendToDevice(token, payload);
        //   }
        // }
        // return "success";
      },

      updateNotify: async (root: any, args: any, context: Context) => {
        // context.auth(["ADMIN"]);
        const { id } = args;
        //Check user is exist
        const notify = await NotificationLoader.load(id);
        if (!notify) {
          throw new Error("Không có thông báo");
        }
        const _id = notify._id;
        const notification = await NotificationModel.updateOne(
          { _id: notify._id },
          {
            read: true,
          }
        );
        return "Cập nhật thành công";
      },
    },
  },
};

export async function sendNotify(
  userId: string,
  title: string,
  body: any
  // image?: string,
  // action?: any
) {
  const notification = await NotificationModel.create({
    userId: userId,
    title: title,
    body: body,
    // image: image,
    read: false,
    // action: action,
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
