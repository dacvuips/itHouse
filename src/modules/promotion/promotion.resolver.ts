import { Context } from "../../helpers/graphql/context";
import { PromotionModel } from "./promotion.model";
import { promotionService } from "./promotion.service";
import _ from "lodash";
export default {
  Query: {
    getAllPromotion: async (root: any, args: any, context: Context) => {
      const { q } = args;
      if (!context.isAdmin) {
        _.set(q, "filter.active", true);
      }
      return await promotionService.fetch(q);
    },
    getOnePromotion: async (root: any, args: any, context: any) => {
      const { id } = args;

      return promotionService.findById(id);
    },
  },
  Mutation: {
    createPromotion: async (root: any, args: any, context: Context) => {
      context.auth(["ADMIN"]);

      const { data } = args;
      if (!data.discount.discountId) {
        data.discount.discountId = promotionService.generateCode();
      }
      const promotion = await promotionService.create(data);
      return promotion;
    },
    updatePromotion: async (root: any, args: any, context: Context) => {
      context.auth(["ADMIN"]);
      const { id, data } = args;
      return await promotionService.update(id, data);
    },
    deletePromotion: async (root: any, args: any, context: any) => {
      context.auth(["ADMIN"]);
      const { id } = args;
      return await promotionService.delete(id);
    },
  },
};
