import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose ,{ HydratedDocument, SchemaTypes, Types } from "mongoose";
import { Food } from "../../food/schemas";
import { Translate } from "../../translate";

export type CategoryDocument = HydratedDocument<Category>

@Schema({versionKey :false})
export class Category {
    
    @Prop({type:Types.UUID, ref: "Translate", required: true })
    name: Translate[]

    @Prop({ type: String, required: true })
    image_url: string;

    @Prop({ type: SchemaTypes.ObjectId, ref: Category.name })
    category_id?: Types.ObjectId;

    @Prop({type: [Types.ObjectId], ref: "Category", required: false })
    subcategories?: Category[]

    @Prop({type: [Types.ObjectId], ref: "Food", required: true })
    foods: Food[]
}
export const CategorySchema = SchemaFactory.createForClass(Category);