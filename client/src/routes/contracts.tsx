import { useState, useEffect } from "react";
import { NavigationBar } from "@/components/navigation-bar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Code, Database, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ContractsRoute() {
    const [loading, setLoading] = useState(true);
    const [contracts, setContracts] = useState<any[]>([]);

    // Simulated contract data - in a real app, you'd fetch this from your API
    useEffect(() => {
        const timer = setTimeout(() => {
            setContracts([
                {
                    id: "contract-1",
                    name: "LucyDAO Governance",
                    address: "0x8c1eD7e19abAa9f23c476dA86Dc1577F1Ef401f8",
                    network: "Solana Mainnet",
                    deployDate: "2025-02-15",
                    status: "Active",
                    interactions: 243
                },
                {
                    id: "contract-2",
                    name: "Neural Network Bridge",
                    address: "0x2F9BeBbE6AeF1C8cA02c9e85619924D47e97bF69",
                    network: "Solana Testnet",
                    deployDate: "2025-03-01",
                    status: "Testing",
                    interactions: 56
                },
                {
                    id: "contract-3",
                    name: "LucyAI Storage",
                    address: "0xE32d51C3142257F3F2b43f128Db89c8134afC901",
                    network: "Solana Mainnet",
                    deployDate: "2025-02-28",
                    status: "Active",
                    interactions: 189
                }
            ]);
            setLoading(false);
        }, 1500);
        
        return () => clearTimeout(timer);
    }, []);
    
    const refreshContracts = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    };

    return (
        <div className="relative flex flex-col h-screen">
            <NavigationBar />
            
            <div className="flex-1 overflow-auto p-6">
                <div className="max-w-5xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-2xl font-bold mb-2">Neural Core Contracts</h1>
                            <p className="text-muted-foreground">View and manage your deployed contracts</p>
                        </div>
                        
                        <Button 
                            variant="outline" 
                            className="gap-2"
                            onClick={refreshContracts}
                            disabled={loading}
                        >
                            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                            Refresh
                        </Button>
                    </div>
                    
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[1, 2, 3].map((i) => (
                                <Card key={i} className="border border-primary/10 bg-card/30">
                                    <CardHeader className="pb-2">
                                        <div className="h-6 w-3/4 bg-primary/10 animate-pulse rounded mb-2"></div>
                                        <div className="h-4 w-1/2 bg-primary/10 animate-pulse rounded"></div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            <div className="h-4 w-full bg-primary/10 animate-pulse rounded"></div>
                                            <div className="h-4 w-full bg-primary/10 animate-pulse rounded"></div>
                                            <div className="h-4 w-3/4 bg-primary/10 animate-pulse rounded"></div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {contracts.map((contract) => (
                                <motion.div
                                    key={contract.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Card className="border border-primary/10 bg-card/30 hover:border-primary/30 transition-colors group">
                                        <CardHeader className="pb-2">
                                            <div className="flex justify-between items-start">
                                                <CardTitle className="text-lg flex items-center gap-2">
                                                    <Code className="h-4 w-4 text-primary" />
                                                    {contract.name}
                                                </CardTitle>
                                                <span className={`text-xs px-2 py-1 rounded ${
                                                    contract.status === 'Active' 
                                                        ? 'bg-green-500/10 text-green-500' 
                                                        : 'bg-amber-500/10 text-amber-500'
                                                }`}>
                                                    {contract.status}
                                                </span>
                                            </div>
                                            <CardDescription className="text-primary/70">
                                                {contract.network}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Address:</span>
                                                    <code className="font-mono text-xs bg-primary/5 px-1 py-0.5 rounded">
                                                        {contract.address.substring(0, 8)}...{contract.address.substring(contract.address.length - 6)}
                                                    </code>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Deployed:</span>
                                                    <span>{contract.deployDate}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Interactions:</span>
                                                    <span className="flex items-center gap-1">
                                                        <Database className="h-3 w-3 text-primary" />
                                                        {contract.interactions}
                                                    </span>
                                                </div>
                                                <div className="pt-2">
                                                    <Button 
                                                        variant="outline" 
                                                        className="w-full text-xs h-8 bg-primary/5 hover:bg-primary/10 border-primary/10 group-hover:border-primary/20"
                                                    >
                                                        View Details
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}