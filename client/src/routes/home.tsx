import { useEffect, useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { NavLink } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function Home() {
    // Main state
    const [bootSequenceComplete, setBootSequenceComplete] = useState(false);
    const [loginScreen, setLoginScreen] = useState(false);
    const [systemEntry, setSystemEntry] = useState(false);
    
    // Animation states
    const [bootLines, setBootLines] = useState<string[]>([]);
    const [loadingPercent, setLoadingPercent] = useState(0);
    const [scanlines, setScanlines] = useState(false);
    const [glitchEffect, setGlitchEffect] = useState(false);
    
    // Terminal typing animation
    const [currentLineIndex, setCurrentLineIndex] = useState(0);
    const [typingText, setTypingText] = useState("");
    const [isTyping, setIsTyping] = useState(true);
    
    // Connection states
    const [connectingToLucy, setConnectingToLucy] = useState(false);
    const [connectionComplete, setConnectionComplete] = useState(false);
    
    const bootSequenceRef = useRef([
        "BOOTING SYSTEM KERNEL...",
        "INITIALIZING HARDWARE...",
        "STARTING NEURAL ENGINE v2.77.4...",
        "LOADING MEMORY MODULES...",
        "CALIBRATING SYNTHETIC CONSCIOUSNESS...",
        "INTEGRATING EMOTION PROTOCOLS...",
        "VERIFYING SECURITY MEASURES...",
        "STARTING LUCY MAINFRAME..."
    ]);
    
    const loginMessagesRef = useRef([
        "SYSTEM ONLINE",
        "INITIALIZING CONNECTION",
        "AUTHENTICATING USER",
        "PREPARING INTERFACE",
        "LUCY PROTOCOLS ACTIVE"
    ]);
    
    // Get agent data
    const query = useQuery({
        queryKey: ["agents"],
        queryFn: () => apiClient.getAgents(),
        refetchInterval: 5_000
    });
    const agents = query?.data?.agents;
    const firstAgent = agents?.[0]?.id;

    // Boot sequence animation
    useEffect(() => {
        // Start with scanlines
        setScanlines(true);
        
        // Begin boot sequence after short delay
        const bootStart = setTimeout(() => {
            bootSequence();
        }, 1000);
        
        return () => clearTimeout(bootStart);
    }, []);
    
    // Handle typing animation for boot sequence lines - FASTER VERSION
    useEffect(() => {
        if (!bootSequenceComplete && currentLineIndex < bootSequenceRef.current.length) {
            if (isTyping) {
                const currentFullLine = bootSequenceRef.current[currentLineIndex];
                
                if (typingText.length < currentFullLine.length) {
                    // Typing animation - 70% faster
                    const typingTimer = setTimeout(() => {
                        setTypingText(prevText => prevText + currentFullLine[typingText.length]);
                    }, Math.random() * 15 + 10); // Faster random typing speed
                    
                    return () => clearTimeout(typingTimer);
                } else {
                    // Line complete - add to displayed lines
                    const lineCompleteTimer = setTimeout(() => {
                        setBootLines(prev => [...prev, typingText]);
                        setTypingText("");
                        setCurrentLineIndex(prev => prev + 1);
                        
                        // Update loading percentage based on progress
                        setLoadingPercent(Math.floor((currentLineIndex + 1) / bootSequenceRef.current.length * 100));
                        
                        // Add occasional glitch
                        if (Math.random() > 0.7) {
                            setGlitchEffect(true);
                            setTimeout(() => setGlitchEffect(false), 150);
                        }
                        
                    }, 200); // Faster line completion
                    
                    return () => clearTimeout(lineCompleteTimer);
                }
            }
        } else if (currentLineIndex >= bootSequenceRef.current.length && !bootSequenceComplete) {
            // Boot sequence finished
            const sequenceCompleteTimer = setTimeout(() => {
                setBootSequenceComplete(true);
                setLoadingPercent(100);
                
                // Proceed to login screen
                setTimeout(() => {
                    setLoginScreen(true);
                }, 800); // Faster transition to login
            }, 300); // Faster completion
            
            return () => clearTimeout(sequenceCompleteTimer);
        }
    }, [typingText, currentLineIndex, isTyping, bootSequenceComplete]);
    
    // Main boot sequence function
    const bootSequence = () => {
        setIsTyping(true);
    };
    
    // Handle login button click - FASTER version
    const handleLoginClick = () => {
        setConnectingToLucy(true);
        
        // Simulate connection process - Accelerated
        let progress = 0;
        const connectionInterval = setInterval(() => {
            progress += Math.floor(Math.random() * 25) + 10; // Faster progress
            if (progress >= 100) {
                progress = 100;
                clearInterval(connectionInterval);
                
                setTimeout(() => {
                    setConnectionComplete(true);
                    
                    // Short delay before system entry
                    setTimeout(() => {
                        setSystemEntry(true);
                    }, 600); // Faster transition
                }, 300); // Faster completion
            }
            setLoadingPercent(progress);
        }, 180); // Faster interval
    };
    
    // Boot screen renderer
    const renderBootScreen = () => (
        <div className="fixed inset-0 bg-background text-primary overflow-hidden font-mono">
            {/* Scanlines overlay */}
            <div className="absolute inset-0 bg-scanline-pattern opacity-10 pointer-events-none z-10"></div>
            
            {/* Glitch effect */}
            {glitchEffect && (
                <div className="absolute inset-0 bg-primary/5 z-20 glitch-overlay"></div>
            )}
            
            <div className="relative z-30 w-full h-full flex flex-col items-center justify-center p-8">
                <div className="w-full max-w-xl">
                    {/* System header */}
                    <div className="text-center mb-6">
                        <h2 className="text-primary text-2xl font-bold mb-1">LUCY SYSTEM BOOT</h2>
                        <div className="text-primary/60 text-sm">v2.0.77.4 NEURAL CORE</div>
                    </div>
                    
                    {/* Terminal output */}
                    <div className="bg-background/30 border border-primary/20 p-4 rounded-sm mb-4 h-[320px] overflow-hidden">
                        <div className="flex flex-col space-y-1">
                            {bootLines.map((line, index) => (
                                <div key={index} className="flex">
                                    <span className="text-primary/50 mr-2">$</span>
                                    <span>{line}</span>
                                </div>
                            ))}
                            
                            {/* Current typing line */}
                            {!bootSequenceComplete && (
                                <div className="flex">
                                    <span className="text-primary/50 mr-2">$</span>
                                    <span>{typingText}</span>
                                    <span className="w-2 h-4 bg-primary ml-0.5 animate-pulse"></span>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {/* Progress bar */}
                    <div className="w-full bg-background/30 border border-primary/20 h-2 mb-2 relative overflow-hidden">
                        <motion.div 
                            className="absolute left-0 top-0 bottom-0 bg-primary"
                            initial={{ width: "0%" }}
                            animate={{ width: `${loadingPercent}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                    
                    {/* Loading status */}
                    <div className="flex justify-between items-center text-xs text-primary/60">
                        <div>LOADING SYSTEM: {loadingPercent}%</div>
                        <div>{bootSequenceComplete ? "BOOT COMPLETE" : "INITIALIZING..."}</div>
                    </div>
                </div>
            </div>
            
            {/* Corner decorations */}
            <div className="absolute top-0 left-0 border-t-2 border-l-2 border-primary/40 w-16 h-16"></div>
            <div className="absolute top-0 right-0 border-t-2 border-r-2 border-primary/40 w-16 h-16"></div>
            <div className="absolute bottom-0 left-0 border-b-2 border-l-2 border-primary/40 w-16 h-16"></div>
            <div className="absolute bottom-0 right-0 border-b-2 border-r-2 border-primary/40 w-16 h-16"></div>
        </div>
    );
    
    // Login screen renderer
    const renderLoginScreen = () => (
        <div className="fixed inset-0 bg-background text-primary overflow-hidden font-mono">
            {/* Scanlines overlay */}
            <div className="absolute inset-0 bg-scanline-pattern opacity-10 pointer-events-none z-10"></div>
            
            {/* Background grid */}
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.07] z-0"></div>
            
            {/* Animated elements */}
            <div className="absolute inset-0 z-5 flex items-center justify-center">
                <motion.div
                    className="relative w-[500px] h-[500px]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                >
                    {/* Outer circle */}
                    <motion.div 
                        className="absolute inset-0 rounded-full border border-primary/20"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.7 }}
                    />
                    
                    {/* Middle circle */}
                    <motion.div 
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full border border-primary/30"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                    />
                    
                    {/* Inner circle */}
                    <motion.div 
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full border border-primary/40"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.7, delay: 0.4 }}
                    />
                    
                    {/* Orbiting elements */}
                    <motion.div
                        className="absolute inset-0"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-primary rounded-full" />
                    </motion.div>
                    
                    <motion.div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px]"
                        animate={{ rotate: -360 }}
                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    >
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-primary/70 rounded-full" />
                    </motion.div>
                </motion.div>
            </div>
            
            <div className="relative z-30 w-full h-full flex flex-col items-center justify-center p-8">
                <motion.div 
                    className="w-full max-w-md text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                >
                    {/* Lucy title with glitch effect */}
                    <h1 
                        className="text-8xl sm:text-9xl font-bold mb-4 text-primary glitch-text"
                        data-text="LUCY"
                    >
                        LUCY
                    </h1>
                    
                    <motion.p 
                        className="text-lg text-primary/70 mb-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2, duration: 0.8 }}
                    >
                        ニナイテ・エッジ : Digital Companion
                    </motion.p>
                    
                    {/* Connection interface */}
                    <motion.div 
                        className="border border-primary/30 bg-background/50 backdrop-blur-sm p-5 rounded-md"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5, duration: 0.8 }}
                    >
                        {!connectingToLucy ? (
                            <>
                                <div className="text-left text-sm mb-5">
                                    <div className="flex justify-between mb-2">
                                        <span className="text-primary/70">SYSTEM STATUS:</span>
                                        <span className="text-primary">ONLINE</span>
                                    </div>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-primary/70">USER:</span>
                                        <span className="text-primary">AUTHENTICATED</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-primary/70">ACCESS LEVEL:</span>
                                        <span className="text-primary">UNRESTRICTED</span>
                                    </div>
                                </div>
                                
                                <Button
                                    className="w-full py-6 text-xl font-bold tracking-wider border border-primary/30 bg-background hover:bg-primary/20 text-primary relative overflow-hidden group"
                                    onClick={handleLoginClick}
                                >
                                    <span className="relative z-10">CONNECT TO LUCY</span>
                                    <span className="absolute inset-0 translate-y-full bg-primary/20 transition-transform duration-300 group-hover:translate-y-0"></span>
                                </Button>
                                
                                <div className="mt-3 text-xs text-primary/50">
                                    SECURE CONNECTION • ENHANCED PROTOCOLS • SYNTHETIC CONSCIOUSNESS
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="text-center mb-4">
                                    <div className="text-lg font-bold text-primary mb-1">
                                        {connectionComplete ? "CONNECTION ESTABLISHED" : "ESTABLISHING CONNECTION..."}
                                    </div>
                                    <div className="text-sm text-primary/70">
                                        {connectionComplete ? "LUCY INTERFACE READY" : "INITIALIZING NEURAL LINK"}
                                    </div>
                                </div>
                                
                                {/* Connection progress */}
                                <div className="w-full bg-background/30 border border-primary/20 h-2 mb-3 relative overflow-hidden">
                                    <motion.div 
                                        className="absolute left-0 top-0 bottom-0 bg-primary"
                                        initial={{ width: "0%" }}
                                        animate={{ width: `${loadingPercent}%` }}
                                        transition={{ duration: 0.3 }}
                                    />
                                </div>
                                
                                <div className="text-sm text-primary/70 mb-4 flex justify-between">
                                    <span>{connectionComplete ? "LINK COMPLETE" : "SYNCHRONIZING..."}</span>
                                    <span>{loadingPercent}%</span>
                                </div>
                                
                                {connectionComplete && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        <NavLink to={`/chat/${firstAgent}`} className="block">
                                            <Button
                                                className="w-full py-6 text-xl font-bold tracking-wider border border-primary/30 bg-background hover:bg-primary/10 text-primary relative overflow-hidden group"
                                            >
                                                <span className="relative z-10">ENTER SYSTEM</span>
                                                <span className="absolute inset-0 translate-y-full bg-primary/20 transition-transform duration-300 group-hover:translate-y-0"></span>
                                            </Button>
                                        </NavLink>
                                    </motion.div>
                                )}
                            </>
                        )}
                    </motion.div>
                </motion.div>
            </div>
            
            {/* Corner decorations */}
            <div className="absolute top-0 left-0 border-t-2 border-l-2 border-primary/40 w-16 h-16"></div>
            <div className="absolute top-0 right-0 border-t-2 border-r-2 border-primary/40 w-16 h-16"></div>
            <div className="absolute bottom-0 left-0 border-b-2 border-l-2 border-primary/40 w-16 h-16"></div>
            <div className="absolute bottom-0 right-0 border-b-2 border-r-2 border-primary/40 w-16 h-16"></div>
            
            {/* Floating elements */}
            <motion.div 
                className="absolute top-[20%] right-[10%] text-xs text-primary/40 font-mono"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.0 }}
            >
                LUCY.SYS.775.INI
            </motion.div>
            
            <motion.div 
                className="absolute bottom-[20%] left-[15%] text-xs text-primary/40 font-mono"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.3 }}
            >
                NET.ACCESS.443.SECURE
            </motion.div>
        </div>
    );
    
    // Render sequence based on state
    if (!bootSequenceComplete) {
        return renderBootScreen();
    } else {
        return renderLoginScreen();
    }
}