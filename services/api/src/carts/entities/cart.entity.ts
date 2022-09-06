import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, ModifyResult } from 'mongoose';

export type CartDocument = Cart & Document;

export class CartUpdated implements ModifyResult<CartDocument> {
  value: Cart &
    mongoose.Document<any, any, any> & { _id: mongoose.Types.ObjectId };
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
export class Cart {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    unique: true,
  })
  user: string;
  @Prop({
    required: false,
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'products',
  })
  products: string[];
}

export const cartsSchema = SchemaFactory.createForClass(Cart);
