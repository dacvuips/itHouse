import {
  AttributeOption,
  AttributeOptionSchema,
} from "./attributeOption.graphql";
import { gql } from "apollo-server-express";
import { Schema } from "mongoose";

export type Attribute = {
  _id?: string;
  name?: string; //Tên thuộc tính
  required?: boolean; //Trạng thái bắt buộc
  min?: number; // Số lượng option tối thiểu
  max?: number; // Số lượng option tối đa
  options: AttributeOption[]; //Option
};

export const AttributeSchema = new Schema({
  name: { type: String, required: true },
  required: { type: Boolean, default: false },
  min: { type: Number, default: 0 },
  max: { type: Number, default: 0 },
  options: { type: [AttributeOptionSchema], default: [] },
});
export default {
  schema: gql`
    type Attribute {
      id: ID
      "Tên thuộc tính"
      name: String
      "Trạng thái bắt buộc"
      required: Boolean
      "Số lượng option tối thiểu"
      min: Int
      "Số lượng option tối đa"
      max: Int
      "Option"
      options: [AttributeOption]
    }

    input AttributeInput {
      "Tên thuộc tính"
      name: String
      "Trạng thái bắt buộc"
      required: Boolean
      "Số lượng option tối thiểu"
      min: Int
      "Số lượng option tối đa"
      max: Int
      "Option"
      options: [AttributeOptionInput]
    }
  `,
  resolve: {},
};
