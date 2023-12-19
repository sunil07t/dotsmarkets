// pages/index.tsx
import React, { useState } from 'react';
import WalletConnectModal from '../components/WalletConnectModal';
import LoadingIndicator from '../components/LoadingIndicator';
import { connectWallet, mintInscription } from '../services/polkadot';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import styles from '@/styles/Home.module.css'
import { toast } from 'react-toastify';

const Home: React.FC = () => {
  const [account, setAccount] = useState<InjectedAccountWithMeta | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isMinting, setIsMinting] = useState<boolean>(false);
  const [transactionHash, setTransactionHash] = useState<string>('');

  const handleConnectWallet = () => {
    setIsModalOpen(true);
  };


  const handleWalletSelect = async (walletName: string) => {
    setIsModalOpen(false);
    // Map the user-friendly wallet name to the known wallet prefix
    const walletPrefixMap: { [key: string]: string } = {
      'Talisman': 'talisman',
      'SubWallet': 'subwallet-js',
      'Polkadot.js': 'polkadot-js'
    };
  
    const walletPrefix = walletPrefixMap[walletName];
    if (!walletPrefix) {
      console.error(`Unknown wallet: ${walletName}`);
      return;
    }
  
    try {
      const walletAccounts = await connectWallet(walletPrefix);
      if (walletAccounts.length > 0) {
        setAccount(walletAccounts[0]); 
        setIsConnected(true)
      } else {
        console.log(`No accounts found for ${walletName}.`);
      }
    } catch (error) {
      console.error(`Failed to connect to ${walletName}:`, error);
    }
  };

  const handleMint = async () => {
    if (!account) {
      toast.error("Please connect your wallet first.");
      return;
    }
    setIsMinting(true);

    try {
      const inscriptionData = '{"p":"pox-20","op":"mint","tick":"poxa","amt":"1000"}';
      const hash = await mintInscription(account, inscriptionData);
      toast.success("Transaction success:, " + hash);
      setTransactionHash(hash.toString());
      console.log('Transaction hash:', hash);
    } catch (error: any) {
      if (error.message.includes('User denied transaction signature')) {
        setIsMinting(false);
        toast.info("Transaction cancelled by user.");
      } else {
        setIsMinting(false);
        console.error('Error minting inscription:', error);
        toast.error("Error minting inscription.");
      }
    } finally {
      setIsMinting(false);
    }
  };

  const handleDisconnectWallet = () => {
    setAccount(null);
    setIsConnected(false)
  };

  return (
    <div className={styles.container}>
      <WalletConnectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onWalletSelect={handleWalletSelect}
      />
      <nav className={styles.navbar}>
        <div className={styles.logo}>LOGO</div>
        <ul className={styles.navItems}>
          <li>Home</li>
          <li>Roadmap</li>
          <li>Document</li>
        </ul>
        {account && (
        <div className={styles.accountInfo}>
          <h2>Connected Account:</h2>
          <p>{account.address}</p>
        </div>
      )}
        {!isConnected ? (
        <button onClick={handleConnectWallet} className={styles.connectWalletBtn}>
          Connect Wallet
        </button>
          ) : (
            <button onClick={handleDisconnectWallet} className={styles.connectWalletBtn}>
              Disconnect
            </button>
          )}
      </nav>

      {transactionHash && <div className={styles.successHash}>Transaction Hash: {transactionHash}</div>}

      <div className={styles.mainContent}>
        <div className={styles.card}>
        <button onClick={handleMint} className={styles.mintBtn} disabled={isMinting}>
            {isMinting ? <LoadingIndicator /> : 'Mint'}
          </button>
        </div>
      </div>

    </div>
  );
};

export default Home;
