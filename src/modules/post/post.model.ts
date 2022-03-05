import { Document, Schema } from "mongoose";
import { BaseDoccument } from "../../base/baseModel";
import { Mongo } from "../../helpers/mongo";
export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
  MERCHANT = "MERCHANT",
}

export type User = BaseDoccument & {
  username?: string; //User Name
  name?: string; // Họ và tên
  email?: string; // Email
  phone?: string; // Số điện thoại
  password?: string; // Mật khẩu
  role?: string; // Quyền
};

const userSchema = new Schema(
  {
    username: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: Object.values(UserRole) }, //Khai báo giá trị dã biết trước
  },
  { timestamps: true }
);

userSchema.index({ username: 1 }, { unique: true });

export const UserModel = Mongo.model("User", userSchema);
