Encifher
A privacy layer for DeFi on Solana enabling encrypted, compliant on-chain actions without bridging.

Encifher provides confidential DeFi operations (vaults, payments, swaps) on Solana using TEE-based encryption. All sensitive amounts are encrypted via a TEE gateway before being submitted on-chain, ensuring privacy while maintaining blockchain verifiability.

Goals
Privacy-First DeFi: Enable confidential deposits, transfers, and swaps without revealing amounts on-chain
No Bridging Required: Native Solana integration with encrypted tokens (eTokens)
TEE-Based Security: Leverage Trusted Execution Environments for encryption operations
Compliance-Ready: Support for encrypted yet auditable transactions
Developer-Friendly: Simple SDK and API for integrating privacy features
Architecture Overview
Encifher uses a dual-layer architecture:

Frontend Layer: Next.js application with Solana wallet integration
Encryption Layer: TEE gateway (monad.encrypt.rpc.encifher.io) for amount encryption
Blockchain Layer: Solana programs (OrderManager, etokenProgram) handling encrypted operations usePlaceOrder.ts:70-73
Key Components
Frontend Components:

Vault System: Deposit encrypted tokens into yield-bearing vaults VaultCards.tsx:11-140
Payment Widget: Private peer-to-peer transfers
Swap Widget: Token exchanges with encrypted amounts SwapWidget.tsx:21-91
Faucet: Testnet token distribution Faucet.tsx:195-225
Backend APIs:

/api/mint-erc20: Faucet endpoint for minting test tokens route.ts:18-78
/api/transactions: Transaction history fetching
/api/wrap-shmon: Token wrapping operations route.ts:27-59
Encryption Utilities:

TEEClient from @encifher-js/core: Main encryption interface fhevm.ts:1-18
FHEVM utilities for ERC20 wrapping operations
Installation & Local Development
Prerequisites
# Required versions  
Node.js >= 18.x  
Solana CLI >= 1.18.x  
Anchor >= 0.29.x
Setup Steps
Clone the repository:
git clone https://github.com/RizeLabs/encifher-vaults.git  
cd encifher-vaults
Install dependencies:
npm install  
# or  
yarn install
Configure environment variables:
Create a .env.local file:

# Solana Configuration  
NEXT_PUBLIC_RPC_URL=https://api.devnet.solana.com  
NEXT_PUBLIC_NETWORK=devnet  
  
# TEE Gateway  
NEXT_PUBLIC_TEE_GATEWAY_URL=https://monad.encrypt.rpc.encifher.io  
  
# Backend Authority (for faucet/minting)  
AUTHORITY=<base64_encoded_keypair>  
  
# MongoDB (for transaction history)  
MONGODB_URI=mongodb://localhost:27017  
DB_NAME=encifher  
  
# Optional: EVM Integration  
NEXT_PUBLIC_MONAD_RPC_URL=https://rpc-testnet.monadinfra.com/rpc/...  
REFILL_PRIVATE_KEY=<private_key_for_relay>
route.ts:16

Start development server:
npm run dev
The application will be available at http://localhost:3000.

Build & Test Commands
Build for Production
npm run build  
npm start
Linting
npm run lint
Type Checking
npm run type-check
Usage Examples
SDK Usage: Encrypted Vault Deposit
import { useOrderPlacement } from '@/app/hooks/usePlaceOrder';  
import { TEEClient, PlaintextType } from '@encifher-js/core';  
  
// Initialize the hook  
const { placeOrders, isLoading, error } = useOrderPlacement({  
  connection,  
  publicKey,  
  orderManager: ORDER_MANAGER,  
  executor: EXECUTOR,  
  etokenMint: EMINT,  
  eusdcTokenAccount: EUSDC_ACCOUNT,  
});  
  
// Place an encrypted deposit  
const txHash = await placeOrders("10.5"); // Amount in USDC
usePlaceOrder.ts:33-97

API Usage: Mint Test Tokens
curl -X POST http://localhost:3000/api/mint-erc20 \  
  -H "Content-Type: application/json" \  
  -d '{  
    "address": "YOUR_SOLANA_ADDRESS",  
    "value": "5",  
    "selectedToken": "USDC",  
    "networkUrl": "https://api.devnet.solana.com"  
  }'
Response:

{  
  "txid": "5xK7m...transaction_signature"  
}
route.ts:8-13

CLI Example: Encrypt Amount
import { TEEClient, PlaintextType } from '@encifher-js/core';  
  
const client = new TEEClient({   
  teeGatewayUrl: 'https://monad.encrypt.rpc.encifher.io'   
});  
await client.init();  
  
const amount = 1000000; // 1 USDC (6 decimals)  
const encryptedHandle = await client.encrypt(amount, PlaintextType.uint64);  
  
console.log('Encrypted handle:', encryptedHandle);
usePlaceOrder.ts:70-73

