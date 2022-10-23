import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { USER_DEFAULTS_PERMISSIONS } from '../../auth/perms/user';

export type UserDocument = User & Document<string>;

@Schema({
  skipVersioning: { ['__v']: false },
  autoIndex: true,
  minimize: false,
  toObject: {
    versionKey: false,
  },
  timestamps: true,
})
export class User {
  @Prop({ required: true, unique: true, type: mongoose.Schema.Types.String })
  name: string;
  @Prop({ required: true, unique: true, type: mongoose.Schema.Types.String })
  phonenumber: string;
  @Prop({
    required: true,
    type: mongoose.Schema.Types.String,
    unique: true,
    select: true,
  })
  password: string;
  @Prop({
    required: true,
    default: 'USER',
    enum: ['USER'],
    type: mongoose.Schema.Types.String,
  })
  role: string;
  @Prop({
    required: true,
    default: USER_DEFAULTS_PERMISSIONS,
    type: mongoose.Schema.Types.Array,
  })
  permissions: Record<string, unknown>[];
  @Prop({
    required: false,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'stores',
  })
  subscriptions: string[];
  @Prop({ type: mongoose.Schema.Types.String, required: true })
  token: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
