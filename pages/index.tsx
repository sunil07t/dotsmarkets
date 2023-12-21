// pages/index.tsx
import React, { useState } from 'react';
import WalletConnectModal from '../components/WalletConnectModal';
import LoadingIndicator from '../components/LoadingIndicator';
import { connectWallet, mintInscription } from '../services/polkadot';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import styles from '@/styles/Home.module.css'
import { toast } from 'react-toastify';
import Image from 'next/image';
import classNames from 'classnames';

const Home: React.FC = () => {
  const [account, setAccount] = useState<InjectedAccountWithMeta | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isMinting, setIsMinting] = useState<boolean>(false);
  const [transactionHash, setTransactionHash] = useState<string>('');

  const [isNavCollapsed, setIsNavCollapsed] = useState(true);

  const handleNavCollapse = () => setIsNavCollapsed(!isNavCollapsed);

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

  const formatAccountAddress = (address: string): string => {
    if (address.length > 0) {
      return `${address.slice(0, 5)}...${address.slice(-3)}`;
    } else {
      return address;
    }
  }

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
            <a href="" className={styles.navItem}>HOME</a>
            <a href="https://dots-markets.gitbook.io/dots-markets-litepaper/" target="_" className={styles.navItem}>LITEPAPER</a>
            <div className={styles.navInactive}>MARKETPLACE (COMING)</div>
          </nav>
          <nav className={styles.navbar}>
            <div className={styles.navInactive}>MY ASSETS (COMING)</div>
            <a href="#marketplace" className={styles.navItem}>
            <Image src="lang.svg" alt="Language Logo" width={22} height={22} />
            </a>
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
          <a href="" className={styles.navItem}>HOME</a>
          <a href="https://dots-markets.gitbook.io/dots-markets-litepaper/" target="_" className={styles.navItem}>LITEPAPER</a>
          <div className={styles.navInactive}>MARKETPLACE (COMING)</div>
          <div className={styles.navInactive}>MY ASSETS (COMING)</div>
        </nav>
      </div>
      <div className={classNames(styles.hLine, { [styles.menuOpen]: !isNavCollapsed })}></div>
      <main className={classNames(styles.main, { [styles.menuOpen]: !isNavCollapsed })}>
        <div className={styles.mintSection}>
          <h1 className={styles.title}>The First Polkadot Inscription</h1>
          <div className={styles.protocol}>
            <Image src="protocol.svg" alt="PRC-20" width={206} height={44} />
          </div>
          <div className={styles.protocolMobile}>
            Powered By PRC-20
          </div>
          <div className={styles.mintProgress}>
            <div className={styles.mintInfo}>
              <div className={styles.mintStatus}>Mint Progress</div>
              <div className={styles.mintStats}>
                <div className={styles.mintStatsTitle}>Total Supply:</div>
                <div className={styles.mintStatsValue}>42,000,000,000.00</div>
              </div>
              <div className={styles.mintStats}>
                <div className={styles.mintStatsTitle}> Mint Time:</div>
                <div className={styles.mintStatsValue}>TBA DEC. 2023 UTC+0</div>
              </div>
            </div>
            <div className={styles.progressBarInfo}>
              <div className={styles.progressStats}>Minted</div>
              <div className={styles.progressStats}>Soon</div>
            </div>
            <div className={styles.progressBar}>
              <div className={styles.progress} style={{ width: '0%' }}></div>
            </div>
          </div>
          <button className={styles.mintBtn}>Mint Soon</button>
        </div>
      </main>

      <footer className={styles.footer}>
        <a href="https://twitter.com/dotsmarkets" target="_" className={styles.xlogo}>
          <Image src="x.svg" alt="X Logo" width={30} height={30} />
        </a>
        <div className={styles.footerContent}>
          © 2023 DOTS MARKETS. All rights reserved.
        </div>
      </footer>

    </div>
  );

  // return (
  //   <div className={styles.container}>
  //     <WalletConnectModal
  //       isOpen={isModalOpen}
  //       onClose={() => setIsModalOpen(false)}
  //       onWalletSelect={handleWalletSelect}
  //     />
  //     <nav className={styles.navbar}>
  //       <div className={styles.logo}>LOGO</div>
  //       <ul className={styles.navItems}>
  //         <li>Home</li>
  //         <li>Roadmap</li>
  //         <li>Document</li>
  //       </ul>
  //       {account && (
  //       <div className={styles.accountInfo}>
  //         <h2>Connected Account:</h2>
  //         <p>{account.address}</p>
  //       </div>
  //     )}
  //       {!isConnected ? (
  //       <button onClick={handleConnectWallet} className={styles.connectWalletBtn}>
  //         Connect Wallet
  //       </button>
  //         ) : (
  //           <button onClick={handleDisconnectWallet} className={styles.connectWalletBtn}>
  //             Disconnect
  //           </button>
  //         )}
  //     </nav>

  //     {transactionHash && <div className={styles.successHash}>Transaction Hash: {transactionHash}</div>}

  //     <div className={styles.mainContent}>
  //       <div className={styles.card}>
  //       <button onClick={handleMint} className={styles.mintBtn} disabled={isMinting}>
  //           {isMinting ? <LoadingIndicator /> : 'Mint'}
  //         </button>
  //       </div>
  //     </div>

  //   </div>
  // );
};

export default Home;
