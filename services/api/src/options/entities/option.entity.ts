import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type OptionDocument = Option & Document<string>;

export const trimOptionItemDocument = function trimUserItemDocument(
  user: OptionDocument,
) {
  return user;
};

export const trimOptionCollectionDocument = function trimUserItemDocument(
  user: OptionDocument,
) {
  return user;
};

@Schema({
  skipVersioning: { ['__v']: false },
  autoIndex: true,
  minimize: false,
  toObject: {
    versionKey: false,
  },
  timestamps: true,
})
export class Option {
  @Prop({ required: true, type: mongoose.Schema.Types.String, unique: true })
  readonly name: string;
}

export const OptioneSchema = SchemaFactory.createForClass(Option);
