import { Context } from "../../helpers/graphql/context";
import { gql } from "apollo-server-express";
import { Schema } from "mongoose";

export type OrderItemAttribute = {
  attributeId?: string; //Mã thuộc tính
  attributeName?: string; //Tên thuộc tính
  attributePrice?: number; //Giá thuộc tính
  attributeOptionName?: string; //Tên tùy chọn thuộc tính
  attributeOptionPrice?: number; //Giá tùy chọn thuộc tính
};

export const OrderItemAttributeSchema = new Schema({
  attributeId: { type: String, required: true },

  attributeName: { type: String, required: true },

  attributePrice: { type: Number, default: 0 },

  attributeOptionName: { type: String, required: true },

  attributeOptionPrice: { type: Number, default: 0 },
});
export default {
  schema: gql`
    type OrderItemAttribute {
      "Mã thuộc tính"
      attributeId: String
      "Tên thuộc tính"
      attributeName: String
      "Giá thuộc tính"
      attributePrice: Float
      "Tên tùy chọn thuộc tính"
      attributeOptionName: [Mixed]
      "Giá tùy chọn thuộc tính"
      attributeOptionPrice: [Mixed]
    }
    input OrderItemAttributeInput {
      "Mã thuộc tính"
      attributeId: String
      "Tên thuộc tính"
      attributeName: String
      "Tên tùy chọn thuộc tính"
      attributeOptionName: [Mixed]
    }
  `,
  resolvers: {},
};
