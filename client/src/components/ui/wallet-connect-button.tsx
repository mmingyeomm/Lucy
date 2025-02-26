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
      className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
    >
      {connected ? `연결됨: ${walletAddress}` : '지갑 연결'}
    </button>
  );
}
