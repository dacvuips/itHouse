import { Document } from "mongoose";

export type BaseDoccument = Document & {
  createAt: Date; // Ngày tạo
  updateAt: Date; // Ngày cập nhật
};
