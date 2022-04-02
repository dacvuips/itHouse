import { Context } from "../../helpers/graphql/context";
import { gql } from "apollo-server-express";
import { Schema } from "mongoose";
import { nanoid } from "nanoid";

export type Discount = {
  discountValue: number; // Giá trị khuyến mãi
  discountUnit?: string; // Đơn vị khuyến mãi
  maxDiscount?: number; // Giới hạn khuyến mãi
};

export const DiscountSchema = new Schema({
  discountValue: { type: Number, default: 0 },
  discountUnit: { type: String },
  maxDiscount: { type: Number, default: 0 },
});
export default {
  schema: gql`
    type Discount {
      " Giá trị khuyến mãi"
      discountValue: Float
      " Đơn vị khuyến mãi"
      discountUnit: String
      " Giới hạn khuyến mãi"
      maxDiscount: Int
    }
    input DiscountInput {
      discountValue: Float!
      " Đơn vị khuyến mãi"
      discountUnit: String
      " Giới hạn khuyến mãi"
      maxDiscount: Int
    }
  `,
  resolvers: {},
};
