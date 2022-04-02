import { nanoid } from "nanoid";
import { Schema } from "mongoose";
import { Context } from "../../helpers/graphql/context";
import { gql } from "apollo-server-express";

export type OrderAttributeOption = {
  attributeOptionId?: string; //Mã tùy chọn thuộc tính
  attributeOptionName?: string; //Tên tùy chọn thuộc tính
  attributeOptionPrice?: number; //Giá tùy chọn thuộc tính
  attributeOptionImage?: string; //Ảnh tùy chọn thuộc tính
  attributeOptionDescription?: string; //Mô tả tùy chọn thuộc tính
};

export const OrderAttributeOptionSchema = new Schema({
  attributeOptionId: { type: String, required: true },

  attributeOptionName: { type: String, required: true },
  attributeOptionPrice: { type: String, default: 0 },
  attributeOptionImage: { type: String },
  attributeOptionDescription: { type: String },
});
export default {
  schema: gql`
    type OrderAttributeOption {
      "Mã tùy chọn thuộc tính  "
      attributeOptionId: String
      "Tên tùy chọn thuộc tính "
      attributeOptionName: String
      "Giá tùy chọn thuộc tính"
      attributeOptionPrice: Float
      "Ảnh tùy chọn thuộc tính"
      attributeOptionImage: String
      "Mô tả tùy chọn thuộc tính"
      attributeOptionDescription: String
    }
    input OrderAttributeOptionInput {
      "Mã tùy chọn thuộc tính  "
      attributeOptionId: String
      "Tên tùy chọn thuộc tính "
      attributeOptionName: String
      "Giá tùy chọn thuộc tính"
      attributeOptionPrice: Float
      "Ảnh tùy chọn thuộc tính"
      attributeOptionImage: String
      "Mô tả tùy chọn thuộc tính"
      attributeOptionDescription: String
    }
  `,
  resolvers: {},
};
