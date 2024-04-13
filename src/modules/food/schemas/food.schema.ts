import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, SchemaTypes } from 'mongoose';
import { Category } from '../../category/schemas';
import { Restourant } from '../../restourant/schemas';
import { Translate } from '../../translate';

export type FoodDocument = HydratedDocument<Food>;

@Schema({versionKey :false})
export class Food {
    @Prop({type:Types.UUID, ref: "Translate", required: true })
    name: Translate[]

    @Prop({type:Types.UUID, ref: "Translate", required: true })
    description: Translate[]

    @Prop({ type: String})
    price: string;

    @Prop({ type: [String], required: true })
    image_urls: string[];

    @Prop({ type: SchemaTypes.ObjectId, ref: Category.name })
    category_id: Types.ObjectId;

    @Prop({type:Types.UUID, ref: "Restourant", required: true })
    restourant_id: Restourant[]
}

export const FoodSchema = SchemaFactory.createForClass(Food);
