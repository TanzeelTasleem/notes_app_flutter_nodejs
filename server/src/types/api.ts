import { Request } from "express";

export type ApiResponse<T> =
    | { success: true; data: T }
    | { success: false; message: string };

export type CreateUserBody = { name: string; email: string; password: string };
export interface AuthRequest<
  Params = Record<string, unknown>,
  ResBody = any,
  ReqBody = any,
  ReqQuery = any
> extends Request<Params, ResBody, ReqBody, ReqQuery> {
  userId?: string;
}
