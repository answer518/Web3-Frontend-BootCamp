"use client";

import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { tokenBankAddress, linkTokenAddress } from "@/constants/addresses";
import { tokenBankABI, erc20Abi } from "@/constants/abi";
import { BaseError, formatUnits, parseEther } from "viem";
import { useState, useEffect } from "react";
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

interface WagmiError extends Error {
  shortMessage?: string;
}

const formatError = (error: WagmiError) => {
  if (error?.shortMessage) {
    return error.shortMessage;
  }
  return error.message;
};

interface TokenBankProps {
  refetchBalance: () => void;
}

export const TokenBank = ({ refetchBalance }: TokenBankProps) => {
  const { address, isConnected } = useAccount();
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const isDepositAmountValid =
    !isNaN(parseFloat(depositAmount)) && parseFloat(depositAmount) > 0;

  const isWithdrawAmountValid =
    !isNaN(parseFloat(withdrawAmount)) && parseFloat(withdrawAmount) > 0;

  const { data: totalDeposited, isError: isTotalDepositedError, error: totalDepositedError, refetch: refetchTotalDeposited, isLoading: isTotalDepositedLoading } = useReadContract({
    abi: tokenBankABI,
    address: tokenBankAddress,
    functionName: "totalDeposits",
    query: { enabled: isConnected },
  });

  const {
    data: userDeposit,
    isError: isUserDepositError,
    isLoading: isUserDepositLoading,
    error: userDepositError,
    refetch: refetchUserDeposit,
  } = useReadContract({
    address: tokenBankAddress,
    abi: tokenBankABI,
    functionName: "deposits",
    args: [address!],
    query: {
      enabled: isConnected && !!address,
    },
  });

  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: linkTokenAddress,
    abi: erc20Abi,
    functionName: "allowance",
    args: [address!, tokenBankAddress],
    query: { enabled: isConnected && !!address },
  });

  const { data: linkBalance, refetch: refetchLinkBalance } = useReadContract({
    address: linkTokenAddress,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [address!],
    query: { enabled: isConnected && !!address },
  });

  const isAllowanceSufficient =
    allowance !== undefined &&
    isDepositAmountValid &&
    allowance >= (isDepositAmountValid ? parseEther(depositAmount) : BigInt(0));

  const isBalanceSufficient =
    linkBalance !== undefined &&
    isDepositAmountValid &&
    linkBalance >= (isDepositAmountValid ? parseEther(depositAmount) : BigInt(0));

  const isWithdrawSufficient =
    userDeposit !== undefined &&
    isWithdrawAmountValid &&
    userDeposit >= (isWithdrawAmountValid ? parseEther(withdrawAmount) : BigInt(0));

  const {
    data: depositHash,
    error: depositError,
    isPending: isDepositPending,
    writeContract: deposit,
    reset: resetDeposit,
  } = useWriteContract();

  const {
    data: withdrawHash,
    error: withdrawError,
    isPending: isWithdrawPending,
    writeContract: withdraw,
    reset: resetWithdraw,
  } = useWriteContract();

  const { isLoading: isDepositConfirming, isSuccess: isDepositSuccess } =
    useWaitForTransactionReceipt({
      hash: depositHash,
    });

  const { isLoading: isWithdrawConfirming, isSuccess: isWithdrawSuccess } =
    useWaitForTransactionReceipt({
      hash: withdrawHash,
    });

  const queryClient = useQueryClient();

  useEffect(() => {
    if (isDepositSuccess) {
      toast.success('存款成功');
      queryClient.invalidateQueries();
    }
    if (depositError) {
      toast.error((depositError as BaseError).shortMessage || depositError.message);
    }
  }, [isDepositSuccess, depositError, queryClient]);

  useEffect(() => {
    if (isWithdrawSuccess) {
      toast.success('取款成功');
      queryClient.invalidateQueries();
    }
    if (withdrawError) {
      toast.error((withdrawError as BaseError).shortMessage || withdrawError.message);
    }
  }, [isWithdrawSuccess, withdrawError, queryClient]);

  useEffect(() => {
    if (isDepositSuccess || isWithdrawSuccess) {
      refetchBalance();
      refetchTotalDeposited();
      refetchUserDeposit();
      refetchAllowance();
      refetchLinkBalance();
    }
  }, [isDepositSuccess, isWithdrawSuccess, refetchBalance, refetchTotalDeposited, refetchUserDeposit, refetchAllowance, refetchLinkBalance]);

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    deposit({
      address: tokenBankAddress,
      abi: tokenBankABI,
      functionName: "deposit",
      args: [parseEther(depositAmount)],
    });
  };

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    withdraw({
      address: tokenBankAddress,
      abi: tokenBankABI,
      functionName: "withdraw",
      args: [parseEther(withdrawAmount)],
    });
  };

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-xl font-semibold mb-2">TokenBank Info</h2>
      <div className="space-y-2">
        <div>
          <span className="font-semibold">Total Deposited:</span>
          {isTotalDepositedLoading
            ? "Loading..."
            : isTotalDepositedError
            ? `Error: ${formatError(totalDepositedError)}`
            : totalDeposited !== undefined
            ? `${formatUnits(totalDeposited, 18)} LINK`
            : "N/A"}
        </div>
        <div>
          <span className="font-semibold">Your Deposit:</span>
          {isUserDepositLoading
            ? "Loading..."
            : isUserDepositError
            ? `Error: ${formatError(userDepositError)}`
            : userDeposit !== undefined
            ? `${formatUnits(userDeposit, 18)} LINK`
            : "N/A"}
        </div>
        <div>
          <span className="font-semibold">Your LINK Balance:</span>
          <p>
            {linkBalance !== undefined
              ? `${formatUnits(linkBalance, 18)} LINK`
              : "N/A"}
          </p>
        </div>
        <div>
          <span className="font-semibold">Allowance: </span>
          {allowance !== undefined
            ? `${formatUnits(allowance, 18)} LINK`
            : "N/A"}
        </div>
        <form onSubmit={handleDeposit} className="flex flex-col gap-4 mt-4">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={depositAmount}
              onChange={(e) => {
                setDepositAmount(e.target.value);
                if (depositError) {
                  resetDeposit();
                }
              }}
              placeholder="Amount to deposit"
              className="input input-bordered w-full"
            />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!isDepositAmountValid || isDepositPending || isDepositConfirming || !isAllowanceSufficient || !isBalanceSufficient}
            >
              {isDepositPending && "等待钱包确认..."}
              {isDepositConfirming && "交易确认中..."}
              {!isDepositPending && !isDepositConfirming && "Deposit"}
            </button>
          </div>
          {!isBalanceSufficient && isDepositAmountValid && (
            <p className="text-red-500">Insufficient LINK balance.</p>
          )}
          {isBalanceSufficient && !isAllowanceSufficient && isDepositAmountValid && (
            <p className="text-red-500">Insufficient allowance. Please approve first.</p>
          )}
        </form>
        {isDepositSuccess && <p>Deposit successful!</p>}
        {depositError && (
          <p className="text-red-500">Error: {formatError(depositError)}</p>
        )}

        <div className="divider"></div>

        <form onSubmit={handleWithdraw} className="flex flex-col gap-4 mt-4">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={withdrawAmount}
              onChange={(e) => {
                setWithdrawAmount(e.target.value);
                if (withdrawError) {
                  resetWithdraw();
                }
              }}
              placeholder="Amount to withdraw"
              className="input input-bordered w-full"
            />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!isWithdrawAmountValid || isWithdrawPending || isWithdrawConfirming || !isWithdrawSufficient}
            >
              {isWithdrawPending && "等待钱包确认..."}
              {isWithdrawConfirming && "交易确认中..."}
              {!isWithdrawPending && !isWithdrawConfirming && "Withdraw"}
            </button>
          </div>
          {!isWithdrawSufficient && isWithdrawAmountValid && (
            <p className="text-red-500">Insufficient balance to withdraw.</p>
          )}
        </form>
        {isWithdrawSuccess && <p>Withdraw successful!</p>}
        {withdrawError && (
          <p className="text-red-500">Error: {formatError(withdrawError)}</p>
        )}
      </div>
    </div>
  );
};