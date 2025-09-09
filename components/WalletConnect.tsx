import { Button } from "@/components/ui/button";
import { useWallet } from "@/contexts/WalletContext";
import { shortenAddress } from "@/lib/utils";

export function WalletConnect() {
  const { account, connectWallet, disconnectWallet, isConnected, isCorrectNetwork } = useWallet();

  return (
    <div>
      {!isConnected ? (
        <Button onClick={connectWallet} variant="default">
          Connect Wallet
        </Button>
      ) : (
        <div className="flex items-center gap-2">
          {!isCorrectNetwork && (
            <span className="text-red-500 text-sm">Wrong Network</span>
          )}
          <Button 
            onClick={disconnectWallet}
            variant="outline"
            className="flex items-center gap-2"
          >
            <span>{shortenAddress(account || '')}</span>
            <span>⏻</span>
          </Button>
        </div>
      )}
    </div>
  );
}
