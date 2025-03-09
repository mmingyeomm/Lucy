import { useState } from "react";
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import CopyButton from "@/components/copy-button";
import { Code, Play, CopyCheck, Terminal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Sample contracts code from /ac/programs/ac/src/lib.rs
const sampleContractCode = `use anchor_lang::prelude::*;

declare_id!("9zuEtiy6MeucRyUTkUTy8ydX9A35cKBawnrHkU3CULvf");

#[program]
mod voting_contract {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let voting_account = &mut ctx.accounts.voting_account;
        voting_account.proposal = String::from("");
        voting_account.votes_for = 0;
        voting_account.votes_against = 0;
        Ok(())
    }

    pub fn create_proposal(ctx: Context<CreateProposal>, proposal: String) -> Result<()> {
        let voting_account = &mut ctx.accounts.voting_account;
        voting_account.proposal = proposal;
        voting_account.votes_for = 0;
        voting_account.votes_against = 0;
        Ok(())
    }

    pub fn vote(ctx: Context<Vote>, support: bool) -> Result<()> {
        let voting_account = &mut ctx.accounts.voting_account;
        if support {
            voting_account.votes_for += 1;
        } else {
            voting_account.votes_against += 1;
        }
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = user, space = 8 + 40)]
    pub voting_account: Account<'info, VotingAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CreateProposal<'info> {
    #[account(mut)]
    pub voting_account: Account<'info, VotingAccount>,
}

#[derive(Accounts)]
pub struct Vote<'info> {
    #[account(mut)]
    pub voting_account: Account<'info, VotingAccount>,
}

#[account]
pub struct VotingAccount {
    pub proposal: String,
    pub votes_for: u32,
    pub votes_against: u32,
}`;

const sampleAbiCode = `{
  "address": "9zuEtiy6MeucRyUTkUTy8ydX9A35cKBawnrHkU3CULvf",
  "metadata": {
    "name": "voting_contract",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Solana Voting Program"
  },
  "instructions": [
    {
      "name": "initialize",
      "discriminator": [
        175, 175, 109, 31, 13, 152, 155, 237
      ],
      "accounts": [
        {
          "name": "voting_account",
          "writable": true,
          "signer": true
        },
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "system_program",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "createProposal",
      "discriminator": [
        147, 73, 119, 189, 189, 233, 184, 203
      ],
      "accounts": [
        {
          "name": "voting_account",
          "writable": true,
          "signer": false
        }
      ],
      "args": [
        {
          "name": "proposal",
          "type": "string"
        }
      ]
    },
    {
      "name": "vote",
      "discriminator": [
        150, 42, 89, 160, 46, 86, 115, 12
      ],
      "accounts": [
        {
          "name": "voting_account",
          "writable": true,
          "signer": false
        }
      ],
      "args": [
        {
          "name": "support",
          "type": "bool"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "VotingAccount",
      "discriminator": [
        211, 8, 232, 43, 2, 152, 117, 119
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "proposal",
            "type": "string"
          },
          {
            "name": "votes_for",
            "type": "u32"
          },
          {
            "name": "votes_against",
            "type": "u32"
          }
        ]
      }
    }
  ],
  "types": []
}`;

interface ContractViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contract: any;
}

