import { useState } from 'react';
import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { PublicKey, Keypair, Transaction } from '@solana/web3.js';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import {
    OrderManagerIDL,
    EtokenIDL,
} from "../idls";
import { PlaintextType, TEEClient } from "@encifher-js/core";

interface UseOrderPlacementParams {
    connection: anchor.web3.Connection;
    publicKey: PublicKey | null;
    orderManager: PublicKey;
    executor: PublicKey;
    etokenMint: PublicKey;
    eusdcTokenAccount: PublicKey;
}

export const useOrderPlacement = ({
    connection,
    publicKey,
    orderManager,
    executor,
    etokenMint,
    eusdcTokenAccount,
}: UseOrderPlacementParams) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const wallet = useAnchorWallet();

    const placeOrders = async (amount: string) => {
        if (!publicKey || !wallet) return;
        setIsLoading(true);
        setError(null);

        const orderManagerProgram = new Program(
            OrderManagerIDL as anchor.Idl,
            new anchor.AnchorProvider(connection, wallet!, { preflightCommitment: 'processed' })
        );

        // const etokenProgram = new Program(
        //     EtokenIDL as anchor.Idl,
        //     new anchor.AnchorProvider(connection, wallet!, { preflightCommitment: 'processed' })
        // );

        try {
            const userEusdcTokenAccount = Keypair.fromSeed(publicKey.toBuffer()); // This is just for demo purpose, ideally we would want to use PDAs
            // const userTokenAccountInfo = await connection.getAccountInfo(userEusdcTokenAccount.publicKey);
            const tx = new Transaction();
            // if (!userTokenAccountInfo) {
            //     try {
            //         const ix = await etokenProgram.methods.initializeAccount().accounts({
            //             tokenAccount: userEusdcTokenAccount.publicKey,
            //             mint: etokenMint,
            //             payer: publicKey,
            //             authority: publicKey,
            //         }).signers([userEusdcTokenAccount]).instruction();
            //         tx.add(ix);
            //         tx.partialSign(userEusdcTokenAccount);
            //     } catch (e) {
            //         console.error('Error initializing account', e);
            //         return;
            //     }
            // }

            // Place order
            const deadline = new anchor.BN(0x500);
            const client = new TEEClient({ teeGatewayUrl: process.env.NEXT_PUBLIC_TEE_GATEWAY_URL! });
            await client.init();
            const parsedAmount = Number(amount) * 10 ** 6;
            const encAmount = await client.encrypt(parsedAmount, PlaintextType.uint32);

            const ix = await orderManagerProgram.methods.placeOrder(deadline, {
                handle: new anchor.BN(encAmount),
                proof: Buffer.from([0])
            }).accounts({
                orderManager: orderManager,
                user: userEusdcTokenAccount.publicKey,
                authority: publicKey,
                eusdcTokenAccount,
                executor,
            }).instruction();
            tx.add(ix);
            tx.feePayer = publicKey;
            tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
            const signedTx = await wallet.signTransaction(tx);
            const hash = await connection.sendRawTransaction(signedTx.serialize());
            setIsLoading(false);
            return hash;
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err : new Error('An unknown error occurred'));
            setIsLoading(false);
        }
    };

    return {
        placeOrders,
        isLoading,
        error
    };
};