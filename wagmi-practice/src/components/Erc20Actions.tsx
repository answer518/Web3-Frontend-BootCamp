"use client";

import { useState, useEffect } from 'react';
import { type BaseError, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { erc20Abi } from "@/constants/abi";
import { tokenBankAddress, linkTokenAddress } from "@/constants/addresses";
import { toast } from 'react-hot-toast';
import { useAccount } from 'wagmi';
import { useQueryClient } from '@tanstack/react-query';

interface WagmiError extends Error {
  shortMessage?: string;
}

const formatError = (error: WagmiError) => {
  if (error?.shortMessage) {
    return error.shortMessage;
  }
  return error.message;
};

export const Erc20Actions = () => {
  const [approveAmount, setApproveAmount] = useState("");
  const [transferTo, setTransferTo] = useState("");
  const [transferAmount, setTransferAmount] = useState("");

  const { data: approveHash, error: approveError, isPending: isApprovePending, writeContract: approve } = useWriteContract();
  const { data: transferHash, error: transferError, isPending: isTransferPending, writeContract: transfer } = useWriteContract();

  const handleApprove = (e: React.FormEvent) => {
    e.preventDefault();
    approve({ abi: erc20Abi, address: linkTokenAddress, functionName: 'approve', args: [tokenBankAddress, parseEther(approveAmount)] });
  }

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    transfer({ abi: erc20Abi, address: linkTokenAddress, functionName: 'transfer', args: [transferTo as `0x${string}`, parseEther(transferAmount)] });
  }

  const { isLoading: isApproveConfirming, isSuccess: isApproveSuccess } = useWaitForTransactionReceipt({ hash: approveHash });
  const { isLoading: isTransferConfirming, isSuccess: isTransferSuccess } = useWaitForTransactionReceipt({ hash: transferHash });

  const queryClient = useQueryClient();

  useEffect(() => {
    if (isApproveSuccess) {
      toast.success('授权成功');
      queryClient.invalidateQueries();
    }
    if (approveError) {
      toast.error((approveError as BaseError).shortMessage || approveError.message);
    }
  }, [isApproveSuccess, approveError, queryClient]);

  useEffect(() => {
    if (isTransferSuccess) {
      toast.success('转账成功');
      queryClient.invalidateQueries();
    }
    if (transferError) {
      toast.error((transferError as BaseError).shortMessage || transferError.message);
    }
  }, [isTransferSuccess, transferError, queryClient]);

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-xl font-semibold mb-2">ERC20 Actions</h2>
      <form onSubmit={handleApprove} className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={approveAmount}
            onChange={(e) => setApproveAmount(e.target.value)}
            placeholder="Amount to approve"
            className="input input-bordered w-full"
          />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isApprovePending || isApproveConfirming || !approveAmount}
          >
            {isApprovePending && "等待钱包确认..."}
            {isApproveConfirming && "交易确认中..."}
            {!isApprovePending && !isApproveConfirming && "Approve"}
          </button>
        </div>
      </form>
      {isApproveSuccess && <p>Approve successful!</p>}
      {approveError && (
        <p className="text-red-500">Error: {formatError(approveError)}</p>
      )}

      <div className="divider"></div>

      <form onSubmit={handleTransfer} className="flex flex-col gap-4 mt-4">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={transferTo}
            onChange={(e) => setTransferTo(e.target.value)}
            placeholder="Recipient address"
            className="input input-bordered w-full"
          />
          <input
            type="text"
            value={transferAmount}
            onChange={(e) => setTransferAmount(e.target.value)}
            placeholder="Amount to transfer"
            className="input input-bordered w-full"
          />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={
              isTransferPending ||
              isTransferConfirming ||
              !transferAmount ||
              !transferTo
            }
          >
            {isTransferPending && "等待钱包确认..."}
            {isTransferConfirming && "交易确认中..."}
            {!isTransferPending && !isTransferConfirming && "Transfer"}
          </button>
        </div>
      </form>
      {isTransferSuccess && <p>Transfer successful!</p>}
      {transferError && (
        <p className="text-red-500">Error: {formatError(transferError)}</p>
      )}
    </div>
  );
};