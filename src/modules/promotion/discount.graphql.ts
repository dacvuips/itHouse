import { Context } from "../../helpers/graphql/context";
import { gql } from "apollo-server-express";
import { Schema } from "mongoose";
import { nanoid } from "nanoid";

export enum DiscountType {
  PERCENT = "PERCENT", // Giảm theo phần trăm
  AMOUNT = "AMOUNT", // Giảm theo số tiền
  FREE = "FREE", // Giảm giá trực tiếp
}

export type Discount = {
  discountId?: string; // Mã khuyến mãi
  discountName?: string; // Tên khuyến mãi
  discountType?: DiscountType; // Loại khuyến mãi
  discountValue: number; // Giá trị khuyến mãi
  discountUnit?: string; // Đơn vị khuyến mãi
  maxDiscount?: number; // Giới hạn khuyến mãi
};

export const DiscountSchema = new Schema({
  discountId: { type: String, required: true },
  discountName: { type: String },
  discountType: {
    type: String,
    required: true,
    enum: Object.values(DiscountType),
  },
  discountValue: { type: Number, default: 0 },
  discountUnit: { type: String },
  maxDiscount: { type: Number, default: 0 },
});
export default {
  schema: gql`
    type Discount {
      " Mã khuyến mãi"
      discountId: String
      " Tên khuyến mãi"
      discountName: String
      " Loại khuyến mãi ${Object.values(DiscountType)}" 
      discountType: String
      " Giá trị khuyến mãi"
      discountValue: Float
      " Đơn vị khuyến mãi"
      discountUnit: String
      " Giới hạn khuyến mãi"
      maxDiscount: Int
    }
    input DiscountInput {
      " Mã khuyến mãi"
      discountId: String
      " Tên khuyến mãi"
      discountName: String
      " Loại khuyến mãi"
      discountType: String
      " Giá trị khuyến mãi"
      discountValue: Float!
      " Đơn vị khuyến mãi"
      discountUnit: String
      " Giới hạn khuyến mãi"
      maxDiscount: Int
    }
  `,
  resolvers: {},
};
