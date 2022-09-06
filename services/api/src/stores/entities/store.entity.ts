import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type StoreDocument = Store & Document<string>;
@Schema({
  skipVersioning: { ['__v']: false },
  autoIndex: true,
  minimize: false,
  toObject: {
    versionKey: false,
  },
  timestamps: true,
})
export class Store {
  @Prop({ required: true, type: mongoose.Schema.Types.String })
  name: string;
  @Prop({
    required: true,
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'families',
  })
  /**
   * @wys = what you sell (a collection of product families that you sell in you're store)
   */
  wys: string;
  @Prop({
    required: true,
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'shopkeepers',
  })
  shopkeeper: string;
  @Prop({ required: false, type: mongoose.Schema.Types.Mixed })
  image: Record<string, unknown>;
}

export const StoreSchema = SchemaFactory.createForClass(Store);
