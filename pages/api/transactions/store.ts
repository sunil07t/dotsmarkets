import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../lib/dbConnect';
import Transaction from '../../../models/Transaction';
import fetch from 'node-fetch';

interface Param {
    name: string;
    value: any[];
  }


interface ParamInternal {
    name: string;
    value: string;
  }
  
  interface Call {
    call_module: string;
    call_name: string;
    params: ParamInternal[];
  }

  interface Event {
    module_id: string;
    event_id: string;
    params: string[];
  }
  
  interface SubscanData {
    data: {
      params: Param[];
      event: Event[]
    };
  }


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    await dbConnect();
    const { hash, walletAddress } = req.body;
    
    const subscanResponse = await fetch('https://rococo.api.subscan.io/api/scan/extrinsic', {
      method: 'POST',
      headers: {
        'x-api-key': `${process.env.SUBSCAN_API_KEY}` 
      },
      body: JSON.stringify({ hash }),
    });

    if (subscanResponse.ok && subscanResponse.headers.get('content-type')?.includes('application/json')) {
        const subscanData : any = await subscanResponse.json();

        const isValidTransaction = (subscanData: SubscanData) =>
        subscanData.data &&
        subscanData.data.event.some((event: Event) =>
            event.module_id === "balances" &&
            event.event_id === "Transfer" 
            && event.params.includes("0xb0ec462fdf84e74f0897b813c61ba48588d55aafcab4f6467ad13648e9ca16d8")
        ) &&
        subscanData.data.params.some((param: Param) =>
            param.name === "calls" &&
            param.value.some((call: Call) =>
            call.call_module === "System" &&
            call.call_name === "remark_with_event" &&
            call.params.some((p: ParamInternal) => p.name === "remark" && p.value === `${process.env.RUNE_MINT}`)
            )
        );
    
        if (!isValidTransaction(subscanData)) {
          return res.status(400).json({ message: "Invalid transaction." });
        }
    
        // Save transaction if valid
        try {
          const newTransaction = new Transaction({ hash, walletAddress });
          const savedTransaction = await new Transaction(newTransaction).save();
          res.status(201).json(savedTransaction);
        } catch (error: any) {
          res.status(500).json({ message: error.message });
        }
      } else {
        const text = await subscanResponse.text();
        console.error('Unexpected response:', text);
        return res.status(500).json({ message: 'Invalid server response' });
      }
  } else {
    res.status(405).end();
  }
}
