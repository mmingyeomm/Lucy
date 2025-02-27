import { cn } from "@/lib/utils";
import { SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { useState } from "react";
import { motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Activity, Wifi, SignalHigh } from "lucide-react";

export default function ConnectionStatus() {
    const [queryTime, setQueryTime] = useState<number | null>(null);

    const query = useQuery({
        queryKey: ["status"],
        queryFn: async () => {
            const start = performance.now();
            const data = await apiClient.getAgents();
            const end = performance.now();
            setQueryTime(end - start);
            return data;
        },
        refetchInterval: 5_000,
        retry: 1,
        refetchOnWindowFocus: "always",
    });

    const connected = query?.isSuccess && !query?.isError;
    const isLoading = query?.isRefetching || query?.isPending;

    return (
        <SidebarMenuItem>
            <Tooltip>
                <TooltipTrigger asChild>
                    <SidebarMenuButton className="font-mono text-xs">
                        <motion.div 
                            className="relative"
                            animate={connected ? {
                                scale: [1, 1.05, 1],
                            } : {}}
                            transition={{ 
                                duration: 0.5, 
                                repeat: isLoading ? Infinity : 0,
                                repeatType: "reverse"
                            }}
                        >
                            {isLoading ? (
                                <Wifi className="text-primary/60" />
                            ) : connected ? (
                                <SignalHigh className="text-primary" />
                            ) : (
                                <Wifi className="text-red-500" />
                            )}
                            
                            {connected && (
                                <motion.div 
                                    className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-primary"
                                    animate={{
                                        opacity: [0.5, 1, 0.5]
                                    }}
                                    transition={{
                                        duration: 1.5,
                                        repeat: Infinity,
                                        repeatType: "reverse"
                                    }}
                                />
                            )}
                        </motion.div>
                        
                        <div className="flex flex-col text-left">
                            <span className="uppercase tracking-wide">
                                {isLoading ? "SCANNING" : connected ? "CONNECTED" : "OFFLINE"}
                            </span>
                            {connected && queryTime && (
                                <span className="text-[10px] text-primary/50">{queryTime.toFixed(0)}ms LATENCY</span>
                            )}
                        </div>
                    </SidebarMenuButton>
                </TooltipTrigger>
                {connected ? (
                    <TooltipContent side="top">
                        <div className="flex items-center gap-1">
                            <Activity className="size-4" />
                            <span>{queryTime?.toFixed(2)} ms</span>
                        </div>
                    </TooltipContent>
                ) : null}
            </Tooltip>
        </SidebarMenuItem>
    );
}
