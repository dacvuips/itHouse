import { Document, Schema } from "mongoose";
import { BaseDocument } from "../../base/baseModel";
import { Mongo } from "../../helpers/mongo";
import { getModelDataLoader } from "../../helpers/dataloader";
import { Discount, DiscountSchema } from "./discount.graphql";

export type Promotion = BaseDocument & {
  name?: string; // Tên
  description?: string; // Mô tả
  startDate?: string; // Ngày bắt đầu
  endDate?: string; // Ngày kết thúc
  active?: boolean; // Trạng thái
  discount?: Discount; // Giảm giá
};

const promotionSchema = new Schema(
  {
    name: { type: String, required: true },

    description: { type: String },
    startDate: { type: String, required: true },
    endDate: { type: String },
    active: { type: Boolean, default: false },
    discount: { type: DiscountSchema },
  },
  { timestamps: true }
);

promotionSchema.index({ name: "text" }, { weights: { name: 10 } });
export const PromotionModel = Mongo.model<Promotion>(
  "Promotion",
  promotionSchema
);

export const PromotionLoader = getModelDataLoader(PromotionModel);
