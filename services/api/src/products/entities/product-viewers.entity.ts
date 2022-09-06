import { Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type ProductViewerDocument = ProductViewer & Document;

export class ProductViewer {
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

export const productViewerSchema = SchemaFactory.createForClass(ProductViewer);
