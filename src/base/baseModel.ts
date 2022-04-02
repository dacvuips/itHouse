import { Document } from "mongoose";

export type BaseDocument = Document & {
  createAt: Date; // Ngày tạo
  updateAt: Date; // Ngày cập nhật
};
