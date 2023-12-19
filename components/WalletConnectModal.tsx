// components/WalletConnectModal.tsx
import React from 'react';
import styles from '../styles/WalletConnectModal.module.css'


interface WalletConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWalletSelect: (walletName: string) => void;
}

const WalletConnectModal: React.FC<WalletConnectModalProps> = ({ isOpen, onClose, onWalletSelect }) => {
    if (!isOpen) return null;
  
    const handleOutsideClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (event.target === event.currentTarget) {
        onClose();
      }
    }

  
  return (
    <div className={styles.modal} onClick={handleOutsideClick} style={{ display: isOpen ? 'flex' : 'none' }}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>&times;</button>
        <h2>Select a Wallet</h2>
        {/* Map through your wallet options */}
        <button onClick={() => onWalletSelect('Talisman')} className={styles.modalButton}>
          Talisman
        </button>
        <button onClick={() => onWalletSelect('SubWallet')} className={styles.modalButton}>
          SubWallet
        </button>
        <button onClick={() => onWalletSelect('Polkadot.js')} className={styles.modalButton}>
          Polkadot.js
        </button>
      </div>
    </div>
  );
};

export default WalletConnectModal;
