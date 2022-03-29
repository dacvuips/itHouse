import { CategoryLoader, CategoryModel } from "./category/category.model";
import _ from "lodash";
import { Context } from "../../helpers/graphql/context";
import { ProductModel } from "./product.model";
import { productService } from "./product.service";
import { GraphqlResolver } from "../../helpers/graphql/resover";

export default {
  Query: {
    getAllProduct: async (root: any, args: any, context: Context) => {
      const { q } = args;
      if (!context.isAdmin) {
        _.set(args, "q.filter.active", true);
      }
      return await productService.fetch(q);
    },
    getOneProduct: async (root: any, args: any, context: any) => {
      const { id } = args;
      const productView = await productService.findById(id);
      productView.updateOne({ $inc: { view: 1 } }).exec();
      return productService.findById(id);
    },
  },
  Mutation: {
    createProduct: async (root: any, args: any, context: Context) => {
      context.auth(["ADMIN"]);
      const { data } = args;

      if (!data.code) {
        data.code = productService.generateCode();
      }
      const product = await productService.create(data);
      return product;
    },
    updateProduct: async (root: any, args: any, context: Context) => {
      context.auth(["ADMIN"]);
      const { id, data } = args;
      return await productService.update(id, data);
    },
    deleteProduct: async (root: any, args: any, context: any) => {
      context.auth(["ADMIN"]);
      const { id } = args;
      return await productService.delete(id);
    },
  },
  Product: {
    category: GraphqlResolver.load(CategoryLoader, "categoryId"),
  },
};
