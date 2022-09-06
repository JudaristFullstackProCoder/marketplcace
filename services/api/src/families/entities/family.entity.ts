import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type FamilyDocument = Family & Document<string>;
@Schema({
  skipVersioning: { ['__v']: false },
  autoIndex: true,
  minimize: false,
  toObject: {
    versionKey: false,
  },
  timestamps: true,
})
export class Family {
  @Prop({ required: true, type: mongoose.Schema.Types.String })
  name: string;
}

export const FamilySchema = SchemaFactory.createForClass(Family);
