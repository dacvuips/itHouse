import { validateEmail } from "./../../helpers/function/validexEmail";
import { UserModel } from "./user.model";
import passwordHash from "password-hash";
export default {
  Query: {
    getAllUser: async (root: any, agrn: any, context: any) => {
      const { q } = agrn;

      return await fetch(q);
    },
    getOneUser: async (root: any, agrn: any, context: any) => {
      const { id } = agrn;
      const user = await UserModel.findById(id);
      if (!user) throw new Error("User not found");
      return user;
    },
  },

  Mutation: {
    createUser: async (root: any, agrn: any, context: any) => {
      const { data } = agrn;
      const { username, password, name, email, phone, role } = data;
      if (username.length < 6)
        throw new Error("Username must be at least 6 characters");
      if (password.length < 6)
        throw new Error("Password must be at least 6 characters");
      validexEmail(email);
      if (phone.length < 10)
        throw new Error("Phone must be at least 10 characters");
      if (role.length < 1)
        throw new Error("Role must be at least 1 characters");
      await checkUserIsExist(username);
      const user = await UserModel.create({
        username: username,
        password: passwordHash.generate(password),
        name: name,
        email: email,
        phone: phone,
        role: role,
      });
      return user;
    },
    updateUser: async (root: any, agrn: any, context: any) => {
      const { id, data } = agrn;
      const { name, email, phone, role } = data;
      const user = await UserModel.findById(id);
      if (!user) throw new Error("User not found");
      if (email) {
        validexEmail(email);
      }
      return await UserModel.findByIdAndUpdate(
        id,
        {
          $set: data,
        },
        { new: true }
      );
    },

    deleteUser: async (root: any, agrn: any, context: any) => {
      const { id } = agrn;
      const user = await UserModel.findById(id);
      if (!user) {
        throw new Error("User not found");
      } else {
        await UserModel.findByIdAndDelete(id);
        return true;
      }
    },
  },
};

function validexEmail(email: string) {
  if (validateEmail(email) == false) throw new Error("Email is not valid");
}

async function checkUserIsExist(username: any) {
  const user = await UserModel.findOne({ username });
  if (user) {
    throw new Error("Username is exist");
  }

  return user;
}

export interface QueryInput {
  page?: number;
  limit?: number;
  offset?: number;
  order?: any;
  filter?: any;
  select?: any;
  search?: string;
}
async function fetch(queryInput: QueryInput, select?: string) {
  const limit = queryInput.limit || 10;
  const skip = ((queryInput.page || 1) - 1) * limit || 0;
  const order = queryInput.order;
  const search = queryInput.search;
  const model = UserModel;
  const query = model.find();

  // if (search) {
  //   if (search.includes(" ")) {
  //     set(queryInput, "filter.$text.$search", search);
  //     query.select({ _score: { $meta: "textScore" } });
  //     query.sort({ _score: { $meta: "textScore" } });
  //   } else {
  //     const textSearchIndex = this.model.schema
  //       .indexes()
  //       .filter((c: any) => values(c[0]!).some((d: any) => d == "text"));
  //     if (textSearchIndex.length > 0) {
  //       const or: any[] = [];
  //       textSearchIndex.forEach((index) => {
  //         Object.keys(index[0]!).forEach((key) => {
  //           or.push({ [key]: { $regex: search, $options: "i" } });
  //         });
  //       });
  //       set(queryInput, "filter.$or", or);
  //     }
  //   }
  // }

  if (order) {
    query.sort(order);
  }
  if (queryInput.filter) {
    const filter = JSON.parse(
      JSON.stringify(queryInput.filter).replace(/\"(\_\_)(\w+)\"\:/g, `"$$$2":`)
    );
    query.setQuery({ ...filter });
  }
  const countQuery = model.find().merge(query);
  query.limit(limit);
  query.skip(skip);
  // console.time("Fetch");
  // console.time("Count");
  if (select) {
    query.select(select);
  }
  return await Promise.all([
    query.exec().then((res) => {
      // console.timeEnd("Fetch");
      return res;
    }),
    countQuery.count().then((res) => {
      // console.timeEnd("Count");
      return res;
    }),
  ]).then((res) => {
    return {
      data: res[0],

      pagination: {
        page: queryInput.page || 1,
        limit: limit,
        total: res[1],
      },
    };
  });
}
