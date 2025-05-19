import { useState } from 'react';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';

export default function WalletConnection() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [balance, setBalance] = useState(null);

  const connectWallet = async () => {
    if (window?.solana?.isPhantom) {
      try {
        const response = await window.solana.connect();
        const pubKey = response.publicKey.toString();
        setWalletAddress(pubKey);
        await checkBalance(pubKey);
      } catch (error) {
        console.error('Error connecting wallet:', error);
      }
    } else {
      alert('Please install Phantom wallet!');
    }
  };

  const checkBalance = async (address) => {
    try {
      const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
      const publicKey = new PublicKey(address);
      const balance = await connection.getBalance(publicKey);
      setBalance(balance / 1000000000); // Convert lamports to SOL
    } catch (error) {
      console.error('Error checking balance:', error);
    }
  };

  return (
    <div className="wallet-container">
      {!walletAddress ? (
        <button onClick={connectWallet}>Connect Phantom Wallet</button>
      ) : (
        <div>
          <p>Connected: {walletAddress.slice(0, 4)}...{walletAddress.slice(-4)}</p>
          {balance !== null && <p>Balance: {balance} SOL</p>}
        </div>
      )}
    </div>
  );
}
