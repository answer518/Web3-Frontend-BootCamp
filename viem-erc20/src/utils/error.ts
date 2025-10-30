/**
 * 错误处理工具函数
 * 提供统一的 Web3 错误识别、格式化和处理功能
 */

// 错误类型枚举
export enum ErrorType {
  USER_REJECTED = 'USER_REJECTED',
  INSUFFICIENT_FUNDS = 'INSUFFICIENT_FUNDS',
  EXECUTION_REVERTED = 'EXECUTION_REVERTED',
  NETWORK_ERROR = 'NETWORK_ERROR',
  INVALID_ADDRESS = 'INVALID_ADDRESS',
  INVALID_AMOUNT = 'INVALID_AMOUNT',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  CONTRACT_ERROR = 'CONTRACT_ERROR',
  RPC_ERROR = 'RPC_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

// 错误信息接口
export interface ErrorInfo {
  type: ErrorType;
  message: string;
  originalError?: Error;
  suggestion?: string;
}

// 用户友好的错误消息映射
const ERROR_MESSAGES: Record<ErrorType, { message: string; suggestion?: string }> = {
  [ErrorType.USER_REJECTED]: {
    message: '用户取消了交易',
    suggestion: '请重新尝试并在钱包中确认交易'
  },
  [ErrorType.INSUFFICIENT_FUNDS]: {
    message: '余额不足',
    suggestion: '请确保账户有足够的 ETH 支付 Gas 费用'
  },
  [ErrorType.EXECUTION_REVERTED]: {
    message: '交易执行失败',
    suggestion: '请检查交易参数或合约状态'
  },
  [ErrorType.NETWORK_ERROR]: {
    message: '网络连接错误',
    suggestion: '请检查网络连接或稍后重试'
  },
  [ErrorType.INVALID_ADDRESS]: {
    message: '无效的地址格式',
    suggestion: '请输入有效的以太坊地址'
  },
  [ErrorType.INVALID_AMOUNT]: {
    message: '无效的数量',
    suggestion: '请输入有效的数字'
  },
  [ErrorType.PERMISSION_DENIED]: {
    message: '权限不足',
    suggestion: '请确认您有执行此操作的权限'
  },
  [ErrorType.CONTRACT_ERROR]: {
    message: '合约调用失败',
    suggestion: '请检查合约状态或参数'
  },
  [ErrorType.RPC_ERROR]: {
    message: 'RPC 服务错误',
    suggestion: '请稍后重试或切换网络'
  },
  [ErrorType.UNKNOWN_ERROR]: {
    message: '未知错误',
    suggestion: '请重试或联系技术支持'
  }
};

/**
 * 解析错误类型
 * @param error 原始错误对象
 * @returns 错误类型
 */
export function parseErrorType(error: Error | unknown): ErrorType {
  if (!error) return ErrorType.UNKNOWN_ERROR;
  
  const errorMessage = error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();
  
  // 用户拒绝交易
  if (errorMessage.includes('user rejected') || 
      errorMessage.includes('user denied') ||
      errorMessage.includes('user cancelled') ||
      errorMessage.includes('rejected by user')) {
    return ErrorType.USER_REJECTED;
  }
  
  // 余额不足
  if (errorMessage.includes('insufficient funds') ||
      errorMessage.includes('insufficient balance') ||
      errorMessage.includes('not enough') ||
      errorMessage.includes('exceeds balance')) {
    return ErrorType.INSUFFICIENT_FUNDS;
  }
  
  // 交易执行失败
  if (errorMessage.includes('execution reverted') ||
      errorMessage.includes('revert') ||
      errorMessage.includes('transaction failed')) {
    return ErrorType.EXECUTION_REVERTED;
  }
  
  // 权限错误
  if (errorMessage.includes('ownable: caller is not the owner') ||
      errorMessage.includes('access denied') ||
      errorMessage.includes('unauthorized') ||
      errorMessage.includes('permission denied') ||
      errorMessage.includes('not authorized')) {
    return ErrorType.PERMISSION_DENIED;
  }
  
  // 网络错误
  if (errorMessage.includes('network') ||
      errorMessage.includes('connection') ||
      errorMessage.includes('timeout') ||
      errorMessage.includes('fetch')) {
    return ErrorType.NETWORK_ERROR;
  }
  
  // RPC 错误
  if (errorMessage.includes('internal json-rpc error') ||
      errorMessage.includes('rpc error') ||
      errorMessage.includes('server error') ||
      errorMessage.includes('bad gateway')) {
    return ErrorType.RPC_ERROR;
  }
  
  // 合约错误
  if (errorMessage.includes('contract') ||
      errorMessage.includes('call exception') ||
      errorMessage.includes('invalid opcode')) {
    return ErrorType.CONTRACT_ERROR;
  }
  
  // 地址格式错误
  if (errorMessage.includes('invalid address') ||
      errorMessage.includes('address format') ||
      errorMessage.includes('checksum')) {
    return ErrorType.INVALID_ADDRESS;
  }
  
  // 数量格式错误
  if (errorMessage.includes('invalid amount') ||
      errorMessage.includes('invalid number') ||
      errorMessage.includes('parse error')) {
    return ErrorType.INVALID_AMOUNT;
  }
  
  return ErrorType.UNKNOWN_ERROR;
}

/**
 * 格式化错误信息
 * @param error 原始错误对象
 * @param customMessage 自定义错误消息
 * @returns 格式化的错误信息
 */
export function formatError(error: Error | unknown, customMessage?: string): ErrorInfo {
  const errorType = parseErrorType(error);
  const errorConfig = ERROR_MESSAGES[errorType];
  
  return {
    type: errorType,
    message: customMessage || errorConfig.message,
    originalError: error instanceof Error ? error : undefined,
    suggestion: errorConfig.suggestion
  };
}

/**
 * 获取用户友好的错误消息
 * @param error 原始错误对象
 * @param includeDetails 是否包含详细信息
 * @returns 用户友好的错误消息
 */
export function getErrorMessage(error: Error | unknown, includeDetails: boolean = false): string {
  const errorInfo = formatError(error);
  
  let message = errorInfo.message;
  
  if (includeDetails && errorInfo.suggestion) {
    message += `\n建议：${errorInfo.suggestion}`;
  }
  
  return message;
}

/**
 * 检查是否为特定类型的错误
 * @param error 错误对象
 * @param type 错误类型
 * @returns 是否为指定类型的错误
 */
export function isErrorType(error: Error | unknown, type: ErrorType): boolean {
  return parseErrorType(error) === type;
}

/**
 * 检查是否为用户取消的错误
 * @param error 错误对象
 * @returns 是否为用户取消错误
 */
export function isUserRejectedError(error: Error | unknown): boolean {
  return isErrorType(error, ErrorType.USER_REJECTED);
}

/**
 * 检查是否为余额不足错误
 * @param error 错误对象
 * @returns 是否为余额不足错误
 */
export function isInsufficientFundsError(error: Error | unknown): boolean {
  return isErrorType(error, ErrorType.INSUFFICIENT_FUNDS);
}

/**
 * 检查是否为网络错误
 * @param error 错误对象
 * @returns 是否为网络错误
 */
export function isNetworkError(error: Error | unknown): boolean {
  return isErrorType(error, ErrorType.NETWORK_ERROR);
}

/**
 * 检查是否为权限错误
 * @param error 错误对象
 * @returns 是否为权限错误
 */
export function isPermissionError(error: Error | unknown): boolean {
  return isErrorType(error, ErrorType.PERMISSION_DENIED);
}

/**
 * 创建错误处理器
 * @param onError 错误处理回调函数
 * @returns 错误处理器函数
 */
export function createErrorHandler(onError: (errorInfo: ErrorInfo) => void) {
  return (error: Error | unknown) => {
    const errorInfo = formatError(error);
    onError(errorInfo);
  };
}

/**
 * 安全执行异步函数，自动处理错误
 * @param fn 异步函数
 * @param onError 错误处理回调
 * @returns Promise
 */
export async function safeExecute<T>(
  fn: () => Promise<T>,
  onError?: (errorInfo: ErrorInfo) => void
): Promise<T | null> {
  try {
    return await fn();
  } catch (error) {
    const errorInfo = formatError(error);
    if (onError) {
      onError(errorInfo);
    } else {
      console.error('Safe execute error:', errorInfo);
    }
    return null;
  }
}

/**
 * 重试执行函数
 * @param fn 要执行的函数
 * @param maxRetries 最大重试次数
 * @param delay 重试延迟（毫秒）
 * @param onError 错误处理回调
 * @returns Promise
 */
export async function retryExecute<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000,
  onError?: (errorInfo: ErrorInfo, attempt: number) => void
): Promise<T | null> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      const errorInfo = formatError(error);
      
      if (onError) {
        onError(errorInfo, attempt);
      }
      
      // 如果是用户取消的错误，不进行重试
      if (isUserRejectedError(error)) {
        return null;
      }
      
      // 如果是最后一次尝试，抛出错误
      if (attempt === maxRetries) {
        throw error;
      }
      
      // 等待后重试
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  return null;
}