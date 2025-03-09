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
import { Code, Play, CopyCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Sample contracts code for demo purposes - Solana Program in Rust
const sampleContractCode = `// LucyDAO Governance Program for Solana
use anchor_lang::prelude::*;

declare_id!("8c1eD7e19abAa9f23c476dA86Dc1577F1Ef401f8");

#[program]
pub mod lucy_governance {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let governance = &mut ctx.accounts.governance;
        governance.admin = ctx.accounts.admin.key();
        governance.total_votes = 0;
        governance.name = "LucyDAO Governance".to_string();
        
        Ok(())
    }

    pub fn cast_vote(ctx: Context<CastVote>, amount: u64) -> Result<()> {
        require!(amount > 0, LucyGovernanceError::ZeroVoteAmount);
        
        let governance = &mut ctx.accounts.governance;
        let voter = &mut ctx.accounts.voter;
        
        // Update the voter's vote count
        let vote_account = &mut ctx.accounts.vote_account;
        vote_account.amount = vote_account.amount.checked_add(amount)
            .ok_or(LucyGovernanceError::VoteOverflow)?;
        
        // Update total votes
        governance.total_votes = governance.total_votes.checked_add(amount)
            .ok_or(LucyGovernanceError::VoteOverflow)?;
            
        emit!(VoteCast {
            voter: voter.key(),
            amount,
        });
        
        Ok(())
    }
    
    pub fn get_vote_count(ctx: Context<GetVoteCount>) -> Result<u64> {
        Ok(ctx.accounts.vote_account.amount)
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = admin, space = 8 + 32 + 8 + 4 + 20)]
    pub governance: Account<'info, Governance>,
    #[account(mut)]
    pub admin: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CastVote<'info> {
    #[account(mut)]
    pub governance: Account<'info, Governance>,
    #[account(mut)]
    pub voter: Signer<'info>,
    #[account(
        init_if_needed,
        payer = voter,
        space = 8 + 8,
        seeds = [b"vote", voter.key().as_ref()],
        bump
    )]
    pub vote_account: Account<'info, VoteRecord>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct GetVoteCount<'info> {
    pub voter: AccountInfo<'info>,
    #[account(seeds = [b"vote", voter.key().as_ref()], bump)]
    pub vote_account: Account<'info, VoteRecord>,
}

#[account]
pub struct Governance {
    pub admin: Pubkey,
    pub total_votes: u64,
    pub name: String,
}

#[account]
pub struct VoteRecord {
    pub amount: u64,
}

#[event]
pub struct VoteCast {
    pub voter: Pubkey,
    pub amount: u64,
}

#[error_code]
pub enum LucyGovernanceError {
    #[msg("Vote amount must be greater than zero")]
    ZeroVoteAmount,
    #[msg("Vote calculation overflow")]
    VoteOverflow,
}`;

const sampleAbiCode = `{
  "address": "8c1eD7e19abAa9f23c476dA86Dc1577F1Ef401f8",
  "metadata": {
    "name": "lucy_governance",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "LucyDAO Governance Program"
  },
  "instructions": [
    {
      "name": "initialize",
      "discriminator": [
        175, 175, 109, 31, 13, 152, 155, 237
      ],
      "accounts": [
        {
          "name": "governance",
          "writable": true,
          "signer": true
        },
        {
          "name": "admin",
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
      "name": "castVote",
      "discriminator": [
        242, 35, 198, 137, 82, 225, 242, 182
      ],
      "accounts": [
        {
          "name": "governance",
          "writable": true,
          "signer": false
        },
        {
          "name": "voter",
          "writable": true,
          "signer": true
        },
        {
          "name": "vote_account",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [118, 111, 116, 101]
              },
              {
                "kind": "account",
                "account": "Voter",
                "path": "key"
              }
            ]
          }
        },
        {
          "name": "system_program",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "getVoteCount",
      "discriminator": [
        86, 142, 69, 173, 32, 4, 157, 142
      ],
      "accounts": [
        {
          "name": "voter",
          "writable": false,
          "signer": false
        },
        {
          "name": "vote_account",
          "writable": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [118, 111, 116, 101]
              },
              {
                "kind": "account",
                "account": "Voter",
                "path": "key"
              }
            ]
          }
        }
      ],
      "args": [],
      "returns": "u64"
    }
  ],
  "accounts": [
    {
      "name": "Governance",
      "discriminator": [
        211, 8, 232, 43, 2, 152, 117, 119
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "admin",
            "type": "publicKey"
          },
          {
            "name": "totalVotes",
            "type": "u64"
          },
          {
            "name": "name",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "VoteRecord",
      "discriminator": [
        172, 54, 187, 214, 56, 42, 11, 167
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "events": [
    {
      "name": "VoteCast",
      "discriminator": [
        65, 214, 182, 124, 157, 20, 24, 0
      ],
      "fields": [
        {
          "name": "voter",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "amount",
          "type": "u64",
          "index": false
        }
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "ZeroVoteAmount",
      "msg": "Vote amount must be greater than zero"
    },
    {
      "code": 6001,
      "name": "VoteOverflow",
      "msg": "Vote calculation overflow"
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
  const [voteAmount, setVoteAmount] = useState("1");

  // Simulate contract interaction with Solana transaction
  const interactWithContract = () => {
    setIsInteracting(true);
    
    // Simulate network delay
    setTimeout(() => {
      if (activeTab === "interact") {
        setInteractionResult(
          `✓ Transaction successful!\nInstruction: castVote\nVotes cast: ${voteAmount}\nSignature: ${Math.random().toString(16).substr(2, 64)}\nSlot: ${Math.floor(Math.random() * 200000000)}\nFee: 0.000005 SOL`
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
                          className="bg-primary/10 border-primary/20 text-xs" 
                        >
                          castVote
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="bg-primary/5 border-primary/10 text-xs"
                          onClick={() => {}}
                        >
                          getVoteCount
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-1 block">Instruction: castVote</label>
                      <div className="mb-3 px-3 py-2 bg-primary/5 rounded-md border border-primary/10">
                        <div className="text-xs text-muted-foreground mb-2">Required Accounts:</div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>governance ✓</div>
                          <div>voter ✓</div>
                          <div>vote_account ✓</div>
                          <div>system_program ✓</div>
                        </div>
                      </div>
                      <div className="flex gap-2 items-center">
                        <input
                          type="number"
                          min="1"
                          value={voteAmount}
                          onChange={e => setVoteAmount(e.target.value)}
                          placeholder="Vote amount"
                          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        />
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
          >
            <CopyCheck className="size-4" />
            Verify on Solana Explorer
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}