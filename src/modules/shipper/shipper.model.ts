import { Order } from "./../order/order.model";
import { Document, Schema } from "mongoose";
import { BaseDocument } from "../../base/baseModel";
import { Mongo } from "../../helpers/mongo";
import { getModelDataLoader } from "../../helpers/dataloader";

export enum Company {
  GRAB = "GRAB",
  AHAMOVEL = "AHAMOVEL",
  BEE = "BEE",
  BEMINE = "BEMINE",
  GOJEK = "GOJEK",
  NOW = "NOW",
}
export enum Status {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  DELETED = "DELETED",
}
export type Shipper = BaseDocument & {
  uid?: string; // UID của người dùng
  shipperName?: string; //Tên nhà vận chuyển
  shipperPhone?: string; //Số điện thoại
  shipperAddress?: string; //Địa chỉ
  shipperEmail?: string; //Email
  shipperDescription?: string; //Mô tả
  shipperLogo?: string; //Logo
  shipperStatus?: Status; //Trạng thái
  licensePlates?: string; //Biển số xe
  deliverCompany?: Company; //Mã công ty
  rate?: number; //Đánh giá
};

const shipperSchema = new Schema(
  {
    uid: { type: String, required: true },
    shipperName: { type: String, required: true },
    shipperPhone: { type: Number, required: true },
    shipperAddress: { type: String },
    shipperEmail: { type: String },
    shipperDescription: { type: String },
    shipperLogo: { type: String },
    shipperStatus: {
      type: String,
      required: true,
      enum: Object.values(Status),
      default: Status.ACTIVE,
    },
    licensePlates: { type: String, required: true },
    deliverCompany: {
      type: String,
      required: true,
      enum: Object.values(Company),
    },
    rate: { type: Number, default: 0 },
  },
  { timestamps: true }
);

shipperSchema.index({ shipperName: 1 }, { unique: true });
shipperSchema.index({ shipperName: "text" });

export const ShipperModel = Mongo.model<Shipper>("Shipper", shipperSchema);

export const ShipperLoader = getModelDataLoader(ShipperModel);
