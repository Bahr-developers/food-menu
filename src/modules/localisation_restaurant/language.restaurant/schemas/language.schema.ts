import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Restourant } from '../../../restourant/schemas';

export type LanguageRestourantDocument = HydratedDocument<LanguageRestourant>;

@Schema({ collection: 'language_restourant', timestamps: true })
export class LanguageRestourant {
  @Prop({ length: 2 })
  code: string;

  @Prop({ maxlength: 64 })
  title: string;
  
  @Prop({ type: String, required: false })
  image_url: string;

  @Prop({type: [Types.ObjectId], ref: "Restourant", required: true })
  restourant_id: Restourant
}

export const LanguageRestourantSchema = SchemaFactory.createForClass(LanguageRestourant);
