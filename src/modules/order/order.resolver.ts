import { User } from "./../user/user.model";
import { NotificationModel } from "../notifycation/notification.model";
import { OrderItem } from "./orderItem.graphql";
import _, { identity } from "lodash";
import { Context } from "../../helpers/graphql/context";
import { GraphqlResolver } from "../../helpers/graphql/resover";
import { ProductLoader } from "../product/product.model";
import { UserLoader, UserModel } from "../user/user.model";
import { OrderModel, OrderStatus } from "./order.model";
import { orderService } from "./order.service";
import { OrderItemAttribute } from "./orderItemAttribute.graphql";
import { BranchLoader } from "./branch/branch.model";
import { nanoid } from "nanoid";
import {
  Promotion,
  PromotionLoader,
  PromotionModel,
} from "../promotion/promotion.model";

import firebase from "../../helpers/firebase";
import { userService } from "../user/user.service";
import console from "console";

export default {
  Query: {
    getAllOrder: async (root: any, args: any, context: Context) => {
      context.auth(["ADMIN", "USER"]);

      const { q } = args;
      if (!context.isAdmin) {
        _.set(args, "q.filter.buyerId", context.userId);
      }
      return await orderService.fetch(q);
    },
    getOneOrder: async (root: any, args: any, context: any) => {
      const { id } = args;

      return orderService.findById(id);
    },
  },
  Mutation: {
    createOrder: async (root: any, args: any, context: Context) => {
      context.auth(["ADMIN", "USER"]);
      const { data } = args;
      let buyerId = data.buyerId;
      if (!context.isAdmin) {
        buyerId = context.userId;
      }
      //Check buyerId is exist
      const user = await UserLoader.load(buyerId);
      if (!user) {
        throw new Error("Không tìm thấy user");
      }
      // Get Promotions and check is valid
      let rewardPointDiscount = 0;
      if (data.useRewardPoint === true) {
        const user: any = await UserModel.find({ _id: buyerId });
        rewardPointDiscount = user[0].rewardPointDiscount! * 1000;
        await UserModel.findByIdAndUpdate(buyerId, {
          $set: {
            rewardPointDiscount: 0,
          },
        });
      }

      // pase items
      const orderItems: OrderItem[] = await getOrderItems(data);
      //branch is exist
      const branch = await BranchLoader.load(data.branchId);
      if (!branch) {
        throw new Error("Không tìm thấy chi nhánh");
      }
      if (!branch.active) {
        throw new Error("Chi nhánh không hoạt động");
      }
      //check distance is valid
      const branchLat = branch.place?.location.coordinates[1];
      const branchLng = branch.place?.location.coordinates[0];
      const buyerLat = data.buyerLocation.coordinates[1];
      const buyerLng = data.buyerLocation.coordinates[0];
      const distance = await getDistance(
        branchLat,
        branchLng,
        buyerLat,
        buyerLng
      );
      console.log(distance);
      if (distance > 10) {
        throw new Error("Khoảng cách quá xa");
      }

      const shipfee = Math.round(branch.shipfeePerKm! * distance);
      // TODO: calculate discount
      // const discount = 0;

      const rewardPoint = 0;

      // TODO: calculate reward point

      const subtotal = _.sumBy(orderItems, "amount");

      // PROMOTION
      const promotionCode = data.promotionCode;
      if (!promotionCode) {
        throw new Error("Không có khuyến mãi");
      }
      const promotion = await PromotionModel.findOne({
        promotionCode: promotionCode,
      });
      if (!promotion) {
        throw new Error("Không tìm thấy khuyến mãi");
      }
      const discount = promotion.discount?.discountValue!;

      // Check Subtotal is more than discount
      if (subtotal < rewardPointDiscount + discount) {
        throw new Error("Giá trị khuyến mãi không hợp lệ");
      }
      let amount = 0;
      if (
        promotion.promotionType == "FREE" ||
        promotion.promotionType == "AMOUNT"
      ) {
        if (discount >= promotion.discount?.maxDiscount!) {
          amount =
            subtotal +
            shipfee -
            promotion.discount?.maxDiscount! -
            rewardPointDiscount;
        } else {
          amount = subtotal + shipfee - discount! - rewardPointDiscount;
        }
      } else {
        if (discount >= promotion.discount?.maxDiscount!) {
          amount =
            subtotal * ((100 - promotion.discount?.maxDiscount!) / 100) +
            shipfee -
            rewardPointDiscount;
        } else {
          amount =
            subtotal * ((100 - discount!) / 100) +
            shipfee -
            rewardPointDiscount;
        }
      }

      const order = await orderService.create({
        code: nanoid(),
        buyerId: buyerId,
        buyerName: data.buyerName,
        buyerPhone: data.buyerPhone,
        buyerAddress: data.buyerAddress,
        buyerLocation: data.buyerLocation,
        subtotal: subtotal,
        discount: discount,

        discountInfo: {
          discountValue: promotion.discount?.discountValue,
          discountUnit: promotion.discount?.discountUnit,
        },

        shipfeePerKm: branch.shipfeePerKm,
        distance: distance,
        shipfee: shipfee,
        amount: amount,
        status: OrderStatus.PENDING,
        promotionCode: data.promotionCode,
        promotionName: promotion.name,
        rewardPoint: rewardPoint,
        useRewardPoint: data.useRewardPoint,
        rewardPointDiscount: rewardPointDiscount,
        branchId: branch._id,
        items: orderItems,
      });
      function getDistance(x1: number, x2: number, y1: number, y2: number) {
        let x = x1 - x2;
        let y = y1 - y2;

        return Math.sqrt(x * x + y * y) / 100;
      }

      sendNotify(
        `${order.buyerId}`,
        `Chúc mừng khách hàng ${order.buyerName} tạo đơn hàng thành công`,
        `Đơn hàng đã tạo thành công bởi chờ đợi xác nhận từ cửa hàng`,
        order._id
      );

      return order;
    },
    updateOrder: async (root: any, args: any, context: Context) => {
      context.auth(["ADMIN", "SHIPPER"]);

      const { id, data } = args;
      const order = await orderService.findById(id);

      sendNotify(
        `${order.buyerId}`,
        `Cập nhật đơn hàng của khách hàng ${order.buyerName}`,
        `Đơn hàng đã cập nhật thành ${data.status}`,
        id
      );
      if (data.status == OrderStatus.DELIVERED) {
        const user: any = await UserModel.find({ _id: order.buyerId });

        await UserModel.findByIdAndUpdate(order.buyerId, {
          $set: { rewardPointDiscount: user[0].rewardPointDiscount + 1 },
        });
        await PromotionModel.findByIdAndUpdate(order.promotionCode, {
          $set: { active: false },
        });
        sendNotify(
          `${order.buyerId}`,
          `Đơn hàng của khách hàng ${order.buyerName} đã giao`,
          `Đơn hàng đã giao thành công`,
          id
        );
      }

      return await orderService.update(id, data);
    },
    deleteOrder: async (root: any, args: any, context: any) => {
      context.auth(["ADMIN"]);
      const { id } = args;
      return await orderService.delete(id);
    },
  },
  Order: {
    buyerUser: GraphqlResolver.load(UserLoader, "buyerId"),
    branch: GraphqlResolver.load(BranchLoader, "branchId"),
  },
};

