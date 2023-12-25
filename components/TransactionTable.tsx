import React from 'react';
import homeStyles from '../styles/Home.module.css';

// Define the base URL for the blockchain explorer
const EXPLORER_BASE_URL = process.env.NEXT_PUBLIC_SCAN_URL || 'https://polkadot.subscan.io/extrinsic/';

interface Transaction {
  hash: string;
  action: string;
  tick: string;
  amount: number;
  timestamp: string;
  // Other fields as needed
}

interface TransactionTableProps {
  transactions: Transaction[];
}

// Function to format the transaction hash
const formatHash = (hash: string): string => {
  if (hash.length > 10) {
    return `${hash.slice(0, 10)}...${hash.slice(-3)}`;
  } else {
    return hash;
  }
};

const TransactionTable = ({ transactions = [] }: TransactionTableProps) => {
  return (
    <div className={homeStyles.tableContainer}>
      <table className={homeStyles.table}>
        <thead>
          <tr>
            <th>Hash</th>
            <th className={homeStyles.hideOnMobile}>Action</th>
            <th className={homeStyles.hideOnMobile}>Tick</th>
            <th className={homeStyles.hideOnMobile}>Amount</th>
            <th className={homeStyles.hideOnMobile}>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction, index) => (
            <tr key={index}>
              <td>
                <a href={`${EXPLORER_BASE_URL}${transaction.hash}`} className={homeStyles.link} target="_blank" rel="noopener noreferrer">
                  {formatHash(transaction.hash)}
                </a>
              </td>
              <td className={homeStyles.hideOnMobile}>{transaction.action}</td>
              <td className={homeStyles.hideOnMobile}>{transaction.tick}</td>
              <td className={homeStyles.hideOnMobile}>{transaction.amount}</td>
              <td className={homeStyles.hideOnMobile}>{transaction.timestamp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


export default TransactionTable;
