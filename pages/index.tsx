// pages/index.tsx
import React, { useState } from 'react';
import WalletConnectModal from '../components/WalletConnectModal';
import { connectWallet } from '../services/polkadot';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import styles from '@/styles/Home.module.css'

const Home: React.FC = () => {
  const [account, setAccount] = useState<InjectedAccountWithMeta | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(false);

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
      // ... handle unknown wallet case
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
          <li>HOME</li>
          <li>GRANT</li>
          <li>ROADMAP</li>
          <li>DOCUMENT</li>
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

      <div className={styles.mainContent}>
        <div className={styles.card}>
          <button className={styles.mintBtn}>Mint</button>
        </div>
      </div>

    </div>
  );
};

export default Home;
