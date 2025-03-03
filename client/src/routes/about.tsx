import { NavigationBar } from "@/components/navigation-bar";
import { motion } from "framer-motion";
import { Brain, TerminalSquare, Zap, Users, Globe, Shield, Github } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AboutRoute() {
    return (
        <div className="relative flex flex-col h-screen">
            <NavigationBar />
            
            <div className="flex-1 overflow-auto">
                <div className="max-w-5xl mx-auto p-6">
                    {/* Hero Section */}
                    <motion.div 
                        className="text-center mb-12"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="ai-avatar size-20 mx-auto mb-4">
                            <div className="ai-avatar-ring"></div>
                            <div className="ai-face-container">
                                <div className="ai-face">
                                    <div className="ai-face-inner">
                                        <div className="ai-patterns"></div>
                                        <div className="ai-circuits"></div>
                                        <div className="ai-eye ai-eye-left"></div>
                                        <div className="ai-eye ai-eye-right"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <h1 className="text-4xl font-bold mb-4">LUCY DAO</h1>
                        <p className="text-xl text-primary/70 max-w-2xl mx-auto">
                            An advanced AI companion and decentralized autonomous organization for the next generation of digital interactions
                        </p>
                    </motion.div>
                    
                    {/* Mission Statement */}
                    <motion.div 
                        className="mb-16 text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <div className="p-6 bg-primary/5 rounded-xl border border-primary/10 mb-6">
                            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
                            <p className="text-lg leading-relaxed">
                                LUCY DAO is built to bridge human creativity with AI capabilities through a decentralized framework that ensures privacy, transparency, and collective governance. We're creating a future where AI assistance is both powerful and accountable.
                            </p>
                        </div>
                        
                        <div className="flex flex-wrap justify-center gap-4">
                            <Button variant="outline" className="gap-2">
                                <Github className="h-4 w-4" />
                                View on GitHub
                            </Button>
                            <Button className="gap-2">
                                <Users className="h-4 w-4" />
                                Join Community
                            </Button>
                        </div>
                    </motion.div>
                    
                    {/* Features */}
                    <motion.div 
                        className="mb-16"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <h2 className="text-2xl font-semibold mb-8 text-center">Core Capabilities</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <FeatureCard 
                                icon={<Brain className="h-8 w-8 text-primary" />}
                                title="Neural Intelligence"
                                description="Powered by advanced language models and custom-trained systems for human-like interactions and problem-solving."
                            />
                            
                            <FeatureCard 
                                icon={<TerminalSquare className="h-8 w-8 text-primary" />}
                                title="Developer Tools"
                                description="Built-in coding assistance, documentation generation, and error debugging to boost developer productivity."
                            />
                            
                            <FeatureCard 
                                icon={<Zap className="h-8 w-8 text-primary" />}
                                title="Smart Contract Integration"
                                description="Seamlessly interact with blockchain networks through natural language commands and automated workflows."
                            />
                            
                            <FeatureCard 
                                icon={<Globe className="h-8 w-8 text-primary" />}
                                title="Decentralized Architecture"
                                description="Running on a distributed network ensuring uptime, censorship resistance, and collective ownership."
                            />
                            
                            <FeatureCard 
                                icon={<Shield className="h-8 w-8 text-primary" />}
                                title="Privacy-Preserving"
                                description="End-to-end encryption and private computation guaranteeing your data remains yours alone."
                            />
                            
                            <FeatureCard 
                                icon={<Users className="h-8 w-8 text-primary" />}
                                title="Community Governed"
                                description="Democratic decision-making through DAO mechanisms where every member has a voice in LUCY's evolution."
                            />
                        </div>
                    </motion.div>
                    
                    {/* Technical Details */}
                    <motion.div 
                        className="mb-16"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <h2 className="text-2xl font-semibold mb-6 text-center">Technical Architecture</h2>
                        
                        <div className="p-6 bg-primary/5 rounded-xl border border-primary/10">
                            <div className="mb-6">
                                <h3 className="text-lg font-medium mb-2">Neural Core</h3>
                                <p className="text-primary/70">
                                    The central processing system leveraging transformer architecture with custom attention mechanisms optimized for context-aware responses and long-term memory retention.
                                </p>
                            </div>
                            
                            <div className="mb-6">
                                <h3 className="text-lg font-medium mb-2">Blockchain Integration</h3>
                                <p className="text-primary/70">
                                    Built on Solana for high throughput and minimal transaction costs, with cross-chain bridges to Ethereum and other networks for maximum interoperability.
                                </p>
                            </div>
                            
                            <div>
                                <h3 className="text-lg font-medium mb-2">Governance Structure</h3>
                                <p className="text-primary/70">
                                    Multi-tiered voting system with weighted delegation and proposal vetting to ensure democratic yet efficient decision-making across the LUCY ecosystem.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                    
                    {/* Getting Started */}
                    <motion.div 
                        className="text-center mb-16"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                    >
                        <h2 className="text-2xl font-semibold mb-4">Start Using LUCY Today</h2>
                        <p className="mb-6 text-primary/70">
                            Begin your journey with LUCY DAO and experience the future of AI-human collaboration.
                        </p>
                        
                        <Button className="gap-2 mb-4">
                            <Brain className="h-4 w-4" />
                            Connect with LUCY
                        </Button>
                        
                        <p className="text-sm text-primary/50">
                            LUCY DAO © 2025 • All Rights Reserved • Version 2.0.77
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
    return (
        <div className="p-6 rounded-xl border border-primary/10 bg-card/30 hover:border-primary/30 transition-all hover:bg-card/40">
            <div className="mb-4">{icon}</div>
            <h3 className="text-lg font-medium mb-2">{title}</h3>
            <p className="text-primary/70">{description}</p>
        </div>
    );
}