async function getOrderItems(data: any) {
  const items = data.items;
  //Check items is empty

  if (!items || items.length === 0) {
    throw new Error("Không có sản phẩm");
  }
  // get Product ID
  const productIds = items.map((item: any) => item.productId);
  const products = await ProductLoader.loadMany(productIds);
  const productMap = _.keyBy(products, "id");
  const orderItems: OrderItem[] = [];

  for (const item of items) {
    const product = productMap[item.productId];
    if (!product || product instanceof Error) {
      throw new Error("Không tìm thấy sản phẩm");
    }
    const orderItem: OrderItem = {
      productId: item.productId,
      productName: product.name,
      productImage: product.images ? product.images[0] : "",
      productPrice: product.basePrice,
      productSellPrice: product.sellPrice,
      qty: item.qty,
      amount: 0,
      attrAmount: 0,
      attrs: [],
    };
    orderItem.attrAmount = 0;
    if (item.attrs?.length > 0) {
      const productAttrisMap = _.keyBy(product.attributes, "name");
      const orderItemAttris: OrderItemAttribute[] = [];
      let attrAmount = 0;
      for (const attrs of item.attrs) {
        //check attr is exist

        const productAttrs = productAttrisMap[attrs.attributeName];
        if (!productAttrs) {
          throw new Error("Không tìm thấy thuộc tính ");
        }

        //  Check Option by attrOptionName
        const productAttrOption = productAttrs.options.find(
          (o) => o.name == attrs.attributeOptionName
        );
        if (!productAttrOption) {
          throw new Error("Không tìm thấy thuộc tính");
        }
        console.log(productAttrOption);

        attrAmount += productAttrOption.price!;
        orderItemAttris.push({
          attributeId: productAttrs._id,
          attributeName: productAttrs.name,
          attributeOptionName: productAttrOption.name,
          attributeOptionPrice: productAttrOption.price,
        });
      }
      orderItem.attrs = orderItemAttris;
      orderItem.attrAmount = attrAmount;
    }

    // Calculate orderItem amount
    orderItem.amount =
      (orderItem.productSellPrice! + orderItem.attrAmount) * orderItem.qty!;

    orderItems.push(orderItem);
  }

  return orderItems;
}

export async function sendNotify(
  userId: string,
  title: string,
  body: any,
  // image?: string,
  id: string
) {
  const notification = await NotificationModel.create({
    userId: userId,
    title: title,
    body: body,
    // image: image,
    read: false,
    action: {
      type: "ORDER",
      orderId: id,
    },
  });
  const user = await UserLoader.load(userId);
  if (!user) {
    throw new Error("User not found");
  }
  const deviceTokens = user.deviceTokens;
  if (deviceTokens && deviceTokens.length > 0) {
    for (const token of deviceTokens) {
      const payload = {
        notification: {
          title: title,
          body: body,
        },
      };
      // if (image) {
      //   _.set(payload, "notification.icon", image);
      // }
      firebase.messaging().sendToDevice(token, payload);
    }
  }

  return "success";
}
