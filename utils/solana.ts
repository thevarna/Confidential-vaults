import { PublicKey, Keypair } from "@solana/web3.js";

export const getEtokenAddressSync = (address: PublicKey): Keypair => {
    const addressBuffer = address.toBuffer();
    const prefix = Buffer.from('etoken', 'utf-8');
    return Keypair.fromSeed(Buffer.concat([prefix, addressBuffer]).slice(0, 32));
}