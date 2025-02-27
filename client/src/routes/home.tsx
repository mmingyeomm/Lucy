import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { NavLink } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function Home() {
    const [showEntrance, setShowEntrance] = useState(true);
    const [glitchText, setGlitchText] = useState(false);
    
    // Animation states
    const [scanlineVisible, setScanlineVisible] = useState(false);
    const [textVisible, setTextVisible] = useState(false);
    const [buttonVisible, setButtonVisible] = useState(false);
    const [gridVisible, setGridVisible] = useState(false);
    const [circleVisible, setCircleVisible] = useState(false);
    const [cornersVisible, setCornersVisible] = useState(false);

    const query = useQuery({
        queryKey: ["agents"],
        queryFn: () => apiClient.getAgents(),
        refetchInterval: 5_000
    });

    const agents = query?.data?.agents;
    const firstAgent = agents?.[0]?.id;

    useEffect(() => {
        // Animation sequence
        const timer1 = setTimeout(() => setGridVisible(true), 300);
        const timer2 = setTimeout(() => setScanlineVisible(true), 800);
        const timer3 = setTimeout(() => setCircleVisible(true), 1200);
        const timer4 = setTimeout(() => setTextVisible(true), 1600);
        const timer5 = setTimeout(() => setCornersVisible(true), 2000);
        const timer6 = setTimeout(() => setGlitchText(true), 2400);
        const timer7 = setTimeout(() => setButtonVisible(true), 3000);
        
        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
            clearTimeout(timer4);
            clearTimeout(timer5);
            clearTimeout(timer6);
            clearTimeout(timer7);
        };
    }, []);

    if (showEntrance) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-background overflow-hidden">
                {/* Background grid pattern */}
                <AnimatePresence>
                    {gridVisible && (
                        <motion.div 
                            className="absolute inset-0 z-0 bg-grid-pattern opacity-0"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.1 }}
                            transition={{ duration: 1.2 }}
                        />
                    )}
                </AnimatePresence>
                
                {/* Scanlines effect */}
                <AnimatePresence>
                    {scanlineVisible && (
                        <motion.div 
                            className="absolute inset-0 z-10 bg-scanline-pattern opacity-0 pointer-events-none"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.05 }}
                            transition={{ duration: 0.8 }}
                        />
                    )}
                </AnimatePresence>
                
                {/* Animated circle background */}
                <AnimatePresence>
                    {circleVisible && (
                        <motion.div
                            className="absolute z-5"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 0.15 }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                        >
                            <div className="w-[600px] h-[600px] rounded-full border border-primary/30 flex items-center justify-center">
                                <div className="w-[400px] h-[400px] rounded-full border border-primary/40"></div>
                                <div className="absolute w-[200px] h-[200px] rounded-full border border-primary/50"></div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                
                <div className="relative z-20 max-w-3xl w-full px-6 text-center">
                    {/* Main title */}
                    <AnimatePresence>
                        {textVisible && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                                className="mb-10"
                            >
                                <h1 
                                    className={`text-7xl md:text-9xl font-bold mb-4 text-primary ${glitchText ? 'glitch-text' : ''}`}
                                    data-text="LUCY"
                                >
                                    LUCY
                                </h1>
                                <motion.p 
                                    className="text-xl text-muted-foreground"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3, duration: 0.8 }}
                                >
                                    ニナイテ・エッジ : Digital Companion
                                </motion.p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    
                    {/* Start button */}
                    <AnimatePresence>
                        {buttonVisible && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5 }}
                                className="mt-10"
                            >
                                {firstAgent ? (
                                    <NavLink to={`/chat/${firstAgent}`}>
                                        <Button
                                            className="px-8 py-6 text-xl border border-primary/30 bg-background hover:bg-primary/20 text-primary hover:text-primary relative overflow-hidden group"
                                            onClick={() => setShowEntrance(false)}
                                        >
                                            <span className="relative z-10 tracking-wider">CONNECT</span>
                                            <span className="absolute inset-0 translate-y-full bg-primary/20 transition-transform duration-300 group-hover:translate-y-0"></span>
                                        </Button>
                                    </NavLink>
                                ) : (
                                    <Button
                                        className="px-8 py-6 text-xl border border-primary/30 bg-background hover:bg-primary/20 text-primary hover:text-primary"
                                        onClick={() => setShowEntrance(false)}
                                        disabled
                                    >
                                        <span className="relative z-10">LOADING...</span>
                                    </Button>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                
                {/* Corner decorations */}
                <AnimatePresence>
                    {cornersVisible && (
                        <>
                            <motion.div 
                                className="absolute top-0 left-0 border-t-2 border-l-2 border-primary w-16 h-16"
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4 }}
                            />
                            <motion.div 
                                className="absolute top-0 right-0 border-t-2 border-r-2 border-primary w-16 h-16"
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4, delay: 0.1 }}
                            />
                            <motion.div 
                                className="absolute bottom-0 left-0 border-b-2 border-l-2 border-primary w-16 h-16"
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4, delay: 0.2 }}
                            />
                            <motion.div 
                                className="absolute bottom-0 right-0 border-b-2 border-r-2 border-primary w-16 h-16"
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4, delay: 0.3 }}
                            />
                        </>
                    )}
                </AnimatePresence>
                
                {/* Additional floating elements */}
                <AnimatePresence>
                    {textVisible && (
                        <>
                            <motion.div 
                                className="absolute top-[20%] right-[15%] text-xs text-primary/40 font-mono"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.8, duration: 0.7 }}
                            >
                                SYS.01.775.INI
                            </motion.div>
                            <motion.div 
                                className="absolute bottom-[25%] left-[18%] text-xs text-primary/40 font-mono"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 2.1, duration: 0.7 }}
                            >
                                NET.ACCESS.443.SECURE
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>
        );
    }

    // This part won't render because we redirect to chat directly
    return null;
}