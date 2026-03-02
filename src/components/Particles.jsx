import { motion } from 'framer-motion';

const Particles = () => {
    const particles = Array.from({ length: 20 });

    return (
        <div className="fixed inset-0 pointer-events-none z-0">
            {particles.map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-[2px] h-[2px] bg-accent rounded-full shadow-[0_0_12px_rgba(0,255,157,0.8)]"
                    initial={{
                        x: Math.random() * 100 + "%",
                        y: Math.random() * 100 + "%",
                        opacity: Math.random() * 0.8,
                        scale: Math.random() * 1 + 0.5,
                    }}
                    animate={{
                        y: ["0%", "100%", "0%"],
                        opacity: [0.2, 0.9, 0.2],
                    }}
                    transition={{
                        duration: Math.random() * 15 + 15,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                />
            ))}
        </div>
    );
};

export default Particles;
