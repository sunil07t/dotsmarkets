// pages/api/userTransactions.js
import dbConnect from "../../../lib/dbConnect";
import Transaction from "../../../models/Transaction";

export default async function userTransactions(req, res) {
  if (req.method === "GET") {
    const { walletAddress } = req.query;
    await dbConnect();

    try {
      const transactions = await Transaction.find({
        walletAddress: walletAddress,
      });
      res.status(200).json({ transactions });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res.status(405).end();
  }
}
