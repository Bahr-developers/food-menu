import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { Food } from '../../food/schemas';
import { Translate } from '../../translate';
import { Restourant } from 'modules/restourant/schemas';

export type CategoryDocument = HydratedDocument<Category>;

@Schema({ versionKey: false })
export class Category {
  @Prop({ type: Types.UUID, ref: 'Translate', required: true })
  name: string;

  @Prop({ type: String, required: false })
  image_url?: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: Category.name })
  category_id?: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: Restourant.name })
  restaurant_id: Types.ObjectId;

  @Prop({ type: [Types.ObjectId], ref: 'Category', required: false })
  subcategories?: Category[];

  @Prop({ type: [Types.ObjectId], ref: 'Food', required: true })
  foods: Food[];
}
export const CategorySchema = SchemaFactory.createForClass(Category);
