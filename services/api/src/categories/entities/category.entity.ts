import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type CategoryDocument = Category & Document<string>;

@Schema({
  skipVersioning: { ['__v']: false },
  autoIndex: true,
  minimize: false,
  toObject: {
    versionKey: false,
  },
  timestamps: true,
})
export class Category {
  @Prop({ required: true, unique: true, type: mongoose.Schema.Types.String })
  readonly name: string;
  @Prop({ required: true, type: mongoose.Schema.Types.String })
  readonly shortname: string;
  @Prop({
    required: true,
    ref: 'families',
    type: mongoose.Schema.Types.ObjectId,
  })
  family: string;
  @Prop({
    required: true,
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'options',
  })
  options: string[];
}

export const CategorySchema = SchemaFactory.createForClass(Category);
