import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Definition } from './definition.schema';

const status = ['active', 'inactive'];
const translateType = ['content', 'error'];


export type TranslateDocument = HydratedDocument<Translate>;

@Schema({ collection: 'translate', timestamps: true })
export class Translate {
  @Prop({ unique: true })
  code: string;

  @Prop({ enum: translateType, default: 'content' })
  type: string;

  @Prop({ enum: status, default: 'active' })
  status: string;

  @Prop({type: [Types.ObjectId], ref: "Definition", required: true })
  definitions: Definition[]
}

export const TranslateSchema = SchemaFactory.createForClass(Translate);
