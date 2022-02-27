import { gql } from "apollo-server-express";
import { UserRole } from "./user.model";

export default gql`

extend type Query{

    getAllUser(q:QueryInput) :UserPageData,
    getOneUser(id:ID!):User
}
extend type Mutation{
    createUser(data:CreateUserInput!):User,
    updateUser(id:ID!,data:UpdateUserInput!):User,
    deleteUser(id:ID!):Boolean
}

type UserPageData{
    data:[User],
    pagination:Pagination
}
type User{
    id:ID!
    createAt:DateTime
    updateAt:DateTime
    "User Name"
    username: String 
    "Họ và tên"
    name: String 
    "Email"
    email: String 
    "Số điện thoại"
    phone: String 
   
    "Quyền ${Object.values(UserRole)}"
    role: String
}
input CreateUserInput{

    createAt:DateTime
    updateAt:DateTime
    "User Name"
    username: String!
    "Họ và tên"
    name: String!
    "Email"
    email: String!
    "Số điện thoại"
    phone: String!
    "Mật khẩu"
    password: String!
    "Quyền ${Object.values(UserRole)}"
    role: String!
}
input UpdateUserInput{
   
    "Họ và tên"
    name: String
    "Email"
    email: String
    "Số điện thoại"
    phone: String
  
   
}

`;
