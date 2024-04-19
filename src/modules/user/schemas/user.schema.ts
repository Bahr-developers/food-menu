import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose ,{ HydratedDocument, Types } from "mongoose";
import { Restourant } from "../../restourant/schemas";

export type UserDocument = HydratedDocument<User>

@Schema({versionKey :false})
export class User {
    @Prop({type:String, required: true })
    full_name: string

    @Prop({type:String, required: true })
    phone: string

    @Prop({type:String, required: true})
    password: string

    @Prop({type:Types.UUID, ref: "Restourant", required: true })
    restourant_id: Restourant[]
}
export const UserSchema = SchemaFactory.createForClass(User);