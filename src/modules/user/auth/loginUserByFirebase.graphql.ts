import { UserRole } from "./../user.model";
import { gql } from "apollo-server-express";
import firebase from "../../../helpers/firebase";
import { UserModel } from "../user.model";
import Token from "../../../helpers/token";

export default {
  schema: gql`
    type Mutation {
      loginUserByFirebase(accessToken: String): LoginUserData
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
            default: {
              throw Error("Sign in provider not supported");
            }
          }
        }

        const token = new Token(user._id, user.role!, { scopes: user.scopes });
        return {
          user: user,
          token: token.sign(),
        };
      },
    },
  },
};
