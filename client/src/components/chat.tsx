import { Button } from "@/components/ui/button";
import {
    ChatBubble,
    ChatBubbleMessage,
    ChatBubbleTimestamp,
} from "@/components/ui/chat/chat-bubble";
import { ChatInput } from "@/components/ui/chat/chat-input";
import { ChatMessageList } from "@/components/ui/chat/chat-message-list";
import { useTransition, animated, type AnimatedProps } from "@react-spring/web";
import { Paperclip, Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Content, UUID } from "@elizaos/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { cn, moment } from "@/lib/utils";
import { Avatar, AvatarImage } from "./ui/avatar";
import CopyButton from "./copy-button";
import ChatTtsButton from "./ui/chat/chat-tts-button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import AIWriter from "react-aiwriter";
import type { IAttachment } from "@/types";
import { AudioRecorder } from "./audio-recorder";
import { Badge } from "./ui/badge";
import { useAutoScroll } from "./ui/chat/hooks/useAutoScroll";
import { deployContract, sendTransaction } from "@/interact";
import { useWallet } from "@solana/wallet-adapter-react";


type ExtraContentFields = {
    user: string;
    createdAt: number;
    isLoading?: boolean;
};

type ContentWithUser = Content & ExtraContentFields;

type AnimatedDivProps = AnimatedProps<{ style: React.CSSProperties }> & {
    children?: React.ReactNode;
};

