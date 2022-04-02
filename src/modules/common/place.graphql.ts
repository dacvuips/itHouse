import { Schema } from "mongoose";
import { Context } from "../../helpers/graphql/context";
import { gql } from "apollo-server-express";

export type Place = {
  address?: string; // Địa chỉ
  provinceId?: string; // Id tỉnh thành
  districtId?: string; // Id quận huyện
  wardId?: string; // Id phường xã
  provinceName?: string; // Tên tỉnh thành
  districtName?: string; // Tên quận huyện
  wardName?: string; // Tên phường xã
  location?: any; // Vị trí
};

export const PlaceSchema = new Schema({
  address: { type: String },
  provinceId: { type: String },
  districtId: { type: String },
  wardId: { type: String },
  provinceName: { type: String },
  districtName: { type: String },
  wardName: { type: String },
  location: { type: Schema.Types.Mixed },
});
PlaceSchema.index({ location: "2dsphere" });
export default {
  schema: gql`
    type Place {
      "Địa chỉ"
      address: String
      "Id tỉnh thành"
      provinceId: String
      "Id quận huyện"
      districtId: String
      "Id phường xã"
      wardId: String
      "Tên tỉnh thành"
      provinceName: String
      "Tên quận huyện"
      districtName: String
      "Tên phường xã"
      wardName: String
      "Vị trí"
      location: Mixed

      "Khoảng cách"
      distance(lng: Float!, lat: Float!): Float
    }

    input PlaceInput {
      "Địa chỉ"
      address: String
      "Id tỉnh thành"
      provinceId: String
      "Id quận huyện"
      districtId: String
      "Id phường xã"
      wardId: String
      "Tên tỉnh thành"
      provinceName: String
      "Tên quận huyện"
      districtName: String
      "Tên phường xã"
      wardName: String
      "Vị trí"
      location: Mixed
    }
  `,
  resolvers: {
    Place: {
      distance: (
        place: Place,
        { lng, lat }: { lng: number; lat: number },
        context: Context
      ) => {
        return getDistance(
          place.location.coordinates[1],
          place.location.coordinates[0],
          lng,
          lat
        );
      },
    },
  },
};

function getDistance(x1: number, x2: number, y1: number, y2: number) {
  let x = x1 - x2;
  let y = y1 - y2;

  return Math.sqrt(x * x + y * y) * 100;
}
