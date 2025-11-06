# Wagmi DApp 需求文档

## 1. 项目概述 (Project Overview)

本项目旨在开发一个基于 Wagmi 的去中心化应用 (DApp)，用于与 ERC20 Token 和一个自定义的 `TokenBank` 智能合约进行交互。用户将能够通过前端页面执行 Token 转账、授权、存款和取款等操作，并实时查看相关数据。

## 2. 核心功能需求 (Core Functional Requirements)

### 2.1. ERC20 Token 操作 (ERC20 Token Operations)

#### 2.1.1. Token 转账 (Token Transfer)
- **功能描述 (Description):** 用户应能够将自己账户中的 ERC20 Token 转移到另一个指定的以太坊地址。
- **用户界面 (UI):**
    - 提供一个输入框供用户输入接收方地址。
    - 提供一个输入框供用户输入转账金额。
    - 提供一个“转账”按钮来触发交易。
- **后端逻辑 (Logic):**
    - 调用 ERC20 合约的 `transfer(address to, uint256 amount)` 方法。
    - 在交易发送前进行输入验证（例如，地址格式是否正确，金额是否为有效数字）。

#### 2.1.2. Token 授权 (Token Approve)
- **功能描述 (Description):** 用户应能够授权 `TokenBank` 合约从其账户中划转指定数量的 ERC20 Token。这是执行存款操作的前提。
- **用户界面 (UI):**
    - 提供一个输入框供用户输入希望授权的 Token 数量。
    - 提供一个“授权”按钮来触发交易。
- **后端逻辑 (Logic):**
    - 调用 ERC20 合约的 `approve(address spender, uint256 amount)` 方法，其中 `spender` 是 `TokenBank` 合约的地址。

### 2.2. TokenBank 合约交互 (TokenBank Contract Interaction)

- **合约地址 (Contract Address):** `0x8Ff1927560f49488045025e71A2f596581411926`
- **目标网络 (Target Network):** Sepolia Testnet

#### 2.2.1. 读取数据 (Read Data)
- **功能描述 (Description):** 前端页面需要展示 `TokenBank` 合约的公开数据。
- **数据点 (Data Points):**
    - **总存款 (Total Deposits):**
        - **方法:** `totalDeposited()`
        - **展示:** 在页面上清晰地显示 `TokenBank` 合约中所有用户存款的总额。
    - **个人存款 (User's Deposit):**
        - **方法:** `deposits(address user)`
        - **展示:** 显示当前连接的钱包地址在 `TokenBank` 合约中的存款金额。

#### 2.2.2. 写入数据 (Write Data)
- **功能描述 (Description):** 用户应能够与 `TokenBank` 合约进行交互以存入和取出 Token。
- **操作 (Operations):**
    - **存款 (Deposit):**
        - **方法:** `deposit(uint256 amount)`
        - **用户界面 (UI):**
            - 提供一个输入框供用户输入存款金额。
            - 提供一个“存款”按钮。
        - **前提条件 (Pre-condition):** 用户必须已经授权了足够数量的 Token 给 `TokenBank` 合约。
    - **取款 (Withdraw):**
        - **方法:** `withdraw(uint256 amount)`
        - **用户界面 (UI):**
            - 提供一个输入框供用户输入取款金额。
            - 提供一个“取款”按钮。
        - **前提条件 (Pre-condition):** 用户输入的取款金额不能超过其在合约中的实际存款。

### 2.3. 前端页面 (Frontend Page)

#### 2.3.1. 钱包连接 (Wallet Connection)
- **功能描述 (Description):** 应用必须提供一个清晰的方式让用户连接他们的以太坊钱包（如 MetaMask）。
- **用户界面 (UI):**
    - 在页面显著位置提供一个“连接钱包”按钮。
    - 连接后，该按钮应显示用户的钱包地址，并提供断开连接的选项。

#### 2.3.2. 信息展示 (Information Display)
- **功能描述 (Description):** 页面需要实时、清晰地展示用户的账户信息和合约状态。
- **展示内容 (Content to Display):**
    - 当前连接的钱包地址。
    - 用户钱包中的 ETH 余额。
    - 用户钱包中的 ERC20 Token 余额。
    - 用户对 `TokenBank` 合约的授权额度 (`allowance`)。
    - `TokenBank` 合约的总存款额。
    - 当前用户在 `TokenBank` 中的存款额。

#### 2.3.3. 用户交互 (User Interaction)
- **功能描述 (Description):** 为所有可执行的操作提供直观的输入表单和按钮。
- **交互元素 (Interactive Elements):**
    - ERC20 转账表单。
    - ERC20 授权表单。
    - `TokenBank` 存款表单。
    - `TokenBank` 取款表单。

#### 2.3.4. 状态反馈 (Status Feedback)
- **功能描述 (Description):** 在用户执行交易时，提供实时的状态反馈。
- **反馈机制 (Feedback Mechanisms):**
    - **加载状态 (Loading State):** 当交易正在发送或等待确认时，禁用相关按钮并显示加载指示器（例如，“发送中...”、“确认中...”）。
    - **成功反馈 (Success Feedback):** 交易成功确认后，显示成功的提示消息（例如，使用 Toast 通知）。
    - **失败反馈 (Error Feedback):** 如果交易失败或被拒绝，显示清晰的错误消息。
    - **数据刷新 (Data Refresh):** 任何成功的写入操作（转账、授权、存款、取款）都应触发相关数据的自动刷新，以确保前端页面显示的是最新状态。

## 3. 非功能性需求 (Non-Functional Requirements)

- **技术栈 (Technology Stack):**
    - **核心库 (Core Library):** Wagmi
    - **前端框架 (Frontend Framework):** Next.js (React)
    - **钱包连接 (Wallet Connection):** RainbowKit
    - **工具库 (Utility Library):** Viem
- **目标网络 (Target Network):**
    - **开发与测试 (Development & Testing):** Sepolia Testnet
- **用户体验 (User Experience):**
    - 界面应简洁、直观，易于操作。
    - 所有交互都应有即时反馈。