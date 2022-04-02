import { CrudService } from "../../base/crudService";
import { Shipper, ShipperModel } from "./shipper.model";

class ShipperService extends CrudService<Shipper> {
  constructor() {
    super(ShipperModel);
  }
}

export const shipperService = new ShipperService();
