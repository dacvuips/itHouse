import { User } from "./../user/user.model";

import { Document, Schema } from "mongoose";
import { BaseDocument } from "../../base/baseModel";
import { Mongo } from "../../helpers/mongo";
import { getModelDataLoader } from "../../helpers/dataloader";
import { Discount, DiscountSchema } from "./discount.graphql";
import userSchema from "../user/user.schema";

export enum PromotionType {
  PERCENT = "PERCENT", // Giảm theo phần trăm
  AMOUNT = "AMOUNT", // Giảm theo số tiền
  FREE = "FREE", // Giảm giá trực tiếp
}
export type Promotion = BaseDocument & {
  name?: string; // Tên
  description?: string; // Mô tả
  startDate?: string; // Ngày bắt đầu
  endDate?: string; // Ngày kết thúc
  active?: boolean; // Trạng thái
  discount?: Discount; // Giảm giá
  promotionType?: PromotionType; // Loại khuyến mãi
  promotionCode?: string; // Mã khuyến mãi
  userId?: [string]; // UserId
};

const promotionSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    startDate: { type: String, required: true },
    endDate: { type: String },
    active: { type: Boolean, default: false },
    promotionType: { type: String, required: true },
    promotionCode: { type: String, required: true },
    discount: { type: DiscountSchema },
    userId: { type: [Schema.Types.ObjectId], default: [] },
  },
  { timestamps: true }
);

promotionSchema.index({ name: "text" }, { weights: { name: 10 } });
export const PromotionModel = Mongo.model<Promotion>(
  "Promotion",
  promotionSchema
);

export const PromotionLoader = getModelDataLoader(PromotionModel);
