import { Document, Schema } from "mongoose";
import { BaseDocument } from "../../../base/baseModel";
import { getModelDataLoader } from "../../../helpers/dataloader";
import { Mongo } from "../../../helpers/mongo";

export type Category = BaseDocument & {
  name?: string; // Tên danh mục
  description?: string; // Mô tả
  active?: boolean; // Trạng thái
  priority?: number; // Ưu tiên
  production?: string[]; // Nhà sản xuất
};

const categorySchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    active: { type: Boolean, default: false },
    priority: { type: Number, default: 0 },
    productionIds: { type: [Schema.Types.ObjectId], default: [] },
  },
  { timestamps: true }
);
categorySchema.index({ name: "text" }, { weights: { name: 10 } });
categorySchema.index({ priority: 1 });
categorySchema.index({ name: 1 }, { unique: true });
export const CategoryModel = Mongo.model<Category>("Category", categorySchema);
export const CategoryLoader = getModelDataLoader(CategoryModel);
