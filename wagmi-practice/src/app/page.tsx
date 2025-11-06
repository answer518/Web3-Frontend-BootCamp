"use client";

import { AccountInfo } from "@/components/AccountInfo";
import { ConnectWallet } from "@/components/ConnectWallet";
import { Erc20Actions } from "@/components/Erc20Actions";
import { TokenBank } from "@/components/TokenBank";
import { linkTokenAddress } from "@/constants/addresses";
import { useAccount, useBalance } from "wagmi";

export default function Home() {
  const { address } = useAccount();
  const { data: balance, refetch } = useBalance({
    address,
    token: linkTokenAddress,
  });

  return (
    <div className="flex flex-col items-center py-20">
      <h1 className="text-4xl font-bold mb-8">Wagmi DApp</h1>
      <ConnectWallet />
      <div className="flex space-x-4 mt-8">
        <AccountInfo balance={balance} />
        <Erc20Actions />
        <TokenBank refetchBalance={refetch} />
      </div>
    </div>
  );
}
