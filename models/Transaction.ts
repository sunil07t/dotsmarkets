import mongoose, { Schema, Document } from 'mongoose';

interface ITransaction extends Document {
  hash: string;
  walletAddress: string;
  action: string;
  tick: string;
  amount: Number;
  timestamp: Date;
}

const transactionSchema: Schema = new Schema({
  hash: { type: String, required: true },
  walletAddress: { type: String, required: true },
  action: { type: String, required: true, default: 'mint' },
  tick: { type: String, required: true, default: 'DOTS' },
  amount: { type: Number, required: true, default: 1000 },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', transactionSchema);
