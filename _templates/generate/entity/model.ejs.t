---
to: <%= h.dir(name) %>/<%= h.name(name, true) %>.model.ts
---

import { Document, Schema } from "mongoose";
import { BaseDoccument } from "../../base/baseModel";
import { Mongo } from "../../helpers/mongo";

export type <%= h.name(name) %> = BaseDoccument & {
  name?: string; // Tên
};

const <%= h.name(name, true) %>Schema = new Schema(
  {
    name: { type: String, required: true },
  },
  { timestamps: true }
);

export const <%= h.name(name) %>Model = Mongo.model<<%= h.name(name) %>>("<%= h.name(name) %>",  <%= h.name(name, true) %>Schema);