import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, ModifyResult } from 'mongoose';

export type VariationDocument = Variation & Document<string>;

export class VariationUpdatedType implements ModifyResult<VariationDocument> {
  value: Variation &
    mongoose.Document<string, any, any> &
    Required<{ _id: string }>;
  lastErrorObject?;
  ok: 0 | 1;
}

@Schema({
  skipVersioning: { ['__v']: false },
  autoIndex: true,
  minimize: false,
  toObject: {
    versionKey: false,
  },
  timestamps: true,
})
export class Variation {
  @Prop({ type: mongoose.Schema.Types.String, required: true })
  name: string;
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'products',
  })
  product: string;
  @Prop({
    required: false,
    type: [
      {
        option: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'options',
        },
        value: {
          type: mongoose.Schema.Types.String,
          required: true,
        },
      },
    ],
  })
  options: Record<string, unknown>;
  @Prop({ required: true, type: mongoose.Schema.Types.Number })
  price: number;
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'shopkeepers',
  })
  shopkeeper: string;
  @Prop({ required: false, type: mongoose.Schema.Types.String })
  readonly image: Record<string, unknown>;
}

export const variationSchema = SchemaFactory.createForClass(Variation);
