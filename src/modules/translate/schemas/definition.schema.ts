import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Language } from 'modules/language';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { Translate } from './translate.schema';

export type DefinitionDocument = HydratedDocument<Definition>;

@Schema({ collection: 'definition', timestamps: true, })
export class Definition {
  @Prop()
  value: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: Translate.name })
  translateId: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: Language.name })
  languageId: Types.ObjectId;
}

export const DefinitionSchema = SchemaFactory.createForClass(Definition);
