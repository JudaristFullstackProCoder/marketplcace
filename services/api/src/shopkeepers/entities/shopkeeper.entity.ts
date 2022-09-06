import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { SHOPKEEPER_DEFAULT_PERMS } from '../../auth/perms/shopkeeper';

export type ShopkeeperDocument = Shopkeeper & Document<string>;

@Schema({
  skipVersioning: { ['__v']: false },
  autoIndex: true,
  minimize: false,
  toObject: {
    versionKey: false,
  },
  timestamps: true,
})
export class Shopkeeper {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'users' })
  user: string;
  @Prop({
    required: true,
    type: [mongoose.Schema.Types.String],
    default: SHOPKEEPER_DEFAULT_PERMS,
  })
  perms: string[];
}

export const ShopkeeperSchema = SchemaFactory.createForClass(Shopkeeper);
