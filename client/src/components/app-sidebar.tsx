import { useQuery } from "@tanstack/react-query";
import info from "@/lib/info.json";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSkeleton,
    SidebarSeparator,
} from "@/components/ui/sidebar";
import { apiClient } from "@/lib/api";
import { NavLink, useLocation } from "react-router";
import type { UUID } from "@elizaos/core";
import { motion } from "framer-motion";
import { Book, Cog, User, Terminal, Cpu, Network, Lock, ChevronRight, MessagesSquare, FileCode } from "lucide-react";
import { useState, useEffect } from 'react';
import ConnectionStatus from "./connection-status";

export function AppSidebar() {
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
        <Sidebar>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <NavLink to="/">
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

                                <div className="flex flex-col gap-0.5 leading-none">
                                    <span className="font-semibold font-mono tracking-wider">
                                        LUCY
                                    </span>
                                    <span className="text-primary/70 text-xs">SYS v{info?.version}</span>
                                </div>
                            </NavLink>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
                
                <div className="text-xs text-primary/40 font-mono px-2 py-1 text-center border-y border-primary/10 mt-2 bg-background/20">
                    NEURAL SYSTEMS ONLINE
                </div>
            </SidebarHeader>
            
            <SidebarContent className="pt-2">
                <SidebarGroup>
                    <SidebarGroupLabel className="flex items-center gap-1.5 uppercase tracking-wider text-[10px] text-primary/50 font-mono">
                        <Lock className="w-3 h-3" /> Secure Connections
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {query?.isPending ? (
                                <div>
                                    {Array.from({ length: 3 }).map(
                                        (_, _index) => (
                                            <SidebarMenuItem key={"skeleton-item-" + _index}>
                                                <SidebarMenuSkeleton />
                                            </SidebarMenuItem>
                                        )
                                    )}
                                </div>
                            ) : (
                                <div>
                                    {agents?.map(
                                        (agent: { id: UUID; name: string }) => (
                                            <SidebarMenuItem key={agent.id}>
                                                <NavLink
                                                    to={`/chat/${agent.id}`}
                                                >
                                                    <SidebarMenuButton
                                                        isActive={location.pathname.includes(agent.id)}
                                                        className="font-mono text-xs relative group"
                                                    >
                                                        <motion.div
                                                            className="relative"
                                                            animate={animateIcons && location.pathname.includes(agent.id) ? {
                                                                rotate: [0, 15, 0, -15, 0]
                                                            } : {}}
                                                            transition={{ duration: 0.5 }}
                                                        >
                                                            <MessagesSquare className="text-primary" />
                                                            <div className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                                                        </motion.div>
                                                        <span className="tracking-wide uppercase">
                                                            {agent.name}
                                                        </span>
                                                        <ChevronRight className="absolute right-2 w-4 h-4 opacity-0 transition-opacity group-hover:opacity-100 text-primary" />
                                                    </SidebarMenuButton>
                                                </NavLink>
                                            </SidebarMenuItem>
                                        )
                                    )}
                                </div>
                            )}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                
                <SidebarSeparator className="my-2" />
                
                <SidebarGroup>
                    <SidebarGroupLabel className="flex items-center gap-1.5 uppercase tracking-wider text-[10px] text-primary/50 font-mono">
                        <Terminal className="w-3 h-3" /> System Controls
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton className="font-mono text-xs">
                                    <motion.div
                                        animate={animateIcons ? {
                                            rotate: [0, 180, 360]
                                        } : {}}
                                        transition={{ duration: 1 }}
                                    >
                                        <Cpu className="text-primary" />
                                    </motion.div>
                                    <span className="tracking-wide uppercase">Neural Core</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton className="font-mono text-xs">
                                    <motion.div
                                        animate={animateIcons ? {
                                            y: [0, -2, 0, 2, 0]
                                        } : {}}
                                        transition={{ duration: 0.5 }}
                                    >
                                        <Network className="text-primary" />
                                    </motion.div>
                                    <span className="tracking-wide uppercase">Network</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            
            <SidebarFooter className="mt-auto">
                <div className="p-2 text-xs text-primary/50 bg-background/20 border-t border-primary/10 font-mono text-center mb-2">
                    <motion.div 
                        animate={animateIcons ? { opacity: [0.5, 0.8, 0.5] } : {}}
                        transition={{ duration: 1, repeat: 3, repeatType: "reverse" }}
                    >
                        LUCY CORE v{info?.version} • ENCRYPTED
                    </motion.div>
                </div>
                
                <SidebarMenu>
                    <SidebarMenuItem>
                        <NavLink
                            to="https://elizaos.github.io/eliza/docs/intro/"
                            target="_blank"
                        >
                            <SidebarMenuButton className="font-mono text-xs group">
                                <FileCode className="text-primary group-hover:text-primary" />
                                <span className="uppercase">Documentation</span>
                            </SidebarMenuButton>
                        </NavLink>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton disabled className="font-mono text-xs opacity-70">
                            <Cog className="text-primary/70" /> 
                            <span className="uppercase">Settings</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <ConnectionStatus />
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}