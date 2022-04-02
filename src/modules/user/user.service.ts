import { nanoid } from "nanoid";
import { CrudService } from "../../base/crudService";
import { User, UserModel } from "./user.model";
class UserService extends CrudService<User> {
  constructor() {
    super(UserModel);
  }
  generateCode() {
    return nanoid(8);
  }
}

export const userService = new UserService();
