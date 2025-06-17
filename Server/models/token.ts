import mongoose, { Document, Schema } from 'mongoose';

export interface IToken extends Document {
  token: string;
  userId: mongoose.Types.ObjectId;
  type: 'verify' | 'reset';
  expiresAt: Date;
}

const tokenSchema = new Schema<IToken>({
  token: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['verify', 'reset'], required: true },
  expiresAt: { type: Date, required: true, index: { expires: '1h' } } // Auto-delete after expiration
});

export default mongoose.model<IToken>('Token', tokenSchema);