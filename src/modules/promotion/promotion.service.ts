import { CrudService } from "../../base/crudService";
import { Promotion, PromotionModel } from "./promotion.model";
import { nanoid } from "nanoid";
class PromotionService extends CrudService<Promotion> {
  constructor() {
    super(PromotionModel);
  }
  generateCode() {
    return nanoid(8);
  }
}

export const promotionService = new PromotionService();
