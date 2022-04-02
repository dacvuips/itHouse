import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    getAllBranch(q: QueryInput): BranchPageData
    getOneBranch(id: ID!): Branch
  }
  extend type Mutation {
    createBranch(data: CreateBranchInput!): Branch
    updateBranch(id: ID!, data: UpdateBranchInput!): Branch
    deleteBranch(id: ID!): Boolean
  }
  type BranchPageData {
    data: [Branch]
    pagination: Pagination
  }
  type Branch {
    id: ID!
    createdAt: DateTime
    updatedAt: DateTime
    "Tên"
    name: String
    "Số điện thoại"
    phone: String
    "Địa chỉ"
    place: Place
    "Trạng thái"
    active: Boolean
    "Phí ship"
    shipfeePerKm: Float
  }

  input CreateBranchInput {
    "Tên"
    name: String!
    "Số điện thoại"
    phone: String!
    "Địa chỉ"
    place: PlaceInput!
    "Trạng thái"
    active: Boolean
    "Phí ship"
    shipfeePerKm: Float!
  }

  input UpdateBranchInput {
    "Tên"
    name: String
    "Số điện thoại"
    phone: String
    "Địa chỉ"
    place: PlaceInput
    "Trạng thái"
    active: Boolean
    "Phí ship"
    shipfeePerKm: Float
  }
`;
