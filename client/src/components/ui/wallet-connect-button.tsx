// src/components/ui/wallet-connect-button.tsx
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useCallback, useEffect, useState } from 'react';

export function WalletConnectButton() {
  const { publicKey, wallet, disconnect, connected } = useWallet();
  const { setVisible } = useWalletModal();
  const [walletAddress, setWalletAddress] = useState<string>('');

  useEffect(() => {
    if (publicKey) {
      const address = publicKey.toString();
      setWalletAddress(`${address.slice(0, 4)}...${address.slice(-4)}`);
    }
  }, [publicKey]);

  const handleConnectClick = useCallback(() => {
    if (connected) {
      disconnect();
    } else {
      setVisible(true);
    }
  }, [connected, disconnect, setVisible]);

  return (
    <button
      onClick={handleConnectClick}
      className="bg-background hover:bg-primary/20 text-primary border border-primary/30 font-mono py-2 px-4 rounded-sm transition-colors relative overflow-hidden group"
    >
      <span className="relative z-10 flex items-center">
        <span className="w-1.5 h-1.5 rounded-full bg-primary mr-2 animate-pulse"></span>
        {connected ? `WALLET: ${walletAddress}` : 'CONNECT WALLET'}
      </span>
      <span className="absolute inset-0 translate-y-full bg-primary/10 transition-transform duration-300 group-hover:translate-y-0"></span>
    </button>
  );
}