import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { Restourant } from '../../../restourant/schemas';
import { LanguageRestourant } from '../../language.restaurant';
import { TranslateRestourant, TranslateRestourantSchema } from './translate.schema';

export type DefinitionRestourantDocument = HydratedDocument<DefinitionRestourant>;

@Schema({ collection: 'definition_restaurant', timestamps: true, })
export class DefinitionRestourant {
  @Prop()
  value: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: TranslateRestourant.name })
  translateId: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: LanguageRestourant.name })
  languageId: Types.ObjectId;

  @Prop({type: [Types.ObjectId], ref: "Restourant", required: true })
  restaurant_id: Restourant[]
}

export const DefinitionRestourantSchema = SchemaFactory.createForClass(DefinitionRestourant);
