import { Request } from "express";
import { Types } from "mongoose";

export interface CustomRequest extends Request {
  user?: {
    id: Types.ObjectId;
  };
}