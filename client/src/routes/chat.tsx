import { useParams } from "react-router";
import Chat from "@/components/chat";
import type { UUID } from "@elizaos/core";
import { NavigationBar } from "@/components/navigation-bar";

export default function AgentRoute() {
    const { agentId } = useParams<{ agentId: UUID }>();

    if (!agentId) return <div>No data.</div>;

    return (
        <div className="relative flex flex-col h-screen">
            <NavigationBar />
            
            {/* Chat Area */}
            <div className="flex-1 overflow-hidden">
                <Chat agentId={agentId} />
            </div>
        </div>
    );
}
