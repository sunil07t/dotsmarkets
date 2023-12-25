// pages/assets.tsx
import React, { useState, useEffect } from 'react';
import WalletConnectModal from '../components/WalletConnectModal';
import LoadingIndicator from '../components/LoadingIndicator';
import { connectWallet, mintInscription } from '../services/polkadot';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import styles from '@/styles/Home.module.css';
import { toast } from 'react-toastify';
import Image from 'next/image';
import classNames from 'classnames';
import Link from 'next/link'; // Import at the top of your file
import TransactionTable from '../components/TransactionTable';


const AssetsPage = () => {
    const [transactions, setTransactions] = useState([]);
    const [totalTokens, setTotalTokens] = useState(0);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isNavCollapsed, setIsNavCollapsed] = useState(true);
    const [account, setAccount] = useState<InjectedAccountWithMeta | null>(null);
    const [isConnected, setIsConnected] = useState<boolean>(false);

    useEffect(() => {
    const savedAccount = localStorage.getItem('wallet');
    if (savedAccount) {
        setAccount(JSON.parse(savedAccount).account);
        setIsConnected(true);
        fetchTransactions();
    }
    }, []);

    const fetchTransactions = async () => {
        // await sleep(5000);
        const savedAccount = localStorage.getItem('wallet');
        if (!savedAccount) {
          console.log('Wallet is not connected');
          return;
        }
        setLoading(true);
        try {
          // Include the walletAddress in the API call
          const response = await fetch(`/api/transactions/user?walletAddress=${JSON.parse(savedAccount).account.address}`);
          const data = await response.json();
          setTransactions(data.transactions);
          const total = data.transactions.reduce((acc: number, transaction: any) => acc + parseFloat(transaction.amount), 0);
          setTotalTokens(total);
          setLoading(false);
        } catch (error) {
          console.error('Failed to fetch transactions:', error);
          setLoading(false);
        }
    };

    // function sleep(ms: number) {
    //     return new Promise(resolve => setTimeout(resolve, ms));
    //   }
      
    const handleNavCollapse = () => setIsNavCollapsed(!isNavCollapsed);
  
    const handleConnectWallet = () => {
      setIsModalOpen(true);
    };
  
    const handleDisconnectWallet = () => {
        setAccount(null);
        setIsConnected(false);
        localStorage.removeItem('wallet'); // Clear from localStorage
      };
  
    const handleWalletSelect = async (walletName: string) => {
        setIsModalOpen(false);
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
            const selectedAccount = walletAccounts[0];
            localStorage.setItem('wallet', JSON.stringify({ account: selectedAccount, type: walletPrefix }));
            setAccount(selectedAccount); 
            setIsConnected(true);
            fetchTransactions();
          } else {
            console.log(`No accounts found for ${walletName}.`);
            toast.warn('Wallet not found - try different wallet');
          }
        } catch (error) {
          console.error(`Failed to connect to ${walletName}:`, error);
        }
      };
  
    const formatAccountAddress = (address: string): string => {
      if (address.length > 0) {
        return `${address.slice(0, 5)}...${address.slice(-3)}`;
      } else {
        return address;
      }
    }

  return (
    <div className={styles.container}>
        <WalletConnectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onWalletSelect={handleWalletSelect}
      />

      <header className={styles.header}>
      <div className={classNames(styles.headerContainer, { [styles.menuOpen]: !isNavCollapsed })}>
        <div className={styles.leftNav}>
          <div className={styles.hamburger} onClick={handleNavCollapse}>
          {isNavCollapsed ? (
                <Image src="/hamburger.svg" alt="Menu" width={25} height={25} />
              ) : (
                <Image src="/close.svg" alt="Close" width={25} height={25} />
              )}
          </div>
          <div className={`${styles.logo}`}>
            <Image src="logo.svg" alt="DOTS Logo" width={135} height={77} />
          </div>
          <div className={classNames(styles.logoMobile, { [styles.menuOpen]: !isNavCollapsed })}>
            <Image src="/logoMobile.png" alt="DOTS Logo" width={92} height={52} />
          </div>
        </div>
        <nav className={styles.navContent}>
          <nav className={styles.navbar}>
          <Link href="/">
            <div className={styles.navItem}>HOME</div>
          </Link>            
            <a href="https://dots-markets.gitbook.io/dots-markets-litepaper/" target="_" className={styles.navItem}>LITEPAPER</a>
            <div className={styles.navInactive}>MARKETPLACE (COMING)</div>
          </nav>
          <nav className={styles.navbar}>
          <Link href="/assets">
            <div className={styles.navItem}>MY ASSETS</div>
          </Link>  
          {/* <a href="" className={styles.navItem}>
            <Image src="lang.svg" alt="Language Logo" width={22} height={22} />
            </a> */}
          {account && (<div className={styles.navItem}>{formatAccountAddress(account.address)}</div>)}
          </nav>
        </nav>
        {!isConnected ? (
          <button onClick={handleConnectWallet} className={classNames(styles.connectWalletBtn, { [styles.menuOpen]: !isNavCollapsed })}>
            CONNECT WALLET
          </button>
          ) : (
            <button onClick={handleDisconnectWallet} className={classNames(styles.connectWalletBtn, { [styles.menuOpen]: !isNavCollapsed })}>
              DISCONNECT
            </button>
          )}
        </div>
      </header>
      <div className={classNames(styles.navOverlay, { [styles.menuOpen]: !isNavCollapsed })}>
        <nav className={styles.navItemsCentered}>
            <Link href="/">
            <div className={styles.navItem}>HOME</div>
            </Link> 
          <a href="https://dots-markets.gitbook.io/dots-markets-litepaper/" target="_" className={styles.navItem}>LITEPAPER</a>
          <Link href="/assets">
            <div className={styles.navItem}>MY ASSETS</div>
          </Link> 
          <div className={styles.navInactive}>MARKETPLACE (COMING)</div>
        </nav>
      </div>
      <div className={classNames(styles.hLine, { [styles.menuOpen]: !isNavCollapsed })}></div>

      <main className={classNames(styles.main, { [styles.menuOpen]: !isNavCollapsed })}>
        <div className={styles.mintSection}>

        <div className={styles.totalTokens}>
        <h2>Total Tokens: {totalTokens}</h2>
        </div>
        <TransactionTable transactions={transactions} />
        {loading && (
          <div className={styles.loading}>Loading...</div>
        )}
        </div>
      </main>

      {/* <footer className={classNames(styles.footer, { [styles.menuOpen]: !isNavCollapsed })}>
        <a href="https://twitter.com/dotsmarkets" target="_" className={styles.xlogo}>
          <Image src="x.svg" alt="X Logo" width={30} height={30} />
        </a>
        <div className={styles.footerContent}>
          © 2023 DOTS MARKETS. All rights reserved.
        </div>
      </footer> */}

    </div>
  );
};

export default AssetsPage;
