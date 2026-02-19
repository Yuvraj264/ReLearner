import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert } from 'lucide-react';

interface RiskIndexProps {
    riskScore: number; // 0 (Safe) to 100 (Critical)
}

const RiskIndex: React.FC<RiskIndexProps> = ({ riskScore }) => {
    // Map risk score to rotation: -90deg (Safe) to 90deg (Critical)
    const rotation = -90 + (riskScore / 100) * 180;

    const statusLabel = riskScore < 30 ? 'Stable' : riskScore < 60 ? 'Moderate' : 'Critical';
    const statusColor = riskScore < 30 ? 'text-healthy' : riskScore < 60 ? 'text-warning' : 'text-critical';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6 relative overflow-hidden flex flex-col justify-between min-h-[220px]"
        >
            <div className="flex justify-between items-start z-10">
                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <ShieldAlert size={14} /> Risk Index
                </h3>
                <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-background/30 border border-white/5 ${statusColor}`}>
                    {statusLabel}
                </div>
            </div>

            <div className="relative flex-1 flex items-end justify-center pb-4 z-10">
                {/* Gauge Background */}
                <div className="w-48 h-24 overflow-hidden relative">
                    <div className="w-48 h-48 rounded-full border-[12px] border-muted/20 border-b-transparent border-r-transparent transform -rotate-45 absolute top-0 left-0"></div>

                    {/* Gradient Arc */}
                    <motion.div
                        className="w-48 h-48 rounded-full border-[12px] border-transparent border-t-healthy border-l-warning absolute top-0 left-0"
                        style={{
                            borderRightColor: 'transparent',
                            borderBottomColor: 'transparent',
                            background: 'conic-gradient(from 180deg, var(--healthy) 0%, var(--warning) 50%, var(--critical) 100%)',
                            maskImage: 'radial-gradient(transparent 60%, black 61%)',
                            WebkitMaskImage: 'radial-gradient(transparent 60%, black 61%)'
                        }}
                        initial={{ rotate: -135 }}
                        animate={{ rotate: -45 }} // Shows full 180 arc
                        transition={{ duration: 1.5, ease: "easeOut" }}
                    />

                    {/* Needle */}
                    <motion.div
                        className="absolute bottom-0 left-1/2 w-1 h-24 bg-foreground origin-bottom rounded-full z-20 shadow-lg"
                        initial={{ rotate: -90 }}
                        animate={{ rotate: rotation }}
                        transition={{ type: "spring", stiffness: 50, damping: 10, delay: 0.5 }}
                    >
                        <div className="w-4 h-4 rounded-full bg-foreground absolute -bottom-2 -left-1.5 border-2 border-background"></div>
                    </motion.div>
                </div>
            </div>

            <div className="text-center z-10">
                <div className="text-2xl font-bold text-foreground tabular-nums">{riskScore}/100</div>
                <p className="text-[10px] text-muted-foreground mt-1">Portfolio Decay Probability</p>
            </div>

            {/* Glow Effect */}
            <div className={`absolute -bottom-10 left-1/2 -translate-x-1/2 w-32 h-32 blur-[60px] opacity-20 pointer-events-none rounded-full ${riskScore > 50 ? 'bg-critical' : 'bg-healthy'}`}></div>
        </motion.div>
    );
};

export default RiskIndex;
