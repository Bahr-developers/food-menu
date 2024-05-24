import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose ,{ HydratedDocument, Types } from "mongoose";

export type SocialDocument = HydratedDocument<Social>

@Schema({versionKey :false})
export class Social {
    @Prop({type:String, required: true })
    name: string

    @Prop({type:String, required: true })
    image: string
}
export const SocialSchema = SchemaFactory.createForClass(Social);