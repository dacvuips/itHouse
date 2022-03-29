import { Context } from "../../helpers/graphql/context";
import { gql } from "apollo-server-express";
import { Schema } from "mongoose";

export enum RewardLogType {
  RETRIED = "RETRIED", // Đã trở lại
  USER = "USER", // Người dùng
}

export type RewardLog = {
  userId?: string; // ID người dùng
  rewardPoint?: number; // Số điểm thưởng
  createdAt?: Date; // Thời gian tạo
  type?: RewardLogType; // Loại thưởng
  orderId?: string; // ID đơn hàng
  note?: string; // Ghi chú
};

export const RewardLogSchema = new Schema({
  userId: { type: String, required: true },
  rewardPoint: { type: Number, default: 0 },
  createdAt: { type: Schema.Types.Date, default: Date.now },
  type: { type: Schema.Types.String, enum: Object.values(RewardLogType) },
  orderId: { type: String, required: true },
  note: { type: String },
});

export default {
  schema: gql`
    type RewardLog {
      " ID người dùng"
      userId: String
      " Số điểm thưởng"
      rewardPoint: Int
      " Thời gian tạo"
      createdAt: DateTime
      " Loại thưởng ${Object.values(RewardLogType)}"
      type: String
      " ID đơn hàng"
      orderId: String
      " Ghi chú"
      note: String
    }

    input RewardLogInput {
      " ID người dùng"
      userId: String
      " Số điểm thưởng"
      rewardPoint: Int
      " Thời gian tạo"
      createdAt: DateTime
      " Loại thưởng"
      type: String
      " ID đơn hàng"
      orderId: String
      " Ghi chú"
      note: String
    }
  `,
  resolvers: {},
};
