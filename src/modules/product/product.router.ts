import { RouterConfig } from "./../../helpers/apiRouter";
import { Request, Response } from "express";
import { Workbook } from "exceljs";
import { Product, ProductModel } from "./product.model";
import { ExcelUploader } from "../../helpers/multer";
import { productService } from "./product.service";
import logger from "../../helpers/logger";
import fs from "fs";
// export default [
//   {
//     method: "get",
//     path: "/product",
//     midd: [],
//     handler: async (req: Request, res: Response) => {
//       res.send("hello product3");
//     },
//   },
// ];

export default [
  {
    method: "get",
    path: "/product/export",
    midd: [],
    handler: async (req: Request, res: Response) => {
      // init workbook
      const wb = new Workbook(); //tạo workbook mới
      // add worksheet
      const ws = wb.addWorksheet("data"); //tạo sheet mới
      // fetch data
      const data = await ProductModel.find();
      //write data to sheet
      //write header
      ws.addRow(["ID", "code", "Tên sản phẩm", "Giá bán"]);

      for (const i of data) {
        ws.addRow([i._id, i.code, i.name, i.sellPrice]);
      }
      //write excel header content
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader("Content-Disposition", "attachment; filename=data.xlsx");

      //write to response
      await wb.xlsx.write(res);
      res.end();
    },
  },

  {
    method: "post",
    path: "/product/import",
    midd: [ExcelUploader.single("file")],
    handler: async (req: Request, res: Response) => {
      // if req has not file , throw error
      if (!req.file) {
        throw new Error("File not found");
      }
      try {
        const wb = new Workbook();
        await wb.xlsx.readFile(req.file.path);
        // get sheet
        const ws = wb.getWorksheet("data");
        // get data
        const data = ws.getSheetValues() as any[];
        data.splice(0, 2);
        const products: Product[] = [];
        // create new product
        for (const i of data) {
          const product = new ProductModel({
            code: productService.generateCode(),
            name: i[3],
            sellPrice: i[4],
          });
          products.push(product);
        }
        // save product
        // await ProductModel.insertMany(products);
        return res.json(data);
      } catch (err) {
        logger.error(`Lỗi khi nhập liệu:`, err);
        throw err;
      } finally {
        fs.unlink(req.file.path, () => {
          logger.info(`Đã xoá file `);
        });
      }
    },
  },
] as RouterConfig[];
