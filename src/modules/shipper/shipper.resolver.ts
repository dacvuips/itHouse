import { Context } from "../../helpers/graphql/context";
import { UserModel } from "../user/user.model";
import { ShipperModel } from "./shipper.model";
import { shipperService } from "./shipper.service";

export default {
  Query: {
    getAllShipper: async (root: any, args: any, context: Context) => {
      context.auth(["ADMIN"]);

      const { q } = args;
      return await shipperService.fetch(q);
    },
    getOneShipper: async (root: any, args: any, context: any) => {
      context.auth(["USER", "ADMIN", "SHIPPER"]);

      const { id } = args;

      return shipperService.findById(id);
    },
  },
  Mutation: {
    createShipper: async (root: any, args: any, context: Context) => {
      context.auth(["ADMIN", "USER"]);
      const { data } = args;

      const user = UserModel.findById(data.uid);
      if (!user) {
        throw new Error("User not found");
      }
      await UserModel.updateOne({ _id: data.uid }, { role: "SHIPPER" });

      const shipper = await shipperService.create(data);
      return shipper;
    },
    updateShipper: async (root: any, args: any, context: Context) => {
      context.auth(["ADMIN"]);
      const { id, data } = args;
      return await shipperService.update(id, data);
    },
    deleteShipper: async (root: any, args: any, context: any) => {
      context.auth(["ADMIN"]);

      const { uid } = args;

      const user = UserModel.find({ _id: uid });
      if (!user) {
        throw new Error("User not found");
      }
      await UserModel.updateOne({ _id: uid }, { role: "USER" });
      return await shipperService.delete(uid);
    },
  },
};
