he codebase reveals that Encifher Vaults is a private vault system built on Solana that allows users to deposit tokens into encrypted vaults with privacy-preserving features. The project uses Fully Homomorphic Encryption (FHE) to keep deposit amounts and yields encrypted. Vault.tsx:20-21 layout.tsx:8-11

Architecture Overview
The architecture consists of several key layers:

Frontend: Next.js 14 application with React 18 package.json:33-38

Blockchain Integration: Solana-based with Anchor framework package.json:15-28

Encryption Layer: Uses Encifher's TEE (Trusted Execution Environment) client for encryption/decryption fhevm.ts:1-18

Database: MongoDB for transaction history and user management transactionService.ts:14-16

Smart Contract IDLs: Multiple program interfaces for order management, token handling, and execution index.ts:1-11

Key Components
Core Utilities
FHEVM Utilities: Handles encryption and decryption operations fhevm.ts:5-18

Solana Utilities: Token account management solana.ts:3-7

Pool Management: Liquidity pool price fetching pool.ts:33-50

Token Configuration: Asset definitions with addresses token.ts:4-9

React Hooks
useOrderPlacement: Handles encrypted order placement usePlaceOrder.ts:21-104

useAsync: Manages balance fetching and decryption useAsync.ts:11-63

API Endpoints
Decrypt API: Server-side decryption endpoint route.ts:1-19

Mint API: Faucet functionality with rate limiting route.ts:13-57

Mint ERC20 API: Token minting on Solana route.ts:8-78

Transactions API: Transaction history management route.ts:78-214

Users API: User wallet registration route.ts:9-74

Installation & Local Development
Prerequisites: Node.js version 22.9.0 is required package.json:51-53

Dependencies: The project uses multiple blockchain SDKs, encryption libraries, and UI frameworks package.json:12-41

Wallet Provider Setup: Solana wallet integration with Phantom and Solflare providers.tsx:10-27

Build & Test Commands
The available scripts are: package.json:5-11

npm run dev: Start development server
npm run build: Build production bundle
npm run start: Start production server
npm run lint: Run linting
npm run monitor: Run transaction monitoring service
Configuration
Environment Variables Required
Based on the codebase, the following environment variables are needed:

Blockchain Configuration: constants.ts:1-22

Encryption Gateway: fhevm.ts:9

Coprocessor URL: route.ts:4

Database: transactionService.ts:14-16

RPC Endpoints: providers.tsx:20

Faucet & Authority Keys: route.ts:13

Pointy/Stackr Integration: pointy.ts:3-7

Webpack Configuration
Custom webpack setup for WASM support (TFHE library): next.config.mjs:10-51

Styling Configuration
Tailwind CSS with custom theme and brand colors: tailwind.config.ts:3-37

Security & Privacy Model
The application implements Fully Homomorphic Encryption (FHE) for privacy:

Client-side Encryption: Amounts are encrypted before sending to blockchain usePlaceOrder.ts:69-74

Server-side Decryption: Only authorized backend can decrypt via coprocessor route.ts:1-19

Encrypted Balances: User balances remain encrypted on-chain useAsync.ts:48-60

Rate Limiting: IP-based rate limiting on faucet to prevent abuse route.ts:3-39

Usage Examples
Vault Deposit Flow
The deposit modal shows how users interact with encrypted vaults: VaultCards.tsx:26-140

Balance Decryption
The system provides a way to decrypt and display balances: VaultCards.tsx:18-24

Transaction Monitoring
Background service for monitoring user transactions: transactionService.ts:47-77

Deployment
Maximum Function Duration: Extended for long-running operations route.ts:15

Network URLs: Supports multiple environments (dev/prod) transactionService.ts:4-11

File Tree Structure
The repository is organized as:

/app - Next.js application pages and components
/lib - Configuration, constants, and type definitions
/utils - Utility functions for blockchain, encryption, and pools
/scripts - Background services and monitoring
/app/idls - Solana program IDLs
/app/api - API route handlers
/app/components - React components
/app/hooks - Custom React hooks app:1 lib:1 utils:1 scripts:1




