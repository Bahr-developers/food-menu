import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose ,{ HydratedDocument, Types } from "mongoose";
import { Translate } from "../../translate";

export type RestourantDocument = HydratedDocument<Restourant>

@Schema({versionKey :false})
export class Restourant {
    @Prop({type:Types.UUID, ref: "Translate", required: true })
    name: Translate[]

    @Prop({type:Types.UUID, ref: "Translate", required: true })
    description: Translate[]

    @Prop({type:Types.UUID, ref: "Translate", required: true })
    location: Translate[]

    @Prop({ type: String, required: true })
    image_url: string;
}
export const RestourantSchema = SchemaFactory.createForClass(Restourant);