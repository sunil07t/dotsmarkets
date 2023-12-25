import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../lib/dbConnect';
import Transaction from '../../../models/Transaction';
import fetch from 'node-fetch';

// 70929558 > 60000000 ROC & 212383222 > 180000000 DOT 
const mint_min = process.env.MIN_MINT ? process.env.MIN_MINT : '180000000';
const MIN_TRANSFER_AMOUNT_PLANCKS = parseInt(mint_min);// 0.018 DOTs in Plancks


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
    params: string;
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
    let url = process.env.SUBSCAN_PAI_URL

    if(!url) {
      console.log('Please add the Subscan API URL')
      url = '';
    }
    
    const subscanResponse = await fetch(url, {
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
        subscanData.data.event.some((event: Event) => {
            if (event.module_id === "balances" && event.event_id === "Transfer") {
              const params = JSON.parse(event.params);
              const amountParam = params.find((param: { type_name: string; value: string; }) =>
                param.type_name === "Balance"
              );
              if (amountParam) {
                const amount = parseFloat(amountParam.value);
                console.log(amount)
                console.log(MIN_TRANSFER_AMOUNT_PLANCKS)
                return amount >= MIN_TRANSFER_AMOUNT_PLANCKS;
              }
            }
            return false;
          }) &&
        subscanData.data.event.some((event: Event) =>
            event.module_id === "balances" &&
            event.event_id === "Transfer" 
            && event.params.includes(`${process.env.MULTISIG_ADDRESS}` )
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
