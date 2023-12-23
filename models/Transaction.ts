import mongoose, { Schema, Document } from 'mongoose';

interface ITransaction extends Document {
  hash: string;
  walletAddress: string;
}

const transactionSchema: Schema = new Schema({
  hash: { type: String, required: true },
  walletAddress: { type: String, required: true },
});

export default mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', transactionSchema);
