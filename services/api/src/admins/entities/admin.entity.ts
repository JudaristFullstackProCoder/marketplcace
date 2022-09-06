import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { ADMIN_DEFAULT_PERMISSIONS } from '../../auth/perms/admin';

export type AdminDocument = Admin & Document<string>;

@Schema({
  skipVersioning: { ['__v']: true },
  autoIndex: true,
  minimize: false,
  toObject: {
    versionKey: false,
  },
  timestamps: true,
})
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
  email: string;
  @Prop({
    required: true,
    type: mongoose.Schema.Types.String,
    unique: true,
    select: false,
  })
  password: string;
  @Prop({
    required: true,
    default: 'ADMIN',
    enum: ['ADMIN'],
    type: mongoose.Schema.Types.String,
    immutable: true,
  })
  role: string;
  @Prop({
    required: true,
    default: ADMIN_DEFAULT_PERMISSIONS,
    type: mongoose.Schema.Types.Array,
  })
  permissions: string[];
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
