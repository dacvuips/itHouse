import { gql } from "apollo-server-express";
import firebase from "../../../helpers/firebase";
import Token from "../../../helpers/token";
import { NotificationModel } from "../../notifycation/notification.model";
import { UserLoader, UserModel, UserRole } from "../user.model";
import { userService } from "../user.service";

export default {
  schema: gql`
    type Mutation {
      loginUserByFirebase(accessToken: String!): LoginUserData
    }

    type LoginUserData {
      user: User
      token: String
    }
  `,
  resolvers: {
    Mutation: {
      loginUserByFirebase: async (root: any, args: any, context: any) => {
        const { accessToken } = args;

        const decodedToken = await firebase.auth().verifyIdToken(accessToken);
        console.log(decodedToken);
        console.log(decodedToken.uid);
        // Step 1: check if user has uid in database
        let user = await UserModel.findOne({ uid: decodedToken.uid });
        if (!user) {
          switch (decodedToken.firebase.sign_in_provider) {
            case "password":
              user = await UserModel.create({
                uid: decodedToken.uid,
                username: decodedToken.email,
                name: decodedToken.email,
                email: decodedToken.email,
                phone: "",
                password: null,
                role: UserRole.USER,
                signInProvider: "password",
              });
              break;
            case "phone":
              user = await UserModel.create({
                uid: decodedToken.uid,
                username: decodedToken.phone_number,
                name: decodedToken.phone_number,
                email: null,
                phone: decodedToken.phone_number,
                password: null,
                role: UserRole.USER,
                signInProvider: "phone",
              });
              break;
            case "google.com":
              user = await UserModel.create({
                uid: decodedToken.uid,
                username: decodedToken.email,
                name: decodedToken.name || decodedToken.email,
                email: decodedToken.email,
                phone: decodedToken.phone_number,
                password: null,
                role: UserRole.USER,
                signInProvider: "google.com",
              });
              break;
            default:
              throw Error("Sign in provider not supported");
          }
        }

        // Step 2: create token
        const token = new Token(user._id, user.role!, { scopes: user.scopes });
        const User = await userService.findById(user._id);

        sendNotify(
          `${User.name}`,
          `Chào mừng ${User.name} tham gia vào hệ thống`,
          `Đăng ký thành công`,
          user._id
        );
        return {
          user: user,
          token: token.sign(),
        };
      },
    },
  },
};

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
      type: "USER",
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
