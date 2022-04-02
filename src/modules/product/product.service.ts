import { CrudService } from "../../base/crudService";
import { Product, ProductModel } from "./product.model";
import { nanoid } from "nanoid";
class ProductService extends CrudService<Product> {
  constructor() {
    super(ProductModel);
  }
  generateCode() {
    return nanoid(8);
  }
}

export const productService = new ProductService();