export default function Page({ agentId }: { agentId: UUID }) {
    const { toast } = useToast();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [input, setInput] = useState("");
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const formRef = useRef<HTMLFormElement>(null);

    const { publicKey, sendTransaction: walletSendTransaction } = useWallet();
    const queryClient = useQueryClient();


    const getMessageVariant = (role: string) =>
        role !== "user" ? "received" : "sent";

    const { scrollRef, isAtBottom, scrollToBottom, disableAutoScroll } = useAutoScroll({
        smooth: true,
    });
   
    useEffect(() => {
        scrollToBottom();
    }, [queryClient.getQueryData(["messages", agentId])]);

    useEffect(() => {
        scrollToBottom();
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (e.nativeEvent.isComposing) return;
            handleSendMessage(e as unknown as React.FormEvent<HTMLFormElement>);
        }
    };

    const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!input) return;

        const attachments: IAttachment[] | undefined = selectedFile
            ? [
                  {
                      url: URL.createObjectURL(selectedFile),
                      contentType: selectedFile.type,
                      title: selectedFile.name,
                  },
              ]
            : undefined;

        const newMessages = [
            {
                text: input,
                user: "user",
                createdAt: Date.now(),
                attachments,
            },
            {
                text: input,
                user: "system",
                isLoading: true,
                createdAt: Date.now(),
            },
        ];

        queryClient.setQueryData(
            ["messages", agentId],
            (old: ContentWithUser[] = []) => [...old, ...newMessages]
        );

        sendMessageMutation.mutate({
            message: input,
            selectedFile: selectedFile ? selectedFile : null,
        });

        setSelectedFile(null);
        setInput("");
        formRef.current?.reset();
    };

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    // Store last Lucy message that contains a smart contract
    const [lastContractMessage, setLastContractMessage] = useState<string | null>(null);
    const [phase, setPhase] = useState<number | null>(null); 
    
    const sendMessageMutation = useMutation({
        mutationKey: ["send_message", agentId],
        mutationFn: async ({
            message,
            selectedFile,

        }: {
            message: string;
            selectedFile?: File | null;
        }) => {
            // Send the message to the backend
            const response = await apiClient.sendMessage(agentId, message, selectedFile);

            console.log(response[0].text);

            const responseText = response[0].text;
            // Check if Lucy's message starts with specific phase indicators
            const firstTwoWords = responseText.trim().split(/\s+/).slice(0, 2).join(" ");
            
            // If Lucy's response starts with "Phase 3:" and contains rust code, save it
            if (firstTwoWords === "Phase 3:" && responseText.includes("rust") && responseText.includes("end contract")) {
                console.log("Storing Lucy's contract message for future deployment");
                setLastContractMessage(responseText);
            }
            
            // If Lucy's response indicates Phase 4 completion (smart contract deployment)
            if (firstTwoWords === "Phase 4:" || responseText.includes("has been successfully deployed") || 
                (responseText.includes("Would you like to proceed with management registration?") && 
                responseText.includes("Yes or No"))) {
                console.log("Detected Phase 4 message about contract registration");
                setPhase(4);
            }
            
            // If user's message starts with "Deploy" and we have a stored contract message
            if (message.toLowerCase().startsWith("deploy") && lastContractMessage) {
                console.log("Detected Deploy request with previously stored contract, initiating deployment...");
                
                // Add a deployment message
                response.push({
                    text: "Deployment in progress...",
                    user: "system",
                    createdAt: Date.now(),
                    source: "System"
                });

                // Start the deployment process with the stored contract message
                deployContract(lastContractMessage).then(deploymentResult => {
                    console.log("Deployment process completed:", deploymentResult);
                    
                    // Only set phase to 4 and show the Phase 4 message if deployment was successful
                    if (deploymentResult.includes("successfully")) {
                        setPhase(4);
                        console.log("Setting phase to 4 - ready for contract management registration");
                        
                        // First, only show the deployment success message
                        queryClient.setQueryData(
                            ["messages", agentId],
                            (old: ContentWithUser[] = []) => [
                                ...old.filter(msg => msg.text !== "Deployment in progress..."),
                                {
                                    text: deploymentResult,
                                    user: "system",
                                    createdAt: Date.now(),
                                    source: "Deployment"
                                }
                            ]
                        );
                        
                        // Then, add the Phase 4 message with a proper delay (2 seconds)
                        setTimeout(() => {
                            queryClient.setQueryData(
                                ["messages", agentId],
                                (old: ContentWithUser[] = []) => [
                                    ...old,
                                    {
                                        text: "Phase 4: The contract has been successfully deployed. The deployed smart contract can be registered on the Lucy web for ongoing management. Would you like to proceed with management registration? (Yes or No)",
                                        user: "system",
                                        createdAt: Date.now(),
                                        source: "System"
                                    }
                                ]
                            );
                        }, 2000);
                    } else {
                        // If deployment failed, just show the error message
                        queryClient.setQueryData(
                            ["messages", agentId],
                            (old: ContentWithUser[] = []) => [
                                ...old.filter(msg => msg.text !== "Deployment in progress..."),
                                {
                                    text: deploymentResult,
                                    user: "system",
                                    createdAt: Date.now(),
                                    source: "Deployment"
                                }
                            ]
                        );
                    }
                }).catch(error => {
                    console.error("Deployment failed:", error);
                    
                    // Add the error message
                    queryClient.setQueryData(
                        ["messages", agentId],
                        (old: ContentWithUser[] = []) => [
                            ...old.filter(msg => msg.text !== "Deployment in progress..."),
                            {
                                text: `Deployment failed: ${error.message || "Unknown error"}`,
                                user: "system",
                                createdAt: Date.now(),
                                source: "Deployment"
                            }
                        ]
                    );
                });
            }


            // Check for any variation of "yes" response when we're in phase 4
            if ((message.toLowerCase().includes("yes") || 
                 message.toLowerCase() === "y" || 
                 message.toLowerCase() === "yeah" || 
                 message.toLowerCase() === "yep" || 
                 message.toLowerCase() === "sure") && 
                phase === 4) {
                console.log(`User responded affirmatively to Phase 4 with: "${message}". Initiating Solana transaction...`);
                
                // Create a transaction message ID to identify it later
                const transactionMessageId = Date.now();
                
                // Store this transaction identifier in a closure to reference it in handlers
                const transactionIdentifier = `transaction-${transactionMessageId}`;
                
                // Store transaction status in localStorage (if available)
                try {
                    localStorage.setItem(transactionIdentifier, 'processing');
                } catch (e) {
                    console.error("Failed to store transaction state:", e);
                }
                
                // Add a transaction message with the unique ID directly to query client
                // instead of adding to response, which prevents it from appearing at the 
                // end of the conversation
                queryClient.setQueryData(
                    ["messages", agentId],
                    (old: ContentWithUser[] = []) => [
                        ...old,
                        {
                            text: "Processing transaction...",
                            user: "system",
                            createdAt: transactionMessageId,
                            source: "System"
                        }
                    ]
                );
                
                // Set a timeout to update the transaction message if it takes too long
                const transactionTimeout = setTimeout(() => {
                    queryClient.setQueryData(
                        ["messages", agentId],
                        (old: ContentWithUser[] = []) => {
                            // Find if the processing message is still there
                            const processingMsgExists = old.some(msg => 
                                msg.text === "Processing transaction..." && 
                                msg.createdAt === transactionMessageId
                            );
                            
                            if (processingMsgExists) {
                                return [
                                    ...old.filter(msg => !(msg.text === "Processing transaction..." && msg.createdAt === transactionMessageId)),
                                    {
                                        text: "Transaction initiated. This process may take a moment to complete...",
                                        user: "system",
                                        createdAt: Date.now(),
                                        source: "Transaction"
                                    }
                                ];
                            }
                            return old;
                        }
                    );
                }, 5000); // Update after 5 seconds
                
                if (publicKey && walletSendTransaction) {
                    try {
                        const txSignature = await sendTransaction(
                            "73yff1Z1Q2UQo9S5cNmPEuUATRvsgiJiQJo3kCVDrhhK", // Recipient address
                            0.001, // Amount in SOL
                            publicKey,
                            walletSendTransaction
                        );
                        
                        // Clear the timeout since we have a result
                        clearTimeout(transactionTimeout);
                        
                        console.log("Transaction sent successfully:", txSignature);
                        
                        // Find the contract address from previous messages
                        const contractAddressMatch = queryClient.getQueryData<ContentWithUser[]>(["messages", agentId])
                            ?.find(msg => msg.text?.includes("Contract deployed successfully") && msg.text?.includes("Address:"))
                            ?.text.match(/Address: ([A-Za-z0-9]{32,})/);
                            
                        const contractAddress = contractAddressMatch ? contractAddressMatch[1] : "Unknown";
                        
                        // Store deployed contract in localStorage
                        try {
                            // Get existing contracts or initialize empty array
                            const storedContracts = localStorage.getItem('lucyDeployedContracts');
                            const contracts = storedContracts ? JSON.parse(storedContracts) : [];
                            
                            // Add new contract
                            contracts.push({
                                id: `contract-${contracts.length + 4}`, // Start from contract-4 since we have 3 default contracts
                                name: `Contract${contracts.length + 1}`,
                                address: contractAddress,
                                network: "Solana Devnet",
                                deployDate: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
                                status: "Active",
                                interactions: 0,
                                txSignature: txSignature
                            });
                            
                            // Save back to localStorage
                            localStorage.setItem('lucyDeployedContracts', JSON.stringify(contracts));
                            console.log("Contract saved to localStorage:", contracts[contracts.length - 1]);
                        } catch (error) {
                            console.error("Failed to save contract to localStorage:", error);
                        }

                        // First, update only with the transaction success message
                        queryClient.setQueryData(
                            ["messages", agentId],
                            (old: ContentWithUser[] = []) => {
                                // Get all messages except the "Processing transaction..." message
                                const filteredMessages = old.filter(msg => !(msg.text === "Processing transaction..." && msg.createdAt === transactionMessageId));
                                
                                // Create the transaction success message
                                const successMessage = {
                                    text: `Transaction completed successfully! Your contract has been registered for management. Transaction signature: ${txSignature}`,
                                    user: "system",
                                    createdAt: Date.now(),
                                    source: "Transaction"
                                };
                                
                                // Return the filtered messages plus the success message
                                return [...filteredMessages, successMessage];
                            }
                        );
                        
                        // Then, add the follow-up message with a proper delay (2 seconds)
                        setTimeout(() => {
                            queryClient.setQueryData(
                                ["messages", agentId],
                                (old: ContentWithUser[] = []) => [
                                    ...old,
                                    {
                                        text: "Phase 4: Thank you for confirming. The smart contract has been registered for management. You can view it in the Contracts page. Is there anything else you need assistance with?",
                                        user: "system",
                                        createdAt: Date.now(),
                                        source: "System"
                                    }
                                ]
                            );
                        }, 2000);
                        
                        // Since we've already added the follow-up message to queryClient,
                        // we don't need to add it to response
                        try {
                            localStorage.removeItem(transactionIdentifier);
                        } catch (e) {
                            console.error("Failed to clear transaction state:", e);
                        }
                        
                    } catch (error) {
                        // Clear the timeout since we have a result
                        clearTimeout(transactionTimeout);
                        
                        console.error("Failed to send transaction:", error);
                        
                        // First, update with just the error message
                        queryClient.setQueryData(
                            ["messages", agentId],
                            (old: ContentWithUser[] = []) => [
                                ...old.filter(msg => !(msg.text === "Processing transaction..." && msg.createdAt === transactionMessageId)),
                                {
                                    text: `Transaction failed: ${error instanceof Error ? error.message : String(error)}`,
                                    user: "system",
                                    createdAt: Date.now(),
                                    source: "Transaction"
                                }
                            ]
                        );
                        
                        // Then add the follow-up message with a proper delay
                        setTimeout(() => {
                            queryClient.setQueryData(
                                ["messages", agentId],
                                (old: ContentWithUser[] = []) => [
                                    ...old,
                                    {
                                        text: "Phase 4: There was an issue with the transaction. Would you like to try again? (Yes or No)",
                                        user: "system",
                                        createdAt: Date.now(),
                                        source: "System"
                                    }
                                ]
                            );
                        }, 2000);
                        
                        // Clean up the transaction state
                        try {
                            localStorage.removeItem(transactionIdentifier);
                        } catch (e) {
                            console.error("Failed to clear transaction state:", e);
                        }
                    }
                } else {
                    // Clear the timeout since we have a result
                    clearTimeout(transactionTimeout);
                    
                    console.error("Wallet not connected!");
                    
                    // First, update with just the wallet error message
                    queryClient.setQueryData(
                        ["messages", agentId],
                        (old: ContentWithUser[] = []) => [
                            ...old.filter(msg => !(msg.text === "Processing transaction..." && msg.createdAt === transactionMessageId)),
                            {
                                text: "Transaction failed: Wallet not connected. Please connect your wallet to complete this action.",
                                user: "system",
                                createdAt: Date.now(),
                                source: "Transaction"
                            }
                        ]
                    );
                    
                    // Then add the follow-up message with a proper delay
                    setTimeout(() => {
                        queryClient.setQueryData(
                            ["messages", agentId],
                            (old: ContentWithUser[] = []) => [
                                ...old,
                                {
                                    text: "Phase 4: Please connect your wallet and respond with 'Yes' to try again. Would you like to proceed once your wallet is connected?",
                                    user: "system",
                                    createdAt: Date.now(),
                                    source: "System"
                                }
                            ]
                        );
                    }, 2000);
                    
                    // Clean up the transaction state
                    try {
                        localStorage.removeItem(transactionIdentifier);
                    } catch (e) {
                        console.error("Failed to clear transaction state:", e);
                    }
                }
            }



            return response;
        },
        onSuccess: (newMessages: ContentWithUser[]) => {
            queryClient.setQueryData(
                ["messages", agentId],
                (old: ContentWithUser[] = []) => [
                    ...old.filter((msg) => !msg.isLoading),
                    ...newMessages.map((msg) => ({
                        ...msg,
                        createdAt: Date.now(),
                    })),
                ]
            );
        },
        onError: (e) => {
            toast({
                variant: "destructive",
                title: "Unable to send message",
                description: e.message,
            });
        },
    });



    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file?.type.startsWith("image/")) {
            setSelectedFile(file);
        }
    };

    const messages =
        queryClient.getQueryData<ContentWithUser[]>(["messages", agentId]) ||
        [];

    const transitions = useTransition(messages, {
        keys: (message) =>
            `${message.createdAt}-${message.user}-${message.text}`,
        from: { opacity: 0, transform: "translateY(50px)" },
        enter: { opacity: 1, transform: "translateY(0px)" },
        leave: { opacity: 0, transform: "translateY(10px)" },
    });

    const CustomAnimatedDiv = animated.div as React.FC<AnimatedDivProps>;

    return (
        <div className="flex flex-col w-full h-[calc(100dvh)] p-4">
            <div className="flex-1 overflow-y-auto">
                <ChatMessageList 
                    scrollRef={scrollRef}
                    isAtBottom={isAtBottom}
                    scrollToBottom={scrollToBottom}
                    disableAutoScroll={disableAutoScroll}
                >
                    {transitions((style, message: ContentWithUser) => {
                        const variant = getMessageVariant(message?.user);
                        return (
                            <CustomAnimatedDiv
                                style={{
                                    ...style,
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "0.5rem",
                                    padding: "1rem",
                                }}
                            >
                                <ChatBubble
                                    variant={variant}
                                    className="flex flex-row items-start gap-2"
                                >
                                    {message?.user !== "user" ? (
                                        <div className="ai-avatar size-10">
                                            <div className="ai-avatar-ring"></div>
                                            <div className="ai-avatar-scan"></div>
                                            <div className="ai-face-container">
                                                <div className="ai-face">
                                                    <div className="ai-face-inner">
                                                        <div className="ai-patterns"></div>
                                                        <div className="ai-circuits"></div>
                                                        <div className="ai-eye ai-eye-left"></div>
                                                        <div className="ai-eye ai-eye-right"></div>
                                                        <div className="ai-mouth"></div>
                                                        
                                                        {/* Voice wave animation */}
                                                        {message?.isLoading && (
                                                            <div className="voice-wave">
                                                                <div className="voice-line"></div>
                                                                <div className="voice-line"></div>
                                                                <div className="voice-line"></div>
                                                                <div className="voice-line"></div>
                                                                <div className="voice-line"></div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : null}
                                    <div className="flex flex-col">
                                        <ChatBubbleMessage
                                            isLoading={message?.isLoading}
                                        >
                                            {message?.user !== "user" ? (
                                                <div className="relative">
                                                    <AIWriter>
                                                        {message?.text}
                                                    </AIWriter>
                                                    <div className="absolute -left-1 top-0 w-[3px] h-full bg-primary/20 rounded-full"></div>
                                                </div>
                                            ) : (
                                                message?.text
                                            )}
                                            {/* Attachments */}
                                            <div>
                                                {message?.attachments?.map(
                                                    (attachment: IAttachment) => (
                                                        <div
                                                            className="flex flex-col gap-1 mt-2"
                                                            key={`${attachment.url}-${attachment.title}`}
                                                        >
                                                            <img
                                                                alt="attachment"
                                                                src={attachment.url}
                                                                width="100%"
                                                                height="100%"
                                                                className="w-64 rounded-md"
                                                            />
                                                            <div className="flex items-center justify-between gap-4">
                                                                <span />
                                                                <span />
                                                            </div>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </ChatBubbleMessage>
                                        <div className="flex items-center gap-4 justify-between w-full mt-1">
                                            {message?.text &&
                                            !message?.isLoading ? (
                                                <div className="flex items-center gap-1">
                                                    <CopyButton
                                                        text={message?.text}
                                                    />
                                                    <ChatTtsButton
                                                        agentId={agentId}
                                                        text={message?.text}
                                                    />
                                                </div>
                                            ) : null}
                                            <div
                                                className={cn([
                                                    message?.isLoading
                                                        ? "mt-2"
                                                        : "",
                                                    "flex items-center justify-between gap-4 select-none",
                                                ])}
                                            >
                                                {message?.source ? (
                                                    <Badge variant="outline">
                                                        {message.source}
                                                    </Badge>
                                                ) : null}
                                                {message?.action ? (
                                                    <Badge variant="outline">
                                                        {message.action}
                                                    </Badge>
                                                ) : null}
                                                {message?.createdAt ? (
                                                    <ChatBubbleTimestamp
                                                        timestamp={moment(
                                                            message?.createdAt
                                                        ).format("LT")}
                                                    />
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>
                                </ChatBubble>
                            </CustomAnimatedDiv>
                        );
                    })}
                </ChatMessageList>
            </div>
            <div className="px-4 pb-4">
                <form
                    ref={formRef}
                    onSubmit={handleSendMessage}
                    className="relative rounded-md border border-primary/20 bg-card/80 backdrop-blur-sm"
                >
                    {selectedFile ? (
                        <div className="p-3 flex">
                            <div className="relative rounded-md border p-2">
                                <Button
                                    onClick={() => setSelectedFile(null)}
                                    className="absolute -right-2 -top-2 size-[22px] ring-2 ring-background"
                                    variant="outline"
                                    size="icon"
                                >
                                    <X />
                                </Button>
                                <img
                                    alt="Selected file"
                                    src={URL.createObjectURL(selectedFile)}
                                    height="100%"
                                    width="100%"
                                    className="aspect-square object-contain w-16"
                                />
                            </div>
                        </div>
                    ) : null}
                    <ChatInput
                        ref={inputRef}
                        onKeyDown={handleKeyDown}
                        value={input}
                        onChange={({ target }) => setInput(target.value)}
                        placeholder="Type your message here..."
                        className="min-h-12 resize-none rounded-md bg-transparent border-0 p-3 shadow-none focus-visible:ring-0"
                    />
                    <div className="flex items-center p-3 pt-0">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => {
                                            if (fileInputRef.current) {
                                                fileInputRef.current.click();
                                            }
                                        }}
                                    >
                                        <Paperclip className="size-4" />
                                        <span className="sr-only">
                                            Attach file
                                        </span>
                                    </Button>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        accept="image/*"
                                        className="hidden"
                                    />
                                </div>
                            </TooltipTrigger>
                            <TooltipContent side="left">
                                <p>Attach file</p>
                            </TooltipContent>
                        </Tooltip>
                        <AudioRecorder
                            agentId={agentId}
                            onChange={(newInput: string) => setInput(newInput)}
                        />
                        <Button
                            disabled={!input || sendMessageMutation?.isPending}
                            type="submit"
                            size="sm"
                            className="ml-auto gap-1.5 h-[30px] cyber-button"
                        >
                            {sendMessageMutation?.isPending
                                ? "..."
                                : "Send Message"}
                            <Send className="size-3.5" />
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