Configuration
Environment Variables Reference
Variable	Required	Description	Example
NEXT_PUBLIC_RPC_URL	Yes	Solana RPC endpoint	https://api.devnet.solana.com
NEXT_PUBLIC_TEE_GATEWAY_URL	Yes	TEE encryption gateway	https://monad.encrypt.rpc.encifher.io
AUTHORITY	Yes (backend)	Base64 keypair for faucet	<base64_string>
MONGODB_URI	Optional	MongoDB connection string	mongodb://localhost:27017
NEXT_PUBLIC_MONAD_RPC_URL	Optional	EVM RPC for FHEVM operations	https://rpc-testnet...
Webpack Configuration
The project uses custom webpack configuration for WASM support (TFHE library): next.config.mjs:10-28

Security & Privacy Model
Encryption Approach
Encifher uses TEE (Trusted Execution Environment) encryption:

User submits plaintext amount to TEE gateway
TEE encrypts amount inside secure enclave
Encrypted handle returned to client
Handle submitted on-chain with placeholder proof usePlaceOrder.ts:75-77
Current Proof System: Uses placeholder proofs (Buffer.from([0])) - relies on TEE attestation rather than zero-knowledge proofs.

Account Derivation
⚠️ Demo Pattern (Not Production-Ready):

const userEusdcTokenAccount = Keypair.fromSeed(publicKey.toBuffer());
This deterministic derivation is for demo purposes only. Production systems should use Program Derived Addresses (PDAs) for security. usePlaceOrder.ts:49

Security Considerations
TEE Trust Model: Encryption correctness relies on TEE enclave guarantees
Transaction Privacy: Amounts are encrypted; only handles visible on-chain
Account Security: Seed-based derivation has collision risks; migrate to PDAs for production
Proof System: Future enhancement planned for client-side ZK proofs
Compliance Notes
Encifher's architecture supports compliance through:

Encrypted Audit Trail: All transactions recorded with encrypted amounts
Selective Disclosure: TEE can decrypt for authorized auditors
On-Chain Verifiability: Transaction structure visible, amounts private
No Bridging: Native Solana operations maintain regulatory clarity
Deployment
Frontend Deployment (Vercel)
# Install Vercel CLI  
npm i -g vercel  
  
# Deploy  
vercel --prod
Backend Services
The faucet API requires a server-side keypair with:

Sufficient SOL for transaction fees
Mint authority for encrypted tokens (EMINT) route.ts:16
MongoDB Setup
For transaction history:

# Start MongoDB  
mongod --dbpath /path/to/data  
  
# Create database  
use encifher  
db.createCollection("transactions")
route.ts:51-55

CI/Audit Checklist
 All environment variables configured
 TEE gateway accessible and responding
 Solana RPC endpoint stable
 MongoDB connection established
 Wallet adapter functioning
 Encryption/decryption working
 Transaction signing successful
 Faucet minting tokens correctly
 Explorer links resolving
 Error handling comprehensive
File Tree
encifher-vaults/  
├── app/  
│   ├── api/  
│   │   ├── mint-erc20/route.ts      # Faucet endpoint  
│   │   ├── transactions/route.ts    # Transaction history  
│   │   └── wrap-shmon/route.ts      # Token wrapping  
│   ├── components/  
│   │   ├── Faucet/                  # Testnet faucet UI  
│   │   ├── Vault/                   # Vault deposit interface  
│   │   ├── PaymentWidget/           # Private transfers  
│   │   ├── SwapWidget/              # Token swaps  
│   │   └── Tables/                  # Asset management  
│   ├── hooks/  
│   │   ├── usePlaceOrder.ts         # Vault deposit logic  
│   │   ├── useSwap.ts               # Swap logic  
│   │   └── useAsync.ts              # Balance fetching  
│   └── idls/                        # Anchor program IDLs  
├── lib/  
│   ├── constants.ts                 # Program addresses  
│   └── types.ts                     # TypeScript types  
├── utils/  
│   ├── fhevm.ts                     # FHEVM encryption  
│   └── token.ts                     # Token configurations  
├── scripts/  
│   └── transactionService.ts        # Background sync  
└── next.config.mjs                  # Webpack config  
Troubleshooting
Common Issues
1. "Insufficient balance" error:

Use the faucet at /faucet to get test tokens
Ensure you're on Solana Devnet
2. Transaction fails with "skipPreflight" error:

This is expected for encrypted transactions
Check transaction on Solscan for actual status usePlaceOrder.ts:89
3. TEE gateway timeout:

Verify NEXT_PUBLIC_TEE_GATEWAY_URL is correct
Check network connectivity
Gateway may be rate-limited
4. Wallet connection issues:

Install Phantom or Solflare wallet
Switch to Devnet in wallet settings
Refresh page after connecting
5. MongoDB connection errors:

Ensure MongoDB is running locally
Check MONGODB_URI in .env.local
Transaction history will be unavailable but app still functions
Contribution Guide
Fork the repository
Create a feature branch: git checkout -b feature/your-feature
Make changes and test thoroughly
Commit with clear messages: git commit -m "Add encrypted swap feature"
Push to your fork: git push origin feature/your-feature
Open a Pull Request with detailed description
Code Style
Use TypeScript for type safety
Follow existing component patterns
Add comments for complex encryption logic
Include error handling for all async operations
License
[Add license information here - not visible in provided code]
