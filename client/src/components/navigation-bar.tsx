import { NavLink, useLocation } from "react-router";
import type { UUID } from "@elizaos/core";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Cpu, Network, MessagesSquare, FileCode, BookOpen } from "lucide-react";
import ConnectionStatus from "./connection-status";
import info from "@/lib/info.json";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";

export function NavigationBar() {
    const location = useLocation();
    const [animateIcons, setAnimateIcons] = useState(false);
    
    const query = useQuery({
        queryKey: ["agents"],
        queryFn: () => apiClient.getAgents(),
        refetchInterval: 5_000,
    });

    const agents = query?.data?.agents;

    // Trigger icon animations periodically
    useEffect(() => {
        const interval = setInterval(() => {
            setAnimateIcons(true);
            setTimeout(() => setAnimateIcons(false), 2000);
        }, 15000);
        
        return () => clearInterval(interval);
    }, []);
    
    return (
        <>
            {/* Header Bar */}
            <div className="p-4 flex items-center justify-between gap-3 bg-background/40 backdrop-blur-sm border-b border-primary/20 z-10">
                <div className="flex items-center gap-3">
                    <div className="ai-avatar size-8">
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
                    <div className="flex flex-col">
                        <div className="font-medium">Lucy DAO</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <span className="size-1.5 bg-primary rounded-full animate-pulse"></span> 
                            Active Now
                        </div>
                    </div>
                </div>
                
                {/* Lucy System Tag */}
                <div className="flex items-center gap-2">
                    <div className="text-xs text-primary/40 font-mono px-2 py-1 text-center border border-primary/10 bg-background/20 rounded">
                        <motion.span 
                            animate={animateIcons ? { opacity: [0.5, 0.8, 0.5] } : {}}
                            transition={{ duration: 1, repeat: 3, repeatType: "reverse" }}
                        >
                            LUCY CORE v{info?.version}
                        </motion.span>
                    </div>
                </div>
            </div>
            
            {/* Navigation Menu */}
            <div className="border-b border-primary/10 w-full bg-card/30 backdrop-blur-sm px-4 py-2 flex justify-center gap-6">
                {/* Navigation Logo */}
                <NavLink to="/" className="flex items-center gap-2">
                    <motion.div 
                        className="size-7 flex items-center justify-center bg-primary text-primary-foreground font-bold rounded-full border border-cyan-300/30"
                        animate={animateIcons ? {
                            scale: [1, 1.1, 1],
                            borderColor: ['hsla(180, 100%, 70%, 0.3)', 'hsla(180, 100%, 90%, 0.8)', 'hsla(180, 100%, 70%, 0.3)']
                        } : {}}
                        transition={{ duration: 1.5 }}
                    >
                        L
                    </motion.div>
                </NavLink>
                
                {/* Agents Menu */}
                <div className="flex items-center gap-4">
                    {query?.isPending ? (
                        <div className="h-6 w-24 bg-primary/10 animate-pulse rounded"></div>
                    ) : (
                        agents?.map((agent: { id: UUID; name: string }) => (
                            <NavLink
                                key={agent.id}
                                to={`/chat/${agent.id}`}
                                className={`flex items-center gap-2 px-3 py-1 rounded-md transition-colors ${location.pathname.includes(agent.id) && location.pathname.includes('chat') ? 'bg-primary/20 text-primary' : 'hover:bg-primary/10'}`}
                            >
                                <motion.div
                                    animate={animateIcons && location.pathname.includes(agent.id) && location.pathname.includes('chat') ? {
                                        rotate: [0, 15, 0, -15, 0]
                                    } : {}}
                                    transition={{ duration: 0.5 }}
                                >
                                    <MessagesSquare className="size-4" />
                                </motion.div>
                                <span className="font-mono text-xs tracking-wide uppercase">
                                    {agent.name}
                                </span>
                            </NavLink>
                        ))
                    )}
                </div>
                
                {/* System Controls */}
                <div className="flex items-center gap-4">
                    <NavLink
                        to="/contracts"
                        className={`flex items-center gap-2 px-3 py-1 rounded-md transition-colors ${location.pathname.includes('contracts') ? 'bg-primary/20 text-primary' : 'hover:bg-primary/10'}`}
                    >
                        <motion.div
                            animate={animateIcons && location.pathname.includes('contracts') ? {
                                rotate: [0, 180, 360]
                            } : {}}
                            transition={{ duration: 1 }}
                        >
                            <Cpu className="size-4 text-primary" />
                        </motion.div>
                        <span className="font-mono text-xs tracking-wide uppercase">Contracts</span>
                    </NavLink>
                    
                    <button className="flex items-center gap-2 px-3 py-1 rounded-md hover:bg-primary/10 transition-colors">
                        <motion.div
                            animate={animateIcons ? {
                                y: [0, -2, 0, 2, 0]
                            } : {}}
                            transition={{ duration: 0.5 }}
                        >
                            <Network className="size-4 text-primary" />
                        </motion.div>
                        <span className="font-mono text-xs tracking-wide uppercase">Network</span>
                    </button>
                </div>
                
                {/* Documentation Link */}
                <NavLink
                    to="/about"
                    className={`flex items-center gap-2 px-3 py-1 rounded-md transition-colors ${location.pathname.includes('about') ? 'bg-primary/20 text-primary' : 'hover:bg-primary/10'}`}
                >
                    <BookOpen className="size-4 text-primary" />
                    <span className="font-mono text-xs uppercase">About Lucy</span>
                </NavLink>
                
                {/* External Docs Link */}
                <NavLink
                    to="https://elizaos.github.io/eliza/docs/intro/"
                    target="_blank"
                    className="flex items-center gap-2 px-3 py-1 rounded-md hover:bg-primary/10 transition-colors"
                >
                    <FileCode className="size-4 text-primary" />
                    <span className="font-mono text-xs uppercase">API Docs</span>
                </NavLink>
                
                {/* Connection Status */}
                <ConnectionStatus />
            </div>
        </>
    );
}