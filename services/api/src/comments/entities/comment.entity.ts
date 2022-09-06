import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type CommentDocument = Comment & Document<string>;

@Schema({
  skipVersioning: { ['__v']: true },
  autoIndex: true,
  minimize: false,
  toObject: {
    versionKey: false,
  },
  timestamps: true,
})
export class Comment {
  @Prop({ type: mongoose.Schema.Types.String, required: true, ref: 'users' })
  user: string;
  @Prop({ type: mongoose.Schema.Types.String, required: true, ref: 'products' })
  product: string;
  @Prop({
    type: mongoose.Schema.Types.String,
    required: true,
    minlength: 2,
    index: 'text',
    text: true,
  })
  comment: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
