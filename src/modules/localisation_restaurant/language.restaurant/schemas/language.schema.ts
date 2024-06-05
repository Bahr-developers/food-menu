import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Restourant } from '../../../restourant/schemas';
import { DefinitionRestourant } from '../../translate.restaurant';

@Schema({ collection: 'language_restaurant', timestamps: true })
export class LanguageRestourant {
  @Prop({ length: 2 })
  code: string;

  @Prop({ maxlength: 64 })
  title: string;
  
  @Prop({ type: String, required: false })
  image_url: string;

  @Prop({type: Types.ObjectId, ref: "Restourant", required: true })
  restourant_id: Restourant
}

export const LanguageRestourantSchema = SchemaFactory.createForClass(LanguageRestourant);
