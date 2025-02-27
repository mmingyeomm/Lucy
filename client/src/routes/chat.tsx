import { useParams } from "react-router";
import Chat from "@/components/chat";
import type { UUID } from "@elizaos/core";

export default function AgentRoute() {
    const { agentId } = useParams<{ agentId: UUID }>();

    if (!agentId) return <div>No data.</div>;

    return (
        <div className="relative">
            <div className="absolute left-0 top-0 right-0 p-4 flex items-center gap-3 bg-background/40 backdrop-blur-sm border-b border-primary/20 z-10 ml-[60px]">
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
            <div className="pt-16">
                <Chat agentId={agentId} />
            </div>
        </div>
    );
}
