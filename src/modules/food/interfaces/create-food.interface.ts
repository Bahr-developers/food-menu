import { ObjectExpressionOperatorReturningObject } from "mongoose";

export declare interface CreateFoodInterface {
  name: object;
  description: object;
  price: string;
  category_id: string;
  preparing_time?: object;
  restourant_id: string;
  images: any;
}
