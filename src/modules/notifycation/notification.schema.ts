import { Mixed } from "mongoose";
import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    getAllNotification(q: QueryInput): NotificationPageData
    getOneNotification(id: ID!): Notification
  }

  type NotificationPageData {
    data: [Notification]
    pagination: Pagination
  }
  type Notification {
    id: ID!
    createdAt: DateTime
    updatedAt: DateTime
    " userId"
    userId: String
    " Tiêu đề"
    title: String
    " Nội dung"
    body: Mixed
    " Ảnh"
    image: String
    " Đã đọc"
    read: Boolean

    " Hành động"
    action: Action
  }
`;
