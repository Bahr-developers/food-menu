import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Restourant } from 'modules/restourant/schemas';
import { DefinitionRestourant } from './definition.schema';

const status = ['active', 'inactive'];
const translateType = ['content', 'error'];


export type TranslateRestourantDocument = HydratedDocument<TranslateRestourant>;

@Schema({ collection: 'translate_restourant', timestamps: true })
export class TranslateRestourant {
  @Prop({ unique: true })
  code: string;

  @Prop({ enum: translateType, default: 'content' })
  type: string;

  @Prop({ enum: status, default: 'active' })
  status: string;

  @Prop({type: [Types.ObjectId], ref: "DefinitionRestourant", required: true })
  definitions: DefinitionRestourant[]

  @Prop({type: Types.ObjectId, ref: "Restourant", required: true })
  restaurant_id: Restourant
}

export const TranslateRestourantSchema = SchemaFactory.createForClass(TranslateRestourant);
