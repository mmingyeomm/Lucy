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
                            Lucy is an AI-driven agent that streamlines the entire process of creating and deploying DAO smart contracts on the Solana blockchain through natural language commands.
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
                                Lucy aims to democratize on-chain governance by empowering anyone—regardless of technical background—to build, launch, and manage decentralized organizations on Solana. By merging AI-based code generation with secure deployment workflows, Lucy reduces development barriers and accelerates community-driven innovation in the Web3 space.
                            </p>
                        </div>
                        
                        <div className="flex flex-wrap justify-center gap-4">
                            <Button variant="outline" className="gap-2" onClick={() => window.open('https://github.com/mmingyeomm/Lucy')}>
                                <Github className="h-4 w-4" />
                                View on GitHub
                            </Button>
                            <Button className="gap-2" onClick={() => window.open('https://t.me/+iAps93_b4485YmM1')} >
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
                                description="Utilizes LLMs to interpret user requests and generate production-ready smart contract code"
                            />
                            
                            <FeatureCard 
                                icon={<TerminalSquare className="h-8 w-8 text-primary" />}
                                title="Developer Tools"
                                description="Offers an ecosystem of tooling for testing, debugging, and deploying DAO contracts—streamlining the Solana development experience"
                            />
                            
                            <FeatureCard 
                                icon={<Zap className="h-8 w-8 text-primary" />}
                                title="Smart Contract Integration"
                                description="Connects seamlessly with existing Solana programs, ensuring DAOs can leverage robust token standards, treasury modules, and upgradeable governance structures"
                            />
                            
                            <FeatureCard 
                                icon={<Globe className="h-8 w-8 text-primary" />}
                                title="Decentralized Architecture"
                                description="Prioritizes on-chain interactions and trustless execution, fostering transparent and community-centric decision-making"
                            />
                            
                            <FeatureCard 
                                icon={<Shield className="h-8 w-8 text-primary" />}
                                title="Privacy-Preserving"
                                description="Employs secure coding practices and optional encryption layers, allowing DAOs to safeguard sensitive information within their governance processes"
                            />
                            
                            <FeatureCard 
                                icon={<Users className="h-8 w-8 text-primary" />}
                                title="Community Governed"
                                description="Encourages collaborative input and oversight, ensuring that feature developments, governance rules, and protocol upgrades reflect the collective will of DAO participants"
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
                                <h3 className="text-lg font-medium mb-2">AI Code Generation</h3>
                                <p className="text-primary/70">
                                    Lucy translates plain-English (or other language) prompts into Rust smart contracts using a specialized language model, incorporating governance templates and best practices to reduce vulnerabilities.
                                </p>
                            </div>
                            
                            <div className="mb-6">
                                <h3 className="text-lg font-medium mb-2">Automated Deployment</h3>
                                <p className="text-primary/70">
                                    Once the code is generated, it is compiled and tested on Solana's devnet or testnet before being deployed to mainnet. A one-click deploy mechanism handles environment configurations to ensure a smooth, error-free launch.
                                </p>
                            </div>
                            
                            <div className="mb-6">
                                <h3 className="text-lg font-medium mb-2">DAO Management Layer</h3>
                                <p className="text-primary/70">
                                    After successful deployment, Lucy can register the DAO for continuous oversight—enabling proposals, voting, treasury actions, and more. A user-friendly dashboard or Lucy's chat interface makes it easy to manage upgrades, token distribution, and ongoing governance adjustments.
                                </p>
                            </div>
                            
                            <div>
                                <h3 className="text-lg font-medium mb-2">Modular Upgradability</h3>
                                <p className="text-primary/70">
                                    DAOs built with Lucy can adapt to evolving needs by integrating new governance modules or features without requiring a complete rebuild. This modular approach supports incremental improvements and fosters long-term sustainability for decentralized organizations on Solana.  
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