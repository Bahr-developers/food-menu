import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, SchemaTypes } from 'mongoose';
import { Category } from '../../category/schemas';
import { Restourant } from '../../restourant/schemas';
import { Translate } from '../../localisation/translate';
enum food_status {
    available = 'available',
    none = 'none',
    preparing = 'preparing'
  }
enum status {
    active = 'active',
    inactive = 'inactive'
}

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

    @Prop({ enum: food_status, default: food_status.available })
    food_status: string;

    @Prop({ enum: status, default: status.active })
    status: string;

    @Prop({ type: Number, required: false })
    preparing_time?: number;

    @Prop({type:Types.UUID, ref: "Restourant", required: true })
    restourant_id: Restourant
}

export const FoodSchema = SchemaFactory.createForClass(Food);
