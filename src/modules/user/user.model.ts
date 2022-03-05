import { Document, Schema } from "mongoose";
import { BaseDoccument } from "../../base/baseModel";
import { Mongo } from "../../helpers/mongo";
export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
  MERCHANT = "MERCHANT",
}

export type User = BaseDoccument & {
  uid?: string; // User ID người dùng
  username?: string; //User Name
  name?: string; // Họ và tên
  email?: string; // Email
  phone?: string; // Số điện thoại
  password?: string; // Mật khẩu
  role?: UserRole; // Quyền
  scopes?: string[]; // Các quyền
  signInProvider?: string; // Nhà cung cấp đăng nhập
};

const userSchema = new Schema(
  {
    uid: { type: String },
    username: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    password: { type: String },
    role: { type: String, required: true, enum: Object.values(UserRole) }, //Khai báo giá trị dã biết trước
    scopes: { type: [String] },
    signInProvider: { type: String },
  },
  { timestamps: true }
);

userSchema.index({ username: 1 }, { unique: true });
userSchema.index(
  {
    username: "text",
    name: "text",
    email: "text",
    phone: "text",
  },
  { weights: { username: 10, name: 5, email: 4, phone: 3 } }
);

export const UserModel = Mongo.model<User>("User", userSchema);

// import { Document, Schema } from "mongoose";
// import { BaseDocument } from "../../base/baseModel";
// import { Mongo } from "../../helpers/mongo";

// export enum UserRole {
//   ADMIN = "ADMIN", // Quản trị viên
//   USER = "USER", // Người dùng
// }

// export type User = BaseDocument & {
//   uid?: string; // UID của người dùng
//   username?: string; // Username
//   name?: string; // Họ và tên
//   email?: string; // Email
//   phone?: string; // Số điện thoại
//   password?: string; // Mật khẩu
//   role?: UserRole; // Quyền
//   signInProvider?: string; // Nhà cung cấp đăng nhập
//   scopes?: string[]; // Các quyền
// };

// const userSchema = new Schema(
//   {
//     uid: { type: String },
//     username: { type: String, required: true },
//     name: { type: String, required: true },
//     email: { type: String },
//     phone: { type: String },
//     password: { type: String },
//     role: { type: String, required: true, enum: Object.values(UserRole) },
//     signInProvider: { type: String },
//     scopes: { type: [String] },
//   },
//   { timestamps: true }
// );

// userSchema.index({ username: 1 }, { unique: true });
// userSchema.index({ email: 1 });
// userSchema.index(
//   {
//     username: "text",
//     name: "text",
//     email: "text",
//     phone: "text",
//   },
//   { weights: { username: 1, name: 10, email: 2, phone: 3 } }
// );

// export const UserModel = Mongo.model<User>("User", userSchema);
