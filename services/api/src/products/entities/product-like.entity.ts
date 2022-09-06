import { Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type ProductLikeDocument = ProductLike & Document;

export class ProductLike {
  @Prop({
    required: false,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
  })
  user: string;
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'products',
  })
  product: string;
}

export const productLikesSchema = SchemaFactory.createForClass(ProductLike);
