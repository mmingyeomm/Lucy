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


export const deployContract = async (response: string): Promise<string> => {
    try {
        console.log("Processing response for contract deployment...");

        // Extract the contract code between "rust" and "end contract"
        const rustRegex = /rust\n([\s\S]*?)end contract/;
        const match = response.match(rustRegex);
        
        if (!match || !match[1]) {
            console.error("No valid contract found in the response");
            return "Error: No valid contract code found";
        }
        
        const contractCode = match[1].trim();
        console.log("Extracted contract code:", contractCode);
        
        // Send the contract to the backend for deployment
        const backendUrl = "http://localhost:8080/deploy";
        const deployResponse = await fetch(backendUrl, {  // 이름 변경: response → deployResponse
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ contract_code: contractCode }),
        });
        
        if (!deployResponse.ok) {  // 이름 변경 적용
            throw new Error(`Server responded with ${deployResponse.status}: ${deployResponse.statusText}`);
        }
        
        const data = await deployResponse.json();  // 이름 변경 적용
        console.log("Deployment result:", data);
        
        return `Contract deployed successfully! Address: ${data.contract_address}`;
    } catch (error) {
        console.error("Error deploying contract:", error);
        return `Error deploying contract: ${error instanceof Error ? error.message : String(error)}`;
    }
}
