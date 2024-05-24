import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type LanguageDocument = HydratedDocument<Language>;

@Schema({ collection: 'language', timestamps: true })
export class Language {
  @Prop({ length: 2 })
  code: string;

  @Prop({ maxlength: 64 })
  title: string;

  @Prop({ type: String, required: false })
  image_url: string;
}

export const LanguageSchema = SchemaFactory.createForClass(Language);
