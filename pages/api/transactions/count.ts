import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../lib/dbConnect';
import Transaction from '../../../models/Transaction';

export default async function transactionCount(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    await dbConnect();
    
    try {
      const count = await Transaction.countDocuments({});
      res.status(200).json({ count });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
