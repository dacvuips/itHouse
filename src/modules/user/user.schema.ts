import { gql } from "apollo-server-express";
import { UserRole } from "./user.model";

export default gql`
    
    extend type Query {
        getAllUser(q: QueryInput): UserPageData
        getOneUser(id: ID!): User
    }
    extend type Mutation {
        createUser(data: CreateUserInput!): User
        updateUser(id: ID!, data: UpdateUserInput!): User
        deleteUser(id: ID!): Boolean
    }
    type UserPageData {
        data: [User]
        pagination: Pagination
    }
    type User {
        id: ID!
        createdAt: DateTime
        updatedAt: DateTime
        "Username is unique"
        uid: String
        "Username"
        username: String
        "Họ và tên"
        name: String
        "Email"
        email: String
        "Nhà cung cấp đăng nhập"
        signInProvider: String
        "Số điện thoại"
        phone: String
        "Quyền ${Object.values(UserRole)}"
        role: String
        "Điểm thưởng"
        rewardPoint: Int
        "Điểm thưởng"
        rewardPointDiscount: Float
    }
    type UserInput {
        id: ID!
        createdAt: DateTime
        updatedAt: DateTime
        "Username is unique"
        uid: String
        "Username"
        username: String
        "Họ và tên"
        name: String
        "Email"
        email: String
        "Nhà cung cấp đăng nhập"
        signInProvider: String
        "Số điện thoại"
        phone: String
        "Quyền ${Object.values(UserRole)}"
        role: String
        "Điểm thưởng"
        rewardPoint: Int
        "Điểm thưởng"
        rewardPointDiscount: Float
    }

    input CreateUserInput {
        "Username"
        username: String!
        "Họ và tên"
        name: String!
        "Email"
        email: String!
        "Số điện thoại"
        phone: String
        "Mật khẩu"
        password: String!
        
        
    }

    input UpdateUserInput {
        "Họ và tên"
        name: String
        "Email"
        email: String
        "Số điện thoại"
        phone: String
        "Quyền ${Object.values(UserRole)}"
        role: String
        "Điểm thưởng"
        rewardPointDiscount: Float
    }

`;
