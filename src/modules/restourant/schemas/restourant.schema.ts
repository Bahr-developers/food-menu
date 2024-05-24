import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose ,{ HydratedDocument, Types } from "mongoose";
import { Translate } from "../../localisation/translate";
import { CreateSocilsInterface } from "../interfaces";

export type RestourantDocument = HydratedDocument<Restourant>

@Schema({versionKey :false})
export class Restourant {
    @Prop({type:Types.UUID, ref: "Translate", required: true })
    name: Translate[]

    @Prop({type:Types.UUID, ref: "Translate", required: false })
    description: Translate[]

    @Prop({type:Types.UUID, ref: "Translate", required: false })
    location: Translate[]

    @Prop({type: String, required: false })
    tel: string

    @Prop({type: Number, required: false })
    service_percent: string

    @Prop({ type: String, required: true })
    image_url: string;

    @Prop({ type: [Object], required: false })
    socials: CreateSocilsInterface[];
}
export const RestourantSchema = SchemaFactory.createForClass(Restourant);