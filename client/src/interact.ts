import { Connection, SystemProgram, Transaction, PublicKey } from "@solana/web3.js";

export const sendTransaction = async (
    recipientAddress: string,
    amountInSOL: number,
    publicKey: PublicKey,
    sendTransactionFn: (transaction: Transaction, connection: Connection) => Promise<string>
) => {
    if (!publicKey) {
        throw new Error("Wallet not connected!");
    }

    // Create a connection to the Solana Devnet
    const connection = new Connection("https://api.devnet.solana.com");

    try {
        // Convert the recipient address to a PublicKey
        const recipient = new PublicKey(recipientAddress);

        // Convert the amount from SOL to lamports (1 SOL = 1,000,000,000 lamports)
        const amountInLamports = amountInSOL * 1_000_000_000;

        // Create a transaction
        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: publicKey, // Sender's public key
                toPubkey: recipient, // Recipient's public key
                lamports: amountInLamports, // Amount in lamports
            })
        );

        // Send the transaction using the `sendTransaction` function from the wallet
        const signature = await sendTransactionFn(transaction, connection);

        console.log("Transaction sent with signature:", signature);

        // Confirm the transaction
        const confirmation = await connection.confirmTransaction(signature, "confirmed");
        console.log("Transaction confirmed:", confirmation);

        return signature; // Return the transaction signature
    } catch (error) {
        console.error("Error sending transaction:", error);
        throw error;
    }
};


export const deployContract = async () => {

    return "deploying contract"


}