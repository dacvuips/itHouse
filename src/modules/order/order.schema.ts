import { OrderItem } from "./orderItem.graphql";
import { gql } from "apollo-server-express";
import { OrderStatus } from "./order.model";

export default gql`
    
    extend type Query {
        getAllOrder(q: QueryInput): OrderPageData
        getOneOrder(id: ID!): Order
    }
    extend type Mutation {
        createOrder(data: CreateOrderInput!): Order
        updateOrder(id: ID!, data: UpdateOrderInput!): Order
        deleteOrder(id: ID!): Boolean
    }
    type OrderPageData {
        data: [Order]
        pagination: Pagination
    }
    type Order {
        id: ID!
        createdAt: DateTime
        updatedAt: DateTime
        "Mã đơn hàng"
        code: String
        "Mã khách hàng"
        buyerId: ID
        "Tên khách hàng"
        buyerName: String
        "Số điện thoại khách hàng"
        buyerPhone: String
        "Địa chỉ khách hàng"
        buyerAddress: String
        "Vị trí khách hàng"
        buyerLocation: Mixed
        "Tổng tiền"
        subtotal: Float 
        "Giảm giá"
        discount: Float 
        "Phí vận chuyển"
        shipfee: Float 
        "Tổng tiền sau khi giảm giá và phí vận chuyển"
        amount: Float 
        "Trạng thái đơn hàng ${Object.values(OrderStatus)}"
        status: String 
        "Tên chương trình khuyến mãi"
        promotionName: String
        "Mã chương trình khuyến mãi"
        promotionCode: String
        "ID trình khuyến mãi"
        promotionId: ID
        "Điểm thưởng"
        rewardPoint: Float 
        "Sử dụng điểm thưởng"
        useRewardPoint: Boolean
        "Giảm giá điểm thưởng"
        rewardPointDiscount: Float 
        "Danh sách sản phẩm"
        items:[OrderItem]
        "ID Chi nhánh"
        branchId: ID
        buyerUser: User
        "Chi nhánh"
        branch: Branch


    }
    

    input CreateOrderInput {
      
        "Mã khách hàng"
        buyerId: ID
        "Tên khách hàng"
        buyerName: String!
        "Số điện thoại khách hàng"
        buyerPhone: String!
        "Địa chỉ khách hàng"
        buyerAddress: String!
        "Vị trí khách hàng"
        buyerLocation: Mixed!
        "Mã chương trình khuyến mãi"
        promotionCode: String
       
        "Sử dụng điểm thưởng"
        useRewardPoint: Boolean
       
        "Danh sách sản phẩm"
        items:[OrderItemInput]
        "ID Chi nhánh"
        branchId: ID!

    }

    input UpdateOrderInput {
         "Mã khách hàng"
         buyerId: ID
        "Trạng thái đơn hàng ${Object.values(OrderStatus)}"
        
        status: String 
        "Tên khách hàng"
        buyerName: String
        "Số điện thoại khách hàng"
        buyerPhone: String
        "Địa chỉ khách hàng"
        buyerAddress: String
        "Vị trí khách hàng"
        buyerLocation: Mixed
        "Mã chương trình khuyến mãi"
        promotionCode: String
      
       
        "Sử dụng điểm thưởng"
        useRewardPoint: Boolean
       
        "Danh sách sản phẩm"
        items:[OrderItemInput]
        
    }

`;
