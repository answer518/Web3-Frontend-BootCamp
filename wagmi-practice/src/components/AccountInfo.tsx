"use client";

import { useAccount, useBalance } from "wagmi";
import { linkTokenAddress } from "@/constants/addresses";
import { GetBalanceReturnType } from "wagmi/actions";

interface AccountInfoProps {
  balance: GetBalanceReturnType | undefined;
}

export const AccountInfo = ({ balance }: AccountInfoProps) => {
  const { address, isConnected } = useAccount();
  const { data: ethBalance } = useBalance({
    address,
  });

  if (!isConnected) {
    return null;
  }

  return (
    <div className="card w-96 bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Account Info</h2>
        <p>Address: {address}</p>
        <p>
          ETH Balance: {ethBalance?.formatted} {ethBalance?.symbol}
        </p>
        <p>
          LINK Balance: {balance?.formatted} {balance?.symbol}
        </p>
      </div>
    </div>
  );
};