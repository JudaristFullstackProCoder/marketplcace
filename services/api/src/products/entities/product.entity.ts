import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, ModifyResult } from 'mongoose';

export class ProductUpdatedType implements ModifyResult<ProductDocument> {
  value: Product &
    mongoose.Document<string, any, any> &
    Required<{ _id: string }>;
  lastErrorObject?;
  ok: 0 | 1;
}

export type ProductDocument = Product & Document<string>;
@Schema({
  skipVersioning: { ['__v']: false },
  autoIndex: true,
  minimize: false,
  toObject: {
    versionKey: false,
  },
  timestamps: true,
})
export class Product {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.String,
    index: true,
    text: true,
    minlength: 3,
    maxlength: 50,
  })
  name: string;
  @Prop({ required: true, type: mongoose.Schema.Types.Number })
  price: number;
  @Prop({
    required: true,
    type: mongoose.Schema.Types.String,
    index: true,
    text: true,
    minlength: 20,
    maxlength: 500,
  })
  shortDescription: string;
  @Prop({
    required: true,
    type: mongoose.Schema.Types.String,
    minlength: 30,
    maxlength: 500,
    text: true,
    index: true,
  })
  longDescription: string;
  @Prop({ required: false, type: mongoose.Schema.Types.Mixed })
  imageUrl: Record<string, unknown>;
  @Prop({ required: false, type: mongoose.Schema.Types.String })
  videoUrl: string;
  @Prop({ required: false, type: [mongoose.Schema.Types.Mixed] })
  imagesUrls: Record<string, unknown>[];
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
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'shopkeepers',
  })
  shopkeeper: string; /** product's owner */
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'stores' })
  store: string;
  @Prop({ required: true, type: mongoose.Schema.Types.Number, default: 0 })
  viewers: number;
  @Prop({ required: true, type: mongoose.Schema.Types.Number, default: 0 })
  likes: number;
}

export const productSchema = SchemaFactory.createForClass(Product);
