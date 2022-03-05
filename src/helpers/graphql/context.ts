import { Request } from "express";
import Token from "../token";
import _ from "lodash";
import { TokenExpiredError } from "jsonwebtoken";
import { auth } from "firebase-admin";
export class Context {
  public req: Request;
  public token?: Token;
  public isAuth = false;
  public isTokenExpired = false;
  public scopes: string[] = [];
  constructor(params: { req: Request }) {
    this.req = params.req;

    const token = _.get(this.req.headers, "x-token");

    if (token) {
      try {
        this.token = Token.decode(token as string);
        this.isAuth = true;
      } catch (error) {
        if (error instanceof TokenExpiredError) {
          this.isTokenExpired = true;
        }
      }
    }
  }

  get scope() {
    if (!this.isAuth) return [];
    if (!this.token) return [];
    return _.get(this.token, "payload.scopes", []);
  }
  auth(roles: string[]) {
    if (!this.isAuth) throw new Error("Unauthenticated");
    if (!this.token) throw new Error("Không có token");
    if (!roles.includes(this.token.role)) return true;
  }

  grant(scopes: string[]) {
    if (!this.isAuth) throw new Error("Unauthenticated");
    if (!this.token) throw new Error("Không có token");

    if (!scopes.every((scope) => this.scopes.includes(scope)))
      throw new Error("Không có quyền");
    return true;
  }
}
