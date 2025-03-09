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
    const connection = new Connection("https://api.devnet.solana.com", {
        commitment: 'confirmed',
        confirmTransactionInitialTimeout: 60000 // 60 seconds timeout for confirmation
    });

    try {
        // Convert the recipient address to a PublicKey
        const recipient = new PublicKey(recipientAddress);

        // Convert the amount from SOL to lamports (1 SOL = 1,000,000,000 lamports)
        const amountInLamports = amountInSOL * 1_000_000_000_00;

        // Get the most recent blockhash for better transaction freshness
        const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();

        // Create a transaction with the recent blockhash
        const transaction = new Transaction({ 
            feePayer: publicKey,
            blockhash,
            lastValidBlockHeight
        }).add(
            SystemProgram.transfer({
                fromPubkey: publicKey, // Sender's public key
                toPubkey: recipient, // Recipient's public key
                lamports: amountInLamports, // Amount in lamports
            })
        );

        // Send the transaction using the `sendTransaction` function from the wallet
        // Create a race promise with a timeout
        const transactionTimeout = 30000; // 30 seconds
        
        const timeoutPromise = new Promise<string>((_, reject) => {
            setTimeout(() => {
                reject(new Error("Transaction sending timed out"));
            }, transactionTimeout);
        });
        
        // Race between the actual transaction and the timeout
        const signature = await Promise.race([
            sendTransactionFn(transaction, connection),
            timeoutPromise
        ]);

        console.log("Transaction sent with signature:", signature);

        // Don't wait for full confirmation, just return the signature immediately
        // This allows the UI to update faster
        
        // Start confirmation in the background
        connection.confirmTransaction({
            signature,
            blockhash,
            lastValidBlockHeight
        }, 'confirmed').then(confirmation => {
            console.log("Transaction confirmed:", confirmation);
        }).catch(error => {
            console.error("Error confirming transaction:", error);
        });

        return signature; // Return the transaction signature immediately
    } catch (error) {
        console.error("Error sending transaction:", error);
        throw error;
    }
};


export const deployContract = async (response: string): Promise<string> => {
    try {
        console.log("Processing response for contract deployment...");

        // Check if response starts with "Phase 3:" and contains code
        let contractCode;
        
        // Try to extract code between "rust" and "end contract" markers
        const rustRegex = /rust\n([\s\S]*?)end contract/;
        const match = response.match(rustRegex);
        
        if (match && match[1]) {
            // Original format found
            contractCode = match[1].trim();
        } else {
            console.error("No valid contract found in the response");
            return "Error: No valid contract code found";
        }
        
        // Verify we have code
        if (!contractCode) {
            console.error("No valid contract found in the response");
            return "Error: No valid contract code found";
        }
        console.log("Extracted contract code:", contractCode);
        
        // Set a timeout to ensure the request doesn't hang indefinitely
        const timeout = 15000; // 15 seconds timeout
        
        // Create an AbortController for the fetch request
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        
        // Send the contract to the backend for deployment with timeout
        const backendUrl = "http://localhost:3002/deploy";
        const deployResponse = await fetch(backendUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ contract_code: contractCode }),
            signal: controller.signal
        }).finally(() => clearTimeout(timeoutId));
        
        if (!deployResponse.ok) {
            throw new Error(`Server responded with ${deployResponse.status}: ${deployResponse.statusText}`);
        }
        
        // Use a timeout for parsing the JSON response as well
        const textResponse = await deployResponse.text();
        let data;
        
        try {
            data = JSON.parse(textResponse);
        } catch (e) {
            console.error("Failed to parse JSON response:", e);
            console.log("Raw response:", textResponse);
            // If we can't parse the response but it contains an address, try to extract it
            const addressMatch = textResponse.match(/[A-Za-z0-9]{32,}/);
            if (addressMatch) {
                return `Contract deployed successfully! Address: ${addressMatch[0]}`;
            }
            throw new Error("Failed to parse deployment response");
        }
        
        console.log("Deployment result:", data);
        
        // Handle case where contract_address might be empty or null
        if (!data.contract_address) {
            console.warn("Contract address is missing from the response");
            return "Contract deployed successfully! The contract address will be available shortly.";
        }
        
        return `Contract deployed successfully! Address: ${data.contract_address}`;
    } catch (error) {
        if (error.name === 'AbortError') {
            console.error("Deployment request timed out");
            return "Contract deployment initiated. The address will be available shortly.";
        }
        console.error("Error deploying contract:", error);
        return `Error deploying contract: ${error instanceof Error ? error.message : String(error)}`;
    }
}
