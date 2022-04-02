import { gql } from "apollo-server-express";
import { Status } from "./shipper.model";

export default gql`
  extend type Query {
    getAllShipper(q: QueryInput): ShipperPageData
    getOneShipper(id: ID!): Shipper
  }
  extend type Mutation {
    createShipper(data: CreateShipperInput!): Shipper
    updateShipper(id: ID!, data: UpdateShipperInput!): Shipper
    deleteShipper(id: ID!): Boolean
  }
  type ShipperPageData {
    data: [Shipper]
    pagination: Pagination
  }
  type Shipper {
    id: ID!
    createdAt: DateTime
    updatedAt: DateTime
    "UID của người dùng"
    uid: String!
    "Tên nhà vận chuyển"
    shipperName: String!
    "Số điện thoại"
    shipperPhone: Float
    "Địa chỉ"
    shipperAddress: String
    "Email"
    shipperEmail: String
    "Mô tả"
    shipperDescription: String
    "Logo"
    shipperLogo: String
    "Trạng thái ${Object.values(Status)}"
    shipperStatus: String
    "Biển số xe"
    licensePlates: String
    "Mã công ty"
    deliverCompany: String
    "Đánh giá"
    rate: Float
  }
  input ShipperInput {
    "UID của người dùng"
    uid: String!
    "Tên nhà vận chuyển"
    shipperName: String!
    "Số điện thoại"
    shipperPhone: Float!
    "Địa chỉ"
    shipperAddress: String
    "Email"
    shipperEmail: String
    "Mô tả"
    shipperDescription: String
    "Logo"
    shipperLogo: String
    "Trạng thái ${Object.values(Status)}"
    shipperStatus: String
    "Biển số xe"
    licensePlates: String
    "Mã công ty"
    deliverCompany: String
    "Đánh giá"
    rate: Float
  }
  input CreateShipperInput {
    "UID của người dùng"
    uid: String!
    "Tên nhà vận chuyển"
    shipperName: String!
    "Số điện thoại"
    shipperPhone: Float!
    "Địa chỉ"
    shipperAddress: String!
    "Email"
    shipperEmail: String
    "Mô tả"
    shipperDescription: String
    "Logo"
    shipperLogo: String
    "Trạng thái ${Object.values(Status)}"
    shipperStatus: String
    "Biển số xe"
    licensePlates: String
    "Mã công ty"
    deliverCompany: String
  }

  input UpdateShipperInput {
    "Tên nhà vận chuyển"
    shipperName: String
    "Số điện thoại"
    shipperPhone: Float
    "Địa chỉ"
    shipperAddress: String
    "Email"
    shipperEmail: String
    "Mô tả"
    shipperDescription: String
    "Logo"
    shipperLogo: String
    "Trạng thái ${Object.values(Status)}"
    shipperStatus: String
    "Biển số xe"
    licensePlates: String
    "Mã công ty"
    deliverCompany: String
  }
`;
