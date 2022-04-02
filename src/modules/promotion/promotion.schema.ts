import { Mixed } from "mongoose";
import { gql } from "apollo-server-express";
import { PromotionType } from "./promotion.model";

export default gql`
  extend type Query {
    getAllPromotion(q: QueryInput): PromotionPageData
    getOnePromotion(id: ID!): Promotion
  }
  extend type Mutation {
    createPromotion(data: CreatePromotionInput!): Promotion
    updatePromotion(id: ID!, data: UpdatePromotionInput!): Promotion
    deletePromotion(id: ID!): Boolean
  }
  type PromotionPageData {
    data: [Promotion]
    pagination: Pagination
  }
  type Promotion {
    id: ID!
    createdAt: DateTime
    updatedAt: DateTime
    " Tên"
    name: String!
    " Mô tả"
    description: String
    " Ngày bắt đầu"
    startDate: String!
    " Ngày kết thúc"
    endDate: String
    " Trạng thái"
    active: Boolean
    " Giảm giá"
    discount: Discount
    "Loại khuyến mãi ${Object.values(PromotionType)}"
    promotionType: String
    " Mã khuyến mãi"
    promotionCode: String
    "UserId"
    userId: String
  }
  input PromotionInput {
    " Tên"
    name: String!
    " Mô tả"
    description: String
    " Ngày bắt đầu"
    startDate: String!
    " Ngày kết thúc"
    endDate: String
    " Trạng thái"
    active: Boolean
    " Giảm giá"
    discount: DiscountInput
    "Loại khuyến mãi ${Object.values(PromotionType)}"

    promotionType: String
    " Mã khuyến mãi"
    promotionCode: String
  }

  input CreatePromotionInput {
    " Tên"
    name: String!
    " Mô tả"
    description: String
    " Ngày bắt đầu"
    startDate: String!
    " Ngày kết thúc"
    endDate: String
    " Trạng thái"
    active: Boolean
    " Giảm giá"
    discount: DiscountInput
    "Loại khuyến mãi ${Object.values(PromotionType)}"

    promotionType: String
    " Mã khuyến mãi"
    promotionCode: String
  }

  input UpdatePromotionInput {
    name: String
    " Mô tả"
    description: String
    " Ngày bắt đầu"
    startDate: String
    " Ngày kết thúc"
    endDate: String
    " Trạng thái"
    active: Boolean
    " Giảm giá"
    discount: DiscountInput
    "Loại khuyến mãi ${Object.values(PromotionType)}"
    promotionType: String
    "Mã khuyến mãi"
    promotionCode: String
  }
`;
