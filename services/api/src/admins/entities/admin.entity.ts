import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { ADMIN_DEFAULT_PERMISSIONS } from '../../auth/perms/admin';

export type AdminDocument = Admin & Document<string>;

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
@Schema({
  skipVersioning: { ['__v']: true },
  autoIndex: true,
  minimize: false,
  toObject: {
    versionKey: false,
  },
  timestamps: true,
})
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export class Admin {
  @Prop({
    required: true,
    unique: true,
    type: mongoose.Schema.Types.String,
    index: true,
    text: true,
    lowercase: true,
    trim: true,
  })
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  username: string;
  @Prop({
    required: true,
    unique: true,
    type: mongoose.Schema.Types.String,
    index: true,
    text: true,
    lowercase: true,
    trim: true,
  })
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  email: string;
  @Prop({
    required: true,
    type: mongoose.Schema.Types.String,
    unique: true,
    select: false,
  })
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  password: string;
  @Prop({
    required: true,
    default: 'ADMIN',
    enum: ['ADMIN'],
    type: mongoose.Schema.Types.String,
    immutable: true,
  })
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  role: string;
  @Prop({
    required: true,
    default: ADMIN_DEFAULT_PERMISSIONS,
    type: mongoose.Schema.Types.Array,
  })
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  permissions: string[];
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
