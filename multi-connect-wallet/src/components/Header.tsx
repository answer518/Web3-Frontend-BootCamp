import { ConnectWalletButton } from "./ConnectWalletButton";

export const Header = () => {
  return (
    <header className="w-full p-4 border-b border-gray-200">
      <div className="flex justify-end">
        <ConnectWalletButton />
      </div>
    </header>
  );
};