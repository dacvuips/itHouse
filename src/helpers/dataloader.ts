import DataLoader from "dataloader";
import _ from "lodash";
import { Model } from "mongoose";
import logger from "./logger";
import { ttlCache } from "./ttlCache";

export function getModelDataLoader<T>(model: Model<T>) {
  return new DataLoader(
    async (ids) => {
      logger.info("ids", ids);
      const item = await model.find({ _id: { $in: ids } });
      const keyById = _.keyBy(item, "_id");
      return ids.map((id) => _.get(keyById, id as string, null)) as T[];
    },
    { cache: true, cacheMap: ttlCache({ ttl: 1000, maxSize: 100 }) }
  );
}
