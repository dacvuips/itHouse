import { Discount } from "./../promotion/discount.graphql";
import { Document, Schema } from "mongoose";
import { BaseDocument } from "../../base/baseModel";
import { Mongo } from "../../helpers/mongo";
import { getModelDataLoader } from "../../helpers/dataloader";
import { OrderItem, OrderItemSchema } from "./orderItem.graphql";
import { Branch } from "./branch/branch.model";

export enum OrderStatus {
  PENDING = "PENDING", // Chờ xử lý
  PROCESSING = "PROCESSING", // Đang xử lý
  SHOPPING = "SHOPPING", //Đang vận chuyển
  DELIVERED = "DELIVERED", // Đã giao hàng
  CANCELED = "CANCELED", // Đã hủy
}

export type Order = BaseDocument & {
  code?: string; //Mã đơn hàng
  buyerId?: string; //Mã khách hàng
  buyerName?: string; //Tên khách hàng
  buyerPhone?: string; //Số điện thoại khách hàng
  buyerAddress?: string; //Địa chỉ khách hàng
  buyerLocation?: any; //Vị trí khách hàng
  subtotal?: number; //Tổng tiền
  discount?: number; //Giảm giá
  shipfee?: number; //Phí vận chuyển
  amount?: number; //Tổng tiền sau khi giảm giá và phí vận chuyển
  status?: OrderStatus; //Trạng thái đơn hàng
  promotionName?: string; //Tên chương trình khuyến mãi
  promotionCode?: string; //Mã chương trình khuyến mãi
  promotionId?: string; //ID trình khuyến mãi
  rewardPoint?: number; //Điểm thưởng
  useRewardPoint?: boolean; //Sử dụng điểm thưởng
  rewardPointDiscount?: number; //Giảm giá điểm thưởng
  items?: OrderItem; //Danh sách sản phẩm
  branch?: Branch; //Cửa hàng
  distance?: number; //Khoảng cách
  discountInfo?: Discount; //Thông tin giảm giá
  shipfeePerKm?: number; //Phí vận chuyển
};

const orderSchema = new Schema(
  {
    code: { type: String, required: true },

    buyerId: { type: Schema.Types.ObjectId, required: true },

    buyerName: { type: String, required: true },

    buyerPhone: { type: String, required: true },

    buyerAddress: { type: String, required: true },

    buyerLocation: { type: Schema.Types.Mixed, required: true },

    subtotal: { type: Number, default: 0 },

    discount: { type: Number, default: 0 },

    shipfee: { type: Number, default: 0 },

    amount: { type: Number, default: 0 },

    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.PENDING,
    },

    promotionName: { type: String },

    promotionCode: { type: String },

    promotionId: { type: Schema.Types.ObjectId },

    rewardPoint: { type: Number, default: 0 },

    useRewardPoint: { type: Boolean, default: false },

    rewardPointDiscount: { type: Number, default: 0 },

    items: { type: [OrderItemSchema], default: [] },
    branchId: { type: Schema.Types.ObjectId, required: true },
    distance: { type: Number, default: 0 },
    discountInfo: { type: Schema.Types.Mixed, default: {} },
    shipfeePerKm: { type: Number, default: 0 },
  },
  { timestamps: true }
);

orderSchema.index({ code: 1 }, { unique: true });
orderSchema.index({ code: "text" }, { weights: { code: 10 } });

export const OrderModel = Mongo.model<Order>("Order", orderSchema);

export const OrderLoader = getModelDataLoader(OrderModel);
