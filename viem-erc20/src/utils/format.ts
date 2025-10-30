import { formatUnits } from 'viem';

/**
 * 格式化以太坊地址，显示前6位和后4位，中间用省略号连接
 * @param address - 以太坊地址
 * @param startLength - 开头显示的字符数，默认6
 * @param endLength - 结尾显示的字符数，默认4
 * @returns 格式化后的地址字符串
 */
export function formatAddress(
  address: string | undefined,
  startLength: number = 6,
  endLength: number = 4
): string {
  if (!address) return '';
  if (address.length <= startLength + endLength) return address;
  
  return `${address.slice(0, startLength)}...${address.slice(-endLength)}`;
}

/**
 * 格式化代币数量，添加千分位分隔符并保留指定小数位
 * @param value - 代币数量（bigint 或 string）
 * @param decimals - 代币精度，默认18
 * @param displayDecimals - 显示的小数位数，默认4
 * @returns 格式化后的数量字符串
 */
export function formatTokenAmount(
  value: bigint | string | undefined,
  decimals: number = 18,
  displayDecimals: number = 4
): string {
  if (!value) return '0';
  
  try {
    const formatted = formatUnits(BigInt(value), decimals);
    const number = parseFloat(formatted);
    
    // 如果数量很小，显示更多小数位
    if (number > 0 && number < 0.0001) {
      return number.toExponential(2);
    }
    
    // 使用 toLocaleString 添加千分位分隔符
    return number.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: displayDecimals,
    });
  } catch (error) {
    console.error('Error formatting token amount:', error);
    return '0';
  }
}

/**
 * 格式化 ETH 数量
 * @param value - ETH 数量（bigint 或 string）
 * @param displayDecimals - 显示的小数位数，默认4
 * @returns 格式化后的 ETH 数量字符串
 */
export function formatEthAmount(
  value: bigint | string | undefined,
  displayDecimals: number = 4
): string {
  return formatTokenAmount(value, 18, displayDecimals);
}

/**
 * 格式化交易哈希
 * @param hash - 交易哈希
 * @param startLength - 开头显示的字符数，默认8
 * @param endLength - 结尾显示的字符数，默认6
 * @returns 格式化后的交易哈希
 */
export function formatTxHash(
  hash: string | undefined,
  startLength: number = 8,
  endLength: number = 6
): string {
  if (!hash) return '';
  if (hash.length <= startLength + endLength) return hash;
  
  return `${hash.slice(0, startLength)}...${hash.slice(-endLength)}`;
}

/**
 * 格式化时间戳为可读的时间字符串
 * @param timestamp - 时间戳（秒）
 * @returns 格式化后的时间字符串
 */
export function formatTimestamp(timestamp: number | undefined): string {
  if (!timestamp) return '';
  
  const date = new Date(timestamp * 1000);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

/**
 * 格式化百分比
 * @param value - 数值
 * @param decimals - 小数位数，默认2
 * @returns 格式化后的百分比字符串
 */
export function formatPercentage(
  value: number | undefined,
  decimals: number = 2
): string {
  if (value === undefined || value === null) return '0%';
  
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * 格式化数字，添加单位（K, M, B）
 * @param value - 数值
 * @param decimals - 小数位数，默认1
 * @returns 格式化后的数字字符串
 */
export function formatNumber(
  value: number | undefined,
  decimals: number = 1
): string {
  if (!value || value === 0) return '0';
  
  const absValue = Math.abs(value);
  const sign = value < 0 ? '-' : '';
  
  if (absValue >= 1e9) {
    return `${sign}${(absValue / 1e9).toFixed(decimals)}B`;
  } else if (absValue >= 1e6) {
    return `${sign}${(absValue / 1e6).toFixed(decimals)}M`;
  } else if (absValue >= 1e3) {
    return `${sign}${(absValue / 1e3).toFixed(decimals)}K`;
  }
  
  return `${sign}${absValue.toLocaleString('en-US', {
    maximumFractionDigits: decimals,
  })}`;
}

/**
 * 复制文本到剪贴板
 * @param text - 要复制的文本
 * @returns Promise<boolean> - 是否复制成功
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}

/**
 * 验证以太坊地址格式
 * @param address - 地址字符串
 * @returns 是否为有效的以太坊地址
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * 验证数字输入
 * @param value - 输入值
 * @param min - 最小值，默认0
 * @param max - 最大值，可选
 * @returns 是否为有效数字
 */
export function isValidNumber(
  value: string,
  min: number = 0,
  max?: number
): boolean {
  const num = parseFloat(value);
  if (isNaN(num) || num < min) return false;
  if (max !== undefined && num > max) return false;
  return true;
}