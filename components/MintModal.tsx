// components/MintModal.tsx
import React from 'react';
import styles from '../styles/MintModal.module.css';

interface MintModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactionHash: string;
  mintStatus: string;
}

const MintModal: React.FC<MintModalProps> = ({
    isOpen,
    onClose,
    transactionHash,
    mintStatus, // Add this
  }) => {
    if (!isOpen) return null;
  
    const handleOutsideClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (event.target === event.currentTarget) {
        onClose();
      }
    }
  
    // Content based on the mintStatus
    let modalContent;
    switch (mintStatus) {
      case 'minting':
        modalContent = (
          <>
            <h2>Minting in Progress...</h2>
            <p>Please do not close or refresh your browser.</p>
            {/* You might want to add a loading spinner or animation here */}
          </>
        );
        break;
      case 'completed':
        modalContent = (
          <>
            <h2>Mint Successful!</h2>
            <p>Your transaction has been processed.</p>
            <a href={`${process.env.NEXT_PUBLIC_SCAN_URL}${transactionHash}`} className={styles.link} target="_blank" rel="noopener noreferrer">
              View on Subscan
            </a>
          </>
        );
        break;
      default:
        modalContent = <p>Waiting for action...</p>;
    }
  
    return (
      <div className={styles.modal} onClick={handleOutsideClick} style={{ display: isOpen ? 'flex' : 'none' }}>
        <div className={styles.modalContent}>
          <button className={styles.closeButton} onClick={onClose}>&times;</button>
          {modalContent}
        </div>
      </div>
    );
  };
  
  export default MintModal;