export default function ContractViewer({ open, onOpenChange, contract }: ContractViewerProps) {
  const [activeTab, setActiveTab] = useState("code");
  const [interactionResult, setInteractionResult] = useState<string | null>(null);
  const [isInteracting, setIsInteracting] = useState(false);
  const [voteSupport, setVoteSupport] = useState(true);

  // Simulate contract interaction with Solana transaction
  const interactWithContract = () => {
    setIsInteracting(true);
    
    // Simulate network delay
    setTimeout(() => {
      if (activeTab === "interact") {
        setInteractionResult(
          `✓ Transaction successful!\nInstruction: vote\nSupport: ${voteSupport ? "For" : "Against"}\nSignature: ${Math.random().toString(16).substr(2, 64)}\nSlot: ${Math.floor(Math.random() * 200000000)}\nFee: 0.000005 SOL`
        );
      }
      setIsInteracting(false);
    }, 2000);
  };

  // Get contract code based on contract name
  const getContractCode = () => {
    return sampleContractCode;
  };

  // Get contract IDL based on contract name
  const getContractAbi = () => {
    return sampleAbiCode;
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[90%] sm:w-[540px] md:max-w-[640px] overflow-y-auto">
        <SheetHeader className="space-y-1">
          <SheetTitle className="flex items-center gap-2">
            <Code className="size-5 text-primary" />
            {contract?.name || "Contract Viewer"}
          </SheetTitle>
          <SheetDescription>
            {contract?.network || "Network"} • 
            <code className="ml-1 font-mono text-xs bg-primary/5 px-1 py-0.5 rounded">
              {contract?.address || "0x0000000000000000000000000000000000000000"}
            </code>
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6">
          <Tabs 
            defaultValue="code" 
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="code">Source Code</TabsTrigger>
              <TabsTrigger value="abi">IDL</TabsTrigger>
              <TabsTrigger value="interact">Interact</TabsTrigger>
            </TabsList>
            
            <TabsContent value="code" className="mt-0">
              <Card className="border border-primary/10 bg-card/30">
                <CardHeader className="py-2 px-4 border-b border-primary/10 flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-medium">Contract Source</CardTitle>
                  <CopyButton text={getContractCode()} />
                </CardHeader>
                <CardContent className="p-0">
                  <pre className="p-4 text-xs font-mono overflow-x-auto max-h-[400px] overflow-y-auto">
                    {getContractCode()}
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="abi" className="mt-0">
              <Card className="border border-primary/10 bg-card/30">
                <CardHeader className="py-2 px-4 border-b border-primary/10 flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-medium">Program IDL</CardTitle>
                  <CopyButton text={getContractAbi()} />
                </CardHeader>
                <CardContent className="p-0">
                  <pre className="p-4 text-xs font-mono overflow-x-auto max-h-[400px] overflow-y-auto">
                    {getContractAbi()}
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="interact" className="mt-0">
              <Card className="border border-primary/10 bg-card/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Interact with Contract</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="mb-4">
                      <div className="text-xs text-muted-foreground mb-3 pb-2 border-b border-primary/10">
                        Select instruction to execute:
                      </div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="bg-primary/5 border-primary/10 text-xs"
                          onClick={() => {}}
                        >
                          initialize
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="bg-primary/5 border-primary/10 text-xs" 
                          onClick={() => {}}
                        >
                          createProposal
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="bg-primary/10 border-primary/20 text-xs"
                        >
                          vote
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-1 block">Instruction: vote</label>
                      <div className="mb-3 px-3 py-2 bg-primary/5 rounded-md border border-primary/10">
                        <div className="text-xs text-muted-foreground mb-2">Required Accounts:</div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>voting_account ✓</div>
                        </div>
                      </div>
                      <div className="flex gap-2 items-center">
                        <div className="flex items-center gap-4 mb-2 w-full">
                          <label className="inline-flex items-center">
                            <input
                              type="radio"
                              checked={voteSupport}
                              onChange={() => setVoteSupport(true)}
                              className="h-4 w-4 text-primary"
                            />
                            <span className="ml-2 text-sm">Vote For</span>
                          </label>
                          <label className="inline-flex items-center">
                            <input
                              type="radio"
                              checked={!voteSupport}
                              onChange={() => setVoteSupport(false)}
                              className="h-4 w-4 text-primary"
                            />
                            <span className="ml-2 text-sm">Vote Against</span>
                          </label>
                        </div>
                        <Button 
                          onClick={interactWithContract}
                          disabled={isInteracting}
                          className="gap-2"
                        >
                          {isInteracting ? (
                            <>
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                              Processing...
                            </>
                          ) : (
                            <>
                              <Play className="size-4" />
                              Execute
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                    
                    {interactionResult && (
                      <div className="mt-4 p-3 bg-primary/5 rounded-md border border-primary/10">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-sm font-medium">Result</span>
                          <CopyButton text={interactionResult} />
                        </div>
                        <pre className="text-xs font-mono whitespace-pre-wrap">
                          {interactionResult}
                        </pre>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <SheetFooter className="mt-6">
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
          <Button
            variant="default"
            className="gap-1"
            onClick={() => {
              const contractCode = getContractCode();
              
              // Call the backend deployment endpoint
              fetch("http://localhost:3002/deploy", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ contract_code: contractCode }),
              })
              .then(response => response.json())
              .then(data => {
                if (data.success) {
                  // Show success message with contract address
                  setInteractionResult(
                    `✓ Contract deployed successfully!\nProgram ID: ${data.contract_address}\nNetwork: Solana Devnet`
                  );
                  setActiveTab("interact"); // Switch to interact tab
                } else {
                  // Show error message
                  setInteractionResult(
                    `⚠ Deployment failed: ${data.error || "Unknown error"}`
                  );
                }
              })
              .catch(error => {
                setInteractionResult(
                  `⚠ Deployment error: ${error.message || "Connection failed"}`
                );
              });
            }}
          >
            <Terminal className="size-4" />
            Deploy to Devnet
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}