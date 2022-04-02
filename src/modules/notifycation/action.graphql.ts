import { PromotionLoader } from "./../promotion/promotion.model";
import { Context } from "../../helpers/graphql/context";
import { gql } from "apollo-server-express";
import { Schema } from "mongoose";
import { GraphqlResolver } from "../../helpers/graphql/resover";
import { OrderLoader } from "../order/order.model";
import { ProductLoader } from "../product/product.model";

export enum ActionType {
  ORDER = "ORDER", //Đặt hàng
  PRODUCT = "PRODUCT", //Sản phẩm
  PROMOTION = "PROMOTION", //Khuyến mãi
  WEBSITE = "WEBSITE", //Trang web
  NONE = "NONE", //Không có
  USER = "USER", //Người dùng
}

export type Action = {
  type?: ActionType; //Loại hành động
  orderId?: string; //Mã đơn hàng
  productId?: string; //Mã sản phẩm
  promotionId?: string; //Mã khuyến mãi
  websiteUrl?: string; // Đường dẫn trang web
};

export const ActionSchema = new Schema({
  type: {
    type: String,
    enum: Object.values(ActionType),
    default: ActionType.NONE,
  },
  orderId: { type: Schema.Types.ObjectId },
  productId: { type: Schema.Types.ObjectId },
  promotionId: { type: Schema.Types.ObjectId },
  websiteUrl: { type: String },
});
export default {
  schema: gql`
    type Action {
      "Loại hành động ${Object.values(ActionType)}"
      type: String
      "Mã đơn hàng"
      orderId: ID
      "Mã sản phẩm"
      productId: ID
      "Mã khuyến mãi"
      promotionId: ID
      " Đường dẫn trang web"
      websiteUrl: String
      "Đơn hàng"
      order: Order
      "Sản phẩm"
      product: Product

      "Khuyến mãi"
      promotion: Promotion
    }

    input ActionInput {
      "Loại hành động ${Object.values(ActionType)}"
      type: String
      "Mã đơn hàng"
      orderId: ID
      "Mã sản phẩm"
      productId: ID
      "Mã khuyến mãi"
      promotionId: ID
      " Đường dẫn trang web"
      websiteUrl: String
      
      
    }
  `,
  resolvers: {
    Action: {
      order: GraphqlResolver.load(OrderLoader, "orderId"),
      product: GraphqlResolver.load(ProductLoader, "productId"),
      promotion: GraphqlResolver.load(PromotionLoader, "promotionId"),
    },
  },
};
