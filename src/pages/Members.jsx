import React, { useState, useEffect } from 'react';
import { getMembers } from '../services/api';

import {
    Users,
    Crown,
    ShieldCheck,
    Star,
    Instagram,
    Linkedin,
    Github,
    Loader2,
    AlertCircle,
    X,
    Palette,
    Monitor,
    Megaphone,
    Video,
    GraduationCap,
    Sparkles,
    ArrowRight,
    Orbit,
} from 'lucide-react';

import {
    motion,
    AnimatePresence,
    useMotionValue,
    useSpring,
} from 'framer-motion';

/* =========================================================
   ICONS
========================================================= */

const domainIcons = {
    "web dev": Monitor,
    "design": Palette,
    "marketing and pr": Megaphone,
    "video editing": Video,
    "mentoring": GraduationCap,
};

/* =========================================================
   IMAGE UTILS
========================================================= */

const placeholderUrl =
    "https://api.dicebear.com/7.x/avataaars/svg?seed=placeholder";

const getDirectImageUrl = (url) => {
    if (!url) return placeholderUrl;

    const driveRegex =
        /https:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)\/view/;

    const match = url.match(driveRegex);

    if (match && match[1]) {
        return `https://drive.google.com/uc?export=download&id=${match[1]}`;
    }

    return url;
};

/* =========================================================
   POSITION BADGE
========================================================= */

const PositionBadge = ({ position }) => {
    if (!position) return null;

    const normalized = position.toLowerCase();

    if (normalized.includes('ass')) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute top-4 right-4 z-20"
            >
                <div
                    className="
                        relative overflow-hidden
                        px-3 py-1.5 rounded-full
                        border border-cyan-400/30
                        bg-cyan-400/[0.08]
                        shadow-[0_0_20px_rgba(34,211,238,0.15)]
                        
                    "
                >
                    <motion.div
                        animate={{
                            x: ["-120%", "220%"]
                        }}
                        transition={{
                            repeat: Infinity,
                            duration: 3,
                            ease: "linear"
                        }}
                        className="
                            absolute top-0 left-0
                            h-full w-10
                            bg-gradient-to-r
                            from-transparent
                            via-white/20
                            to-transparent
                            rotate-12
                        "
                    />

                    <div className="relative z-10 flex items-center gap-2">
                        <Star
                            size={10}
                            className="text-cyan-300"
                        />

                        <span
                            className="
                                text-[10px]
                                font-bold
                                tracking-[0.22em]
                                text-cyan-200
                            "
                        >
                            ASST. LEAD
                        </span>
                    </div>
                </div>
            </motion.div>
        );
    }

    if (normalized.includes('lead')) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                    opacity: 1,
                    scale: 1
                }}
                transition={{
                    duration: 0.35
                }}
                className="absolute top-4 right-4 z-20"
            >
                <div
                    className="
                        relative overflow-hidden
                        px-3.5 py-1.5 rounded-full
                        border border-accent/40
                        bg-accent/[0.14]
                        shadow-[0_0_25px_rgba(0,255,170,0.22)]
                        
                    "
                >
                    <motion.div
                        animate={{
                            x: ["-120%", "220%"]
                        }}
                        transition={{
                            repeat: Infinity,
                            duration: 2.5,
                            ease: "linear"
                        }}
                        className="
                            absolute top-0 left-0
                            h-full w-12
                            bg-gradient-to-r
                            from-transparent
                            via-white/25
                            to-transparent
                            rotate-12
                        "
                    />

                    <div className="relative z-10 flex items-center gap-2">
                        <Crown
                            size={11}
                            className="text-accent"
                        />

                        <span
                            className="
                                text-[10px]
                                font-black
                                tracking-[0.25em]
                                text-accent
                            "
                        >
                            LEAD
                        </span>
                    </div>
                </div>
            </motion.div>
        );
    }

    return null;
};

/* =========================================================
   MEMBER CARD
========================================================= */

const MemberCard = ({
    person,
    index,
    special = false,
    executiveType = "executive"
}) => {

    const rotateX = useMotionValue(0);
    const rotateY = useMotionValue(0);

    const smoothRotateX = useSpring(rotateX, {
        stiffness: 220,
        damping: 20,
    });

    const smoothRotateY = useSpring(rotateY, {
        stiffness: 220,
        damping: 20,
    });

    const glowX = useMotionValue(50);
    const glowY = useMotionValue(50);

    const handleMouseMove = (e) => {
        const rect =
            e.currentTarget.getBoundingClientRect();

        const width = rect.width;
        const height = rect.height;

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = width / 2;
        const centerY = height / 2;

        const rotateXValue =
            ((y - centerY) / centerY) * -5;

        const rotateYValue =
            ((x - centerX) / centerX) * 5;

        rotateX.set(rotateXValue);
        rotateY.set(rotateYValue);

        glowX.set((x / width) * 100);
        glowY.set((y / height) * 100);
    };

    const handleMouseLeave = () => {
        rotateX.set(0);
        rotateY.set(0);

        glowX.set(50);
        glowY.set(50);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.5,
                delay: index * 0.05
            }}
            whileHover={{
                y: -8,
                scale: 1.02,
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX: smoothRotateX,
                rotateY: smoothRotateY,
                transformPerspective: 1200,
                transformStyle: "preserve-3d",
            }}
            className="
                group relative
                rounded-3xl
                p-[1px]
                will-change-transform
            "
        >

            {/* BORDER */}
            <div
                className={`
                    absolute inset-0 rounded-3xl
                    transition-all duration-500
                    ${
                        special
                            ? `
                            bg-gradient-to-br
                            from-accent/50
                            via-white/10
                            to-accent/10
                        `
                            : `
                            bg-gradient-to-br
                            from-white/10
                            via-white/[0.03]
                            to-accent/10
                        `
                    }
                `}
            />

            {/* CURSOR GLOW */}
            <motion.div
                className="
                    absolute inset-0 opacity-0
                    group-hover:opacity-100
                    transition-opacity duration-300
                    rounded-3xl
                "
                style={{
                    background: `
                        radial-gradient(
                            500px circle at
                            ${glowX.get()}%
                            ${glowY.get()}%,
                            rgba(0,255,170,0.10),
                            transparent 40%
                        )
                    `
                }}
            />

            {/* MAIN CARD */}
            <div
                className={`
                    relative z-10
                    rounded-3xl
                    h-full
                    overflow-hidden
                    ${
                        executiveType === "president" || executiveType === "vice"
                            ? "p-0"
                            : "p-6"
                    }
                    ${
                        special
                            ? `
                            bg-[#071510]/95
                            shadow-[0_0_70px_rgba(0,255,170,0.10)]
                        `
                            : `
                            bg-[#07110d]/92
                        `
                    }
                `}
                style={{
                    transform: "translateZ(40px)",
                    backfaceVisibility: "hidden",
                }}
            >

                {/* SPECIAL EXECUTIVE EFFECTS */}
                {special && (
  <>
    {/* animated prestige border */}
    <motion.div
      animate={{
        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
      }}
      transition={{
        duration: executiveType === "president" ? 8 : 12,
        repeat: Infinity,
        ease: "linear"
      }}
      className={`
        absolute inset-0 rounded-3xl
        opacity-100 pointer-events-none
        ${
          executiveType === "president"
            ? `
              bg-[linear-gradient(115deg,transparent_20%,rgba(255,215,0,0.35)_45%,transparent_70%)]
              bg-[length:250%_250%]
            `
            : `
              bg-[linear-gradient(115deg,transparent_20%,rgba(173,216,230,0.25)_45%,transparent_70%)]
              bg-[length:250%_250%]
            `
        }
      `}
      style={{
        padding: "1px",
        WebkitMask:
          "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
        WebkitMaskComposite: "xor",
        maskComposite: "exclude",
      }}
    />

    {/* corner crests */}
    <div
      className={`
        absolute top-0 left-0
        w-24 h-24
        rounded-br-[32px]
        border-l border-t
        ${
          executiveType === "president"
            ? "border-yellow-400/40"
            : "border-cyan-300/30"
        }
      `}
    />

    <div
      className={`
        absolute bottom-0 right-0
        w-24 h-24
        rounded-tl-[32px]
        border-r border-b
        ${
          executiveType === "president"
            ? "border-yellow-400/40"
            : "border-cyan-300/30"
        }
      `}
    />

    {/* authority badge pulse */}
    
  </>
)}


                <PositionBadge position={person.position} />

                {executiveType === "president" || executiveType === "vice" ? (
                    <div className="relative z-10 flex flex-col sm:flex-row h-full w-full min-h-[220px]">
                        {/* IMAGE SIDE */}
                        <div className="relative w-full sm:w-[42%] h-64 sm:h-auto overflow-hidden">
                            <img
                                src={getDirectImageUrl(person.photoUrl)}
                                alt={person.name}
                                draggable={false}
                                className="w-full h-full object-cover select-none pointer-events-none"
                                style={{
                                    backfaceVisibility: "hidden",
                                    transform: "translateZ(0)",
                                }}
                            />
                            {/* Overlay gradient to fade the image towards the details side / bottom */}
                            <div className="absolute inset-0 sm:bg-gradient-to-r from-transparent to-[#040c0a37]" />
                        </div>

                        {/* DETAILS SIDE */}
                        <div className="flex-1 flex flex-col justify-center p-6 sm:p-8 z-10 relative">
                            {/* <span className="text-[10px] font-mono tracking-[0.25em] text-accent mb-2 uppercase">
                                {executiveType === "president" ? "President" : "Vice President"}
                            </span> */}
                            <h4
                                className="text-2xl font-bold text-white tracking-tight mb-3"
                                style={{
                                    transform: "translateZ(40px)"
                                }}
                            >
                                {person.name}
                            </h4>

                            <div
                                className="flex items-center gap-4 mt-2"
                                style={{
                                    transform: "translateZ(45px)"
                                }}
                            >
                                {person.instagram && (
                                    <a
                                        href={person.instagram}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-white/40 hover:text-accent transition-colors"
                                    >
                                        <Instagram size={18} />
                                    </a>
                                )}

                                {person.linkedin && (
                                    <a
                                        href={person.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-white/40 hover:text-accent transition-colors"
                                    >
                                        <Linkedin size={18} />
                                    </a>
                                )}

                                {person.github && (
                                    <a
                                        href={person.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-white/40 hover:text-accent transition-colors"
                                    >
                                        <Github size={18} />
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="relative z-10 flex flex-col items-center text-center">


                        {/* IMAGE */}
                        <div
                            className={`
                                relative
                                w-32 h-32 rounded-full
                                overflow-hidden
                                mb-5
                                ${
                                    special
                                        ? `
                                        border-2 border-accent/40
                                        shadow-[0_0_40px_rgba(0,255,170,0.15)]
                                    `
                                        : `
                                        border border-accent/20
                                    `
                                }
                            `}
                            style={{
                                transform: "translateZ(60px)",
                            }}
                        >

                            {/* EXECUTIVE RING */}
                            {special && (
                                <motion.div
                                    animate={{
                                        rotate: 360
                                    }}
                                    transition={{
                                        repeat: Infinity,
                                        duration: 12,
                                        ease: "linear"
                                    }}
                                    className="
                                        absolute inset-[-6px]
                                        rounded-full
                                        border border-dashed
                                        border-accent/30
                                    "
                                />
                            )}

                            <img
                                src={getDirectImageUrl(person.photoUrl)}
                                alt={person.name}
                                draggable={false}
                                className="
                                    w-full h-full object-cover
                                    select-none
                                    pointer-events-none
                                "
                                style={{
                                    backfaceVisibility: "hidden",
                                    transform: "translateZ(0)",
                                }}
                            />
                        </div>

                        <h4
                            className="
                                text-xl font-bold
                                text-white
                                tracking-tight
                                mb-2
                            "
                            style={{
                                transform: "translateZ(40px)"
                            }}
                        >
                            {person.name}
                        </h4>

                        {/* {person.rollNo && (
                            <p
                                className="
                                    text-sm text-white/40 mb-5
                                "
                                style={{
                                    transform: "translateZ(30px)"
                                }}
                            >
                                {person.rollNo}
                            </p>
                        )} */}

                        <div
                            className="flex items-center gap-4"
                            style={{
                                transform: "translateZ(45px)"
                            }}
                        >
                            {person.instagram && (
                                <a
                                    href={person.instagram}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="
                                        text-white/40
                                        hover:text-accent
                                        transition-colors
                                    "
                                >
                                    <Instagram size={18} />
                                </a>
                            )}

                            {person.linkedin && (
                                <a
                                    href={person.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="
                                        text-white/40
                                        hover:text-accent
                                        transition-colors
                                    "
                                >
                                    <Linkedin size={18} />
                                </a>
                            )}

                            {person.github && (
                                <a
                                    href={person.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="
                                        text-white/40
                                        hover:text-accent
                                        transition-colors
                                    "
                                >
                                    <Github size={18} />
                                </a>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

/* =========================================================
   DOMAIN CARD
========================================================= */

const DomainCard = ({
    domain,
    onOpen,
    index
}) => {

    const Icon =
        domainIcons[domain.toLowerCase()] || Orbit;

    const rotateX = useMotionValue(0);
    const rotateY = useMotionValue(0);

    const smoothRotateX = useSpring(rotateX, {
        stiffness: 180,
        damping: 14
    });

    const smoothRotateY = useSpring(rotateY, {
        stiffness: 180,
        damping: 14
    });

    const glowX = useMotionValue(50);
    const glowY = useMotionValue(50);

    const handleMouseMove = (e) => {
        const rect =
            e.currentTarget.getBoundingClientRect();

        const width = rect.width;
        const height = rect.height;

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        rotateX.set(
            ((y - height / 2) / height) * -10
        );

        rotateY.set(
            ((x - width / 2) / width) * 10
        );

        glowX.set((x / width) * 100);
        glowY.set((y / height) * 100);
    };

    const handleMouseLeave = () => {
        rotateX.set(0);
        rotateY.set(0);
    };

    return (
        <motion.button
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
                duration: 0.45,
                delay: index * 0.05,
            }}
            whileHover={{
                y: -10,
                scale: 1.02,
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={onOpen}
            style={{
                rotateX: smoothRotateX,
                rotateY: smoothRotateY,
                transformPerspective: 1000,
                transformStyle: "preserve-3d",
            }}
            className="
                group relative overflow-hidden
                rounded-[30px]
                border border-white/10
                bg-[#04130f]
                p-6
                min-h-[220px]
                text-left
                transition-all duration-500
                hover:border-accent/30
            "
        >

            {/* GRID */}
            <div
                className="
                    absolute inset-0 opacity-[0.03]
                    bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)]
                    bg-[size:26px_26px]
                "
            />

            {/* GLOW */}
            <motion.div
                className="
                    absolute inset-0 opacity-0
                    group-hover:opacity-100
                    transition-opacity duration-300
                "
                style={{
                    background: `
                        radial-gradient(
                            500px circle at
                            ${glowX.get()}%
                            ${glowY.get()}%,
                            rgba(0,255,170,0.10),
                            transparent 40%
                        )
                    `
                }}
            />

            {/* TOP LIGHT */}
            <div
                className="
                    absolute top-0 left-0 right-0
                    h-px
                    bg-gradient-to-r
                    from-transparent
                    via-accent/40
                    to-transparent
                    opacity-0
                    group-hover:opacity-100
                    transition-opacity duration-500
                "
            />

            <div
                className="
                    relative z-10
                    h-full
                    flex flex-col
                "
            >

                {/* ICON */}
                <motion.div
                    whileHover={{
                        rotate: 8,
                        scale: 1.08,
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 10,
                    }}
                    className="
                        w-14 h-14 rounded-2xl
                        border border-accent/20
                        bg-accent/[0.05]
                        flex items-center justify-center
                        mb-8
                    "
                    style={{
                        transform: "translateZ(40px)"
                    }}
                >
                    <Icon
                        size={24}
                        className="text-accent"
                    />
                </motion.div>

                <div className="flex-1">

                    <p
                        className="
                            text-[10px]
                            uppercase
                            tracking-[0.35em]
                            text-accent/50
                            mb-4
                        "
                    >
                        DOMAIN
                    </p>

                    <h3
                        className="
                            text-[2.2rem]
                            leading-[0.95]
                            font-black
                            tracking-tight
                            text-white
                            capitalize
                            max-w-[90%]
                        "
                        style={{
                            transform: "translateZ(50px)"
                        }}
                    >
                        {domain}
                    </h3>
                </div>

                <div
                    className="
                        pt-8 flex items-center
                        justify-between
                    "
                >
                    <div
                        className="
                            px-4 py-2 rounded-full
                            border border-accent/20
                            bg-accent/[0.04]
                            text-[11px]
                            tracking-[0.25em]
                            uppercase
                            text-accent/70
                        "
                    >
                        Explore
                    </div>

                    <motion.div
                        whileHover={{
                            x: 5
                        }}
                    >
                        <ArrowRight
                            size={20}
                            className="text-accent"
                        />
                    </motion.div>
                </div>
            </div>
        </motion.button>
    );
};
/* =========================================================
   DOMAIN MODAL
========================================================= */

const DomainModal = ({
    domain,
    members,
    isOpen,
    onClose
}) => {

    const sortedMembers = [...members].sort((a, b) => {

        const getPriority = (pos) => {
            const p = (pos || '').toLowerCase();

            if (
                p.includes('lead') &&
                !p.includes('ass')
            ) return 0;

            if (p.includes('ass'))
                return 1;

            return 2;
        };

        return (
            getPriority(a.position) -
            getPriority(b.position)
        );
    });

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="
                        fixed inset-0 z-50
                        flex items-center justify-center
                        p-4 bg-black/80
                        backdrop-blur-md
                    "
                >

                    {/* BACKDROP */}
                    <motion.div
                        initial={{
                            opacity: 0,
                            scale: 0.96,
                            y: 20
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            y: 0
                        }}
                        exit={{
                            opacity: 0,
                            scale: 0.96,
                            y: 20
                        }}
                        transition={{
                            type: "spring",
                            stiffness: 260,
                            damping: 24
                        }}
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                        className="
                            relative overflow-hidden
                            bg-[#04110d]/95
                            border border-white/10 
                            rounded-[34px]
                            max-w-6xl
                            max-h-[90vh]
                            overflow-y-auto
                            w-full
                            shadow-[0_0_100px_rgba(0,255,170,0.08)]
                        "
                    >

                        {/* GRID BG */}
                        <div
                            className="
                                absolute inset-0 opacity-[0.03]
                                bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)]
                                bg-[size:30px_30px]
                            "
                        />

                        {/* GLOW */}
                        <div
                            className="
                                absolute -top-32 -right-32
                                w-96 h-96 rounded-full
                                bg-accent/[0.1]
                                blur-3xl
                            "
                        />

                        {/* HEADER */}
                        <div
                            className="
                                sticky top-0 z-50
                                flex items-center justify-between
                                px-8 py-9
                                border-b border-white/10
                                bg-[#04110d]/85
                                
                            "
                        >

                            <div>
                                <p
                                    className="
                                        text-[10px]
                                        uppercase
                                        tracking-[0.35em]
                                        text-accent/60
                                        mb-3
                                    "
                                >
                                    Domain Team
                                </p>

                                <h2
                                    className="
                                        text-4xl font-black
                                        text-white capitalize
                                        tracking-tight
                                    "
                                >
                                    {domain}
                                </h2>
                            </div>

                            <button
                                onClick={onClose}
                                className="
                                    w-12 h-12 rounded-2xl
                                    border border-white/10
                                    bg-white/[0.03]
                                    flex items-center justify-center
                                    text-white/60
                                    hover:text-accent
                                    hover:border-accent/30
                                    transition-all duration-300
                                "
                            >
                                <X size={22} />
                            </button>
                        </div>

                        {/* MEMBERS */}
                        <div
                            className="
                                relative z-10
                                p-8
                                grid grid-cols-1
                                md:grid-cols-2
                                lg:grid-cols-3
                                gap-6
                            "
                        >
                            {sortedMembers.map(
                                (person, index) => (
                                    <MemberCard
                                        key={
                                            person.id ||
                                            person.rollNo ||
                                            index
                                        }
                                        person={person}
                                        index={index}
                                    />
                                )
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

/* =========================================================
   MAIN PAGE
========================================================= */

const Members = () => {

    const [members, setMembers] =
        useState({});

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState(null);

    const [selectedDomain, setSelectedDomain] =
        useState(null);

    useEffect(() => {

        const fetchMembers = async () => {

            try {

                const response =
                    await getMembers();

                const fetchedData =
                    response.data;

                const normalizedData = {};

                for (const key in fetchedData) {

                    const normKey = key
                        .toLowerCase()
                        .replace('-', ' ');

                    normalizedData[normKey] =
                        fetchedData[key] || [];
                }

                setMembers(normalizedData);

            } catch (err) {

                console.error(err);

                setError(
                    "Unable to sync with database."
                );

            } finally {

                setLoading(false);
            }
        };

        fetchMembers();

    }, []);

    /* =========================
       LOADING
    ========================= */

    if (loading) {

        return (
            <div
                className="
                    min-h-screen
                    flex items-center
                    justify-center
                    bg-background
                "
            >
                <div className="relative">

                    <motion.div
                        animate={{
                            rotate: 360
                        }}
                        transition={{
                            repeat: Infinity,
                            duration: 1.5,
                            ease: "linear"
                        }}
                    >
                        <Loader2
                            size={42}
                            className="text-accent"
                        />
                    </motion.div>

                    <div
                        className="
                            absolute inset-0
                            blur-2xl
                            bg-accent/20
                        "
                    />
                </div>
            </div>
        );
    }

    /* =========================
       ERROR
    ========================= */

    if (error) {

        return (
            <div
                className="
                    min-h-screen
                    flex items-center
                    justify-center
                    p-6
                "
            >
                <div
                    className="
                        relative overflow-hidden
                        p-10 rounded-[32px]
                        border border-red-500/20
                        bg-red-500/[0.04]
                        text-center
                        max-w-md w-full
                    "
                >

                    <div
                        className="
                            absolute -top-16 -right-16
                            w-48 h-48 rounded-full
                            bg-red-500/10 blur-3xl
                        "
                    />

                    <AlertCircle
                        size={52}
                        className="
                            text-red-400
                            mx-auto mb-5
                        "
                    />

                    <h3
                        className="
                            text-white
                            text-2xl
                            font-bold
                            mb-2
                        "
                    >
                        Sync Error
                    </h3>

                    <p className="text-white/50">
                        {error}
                    </p>
                </div>
            </div>
        );
    }

    /* =========================
       FILTER DOMAINS
    ========================= */

    const otherDomains =
        Object.entries(members)
            .filter(
                ([domain]) =>
                    domain !== 'president' &&
                    domain !== 'vice president'
            )
            .sort(([domainA], [domainB]) => {
                // Mentoring comes first
                if (domainA.toLowerCase() === 'mentoring') return -1;
                if (domainB.toLowerCase() === 'mentoring') return 1;
                // Rest in alphabetical order
                return domainA.localeCompare(domainB);
            });

    /* =========================
       PAGE
    ========================= */

    return (
        <div
            className="
                min-h-screen
                pt-32 pb-40 px-6
                relative overflow-hidden
            "
        >

            {/* BACKGROUND */}
            <div
                className="
                    absolute inset-0
                    bg-[radial-gradient(circle_at_top,rgba(0,255,170,0.06),transparent_35%)]
                "
            />

            <div
                className="
                    absolute inset-0 opacity-[0.03]
                    bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)]
                    bg-[size:32px_32px]
                "
            />

            <div className="max-w-7xl mx-auto relative z-10">

                {/* HERO */}
                <section className="mb-28 text-center">

                    <motion.div
                        initial={{
                            opacity: 0,
                            y: 20
                        }}
                        animate={{
                            opacity: 1,
                            y: 0
                        }}
                        transition={{
                            duration: 0.6
                        }}
                    >

                        <p
                            className="
                                text-[15px]
                                uppercase
                                tracking-[0.45em]
                                text-accent/60
                                mb-6
                                font-display
                            "
                        >
                            CORE TEAM
                        </p>

                        <h1 className="text-4xl sm:text-6xl md:text-8xl font-display font-bold tracking-tighter mb-8 bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent uppercase">

                            MEMBERS
                        </h1>

                        <p
                            className="
                                max-w-2xl mx-auto
                                text-white/45
                                text-lg
                                leading-relaxed
                            "
                        >
                            Builders, designers, mentors,
                            developers and creators driving
                            the ecosystem forward.
                        </p>
                    </motion.div>
                </section>

                {/* PRESIDENT */}
                <section className="mb-24">

                    <div
                        className="
                            flex items-center
                            gap-4 mb-12
                        "
                    >

                        <div
                            className="
                                h-px flex-1
                                bg-gradient-to-r
                                from-transparent
                                via-accent/20
                                to-transparent
                            "
                        />

                        <h3
                            className="
                                flex items-center gap-3
                                text-accent
                                font-mono text-sm
                                tracking-[0.3em]
                                uppercase
                            "
                        >
                            <Crown size={20} />
                            President
                        </h3>

                        <div
                            className="
                                h-px flex-1
                                bg-gradient-to-r
                                from-transparent
                                via-accent/20
                                to-transparent
                            "
                        />
                    </div>

                    <div
                        className="
                            grid grid-cols-1
                            md:grid-cols-2
                            gap-8
                            max-w-5xl mx-auto
                        "
                    >
                        {(members.president || []).map(
                            (person, i) => (
                                <MemberCard
                                    key={person.id || i}
                                    person={person}
                                    index={i}
                                    special={true}
                                    executiveType="president"
                                />
                            )
                        )}
                    </div>
                </section>

                {/* VP */}
                <section className="mb-32">

                    <div
                        className="
                            flex items-center
                            gap-4 mb-12
                        "
                    >

                        <div
                            className="
                                h-px flex-1
                                bg-gradient-to-r
                                from-transparent
                                via-accent/20
                                to-transparent
                            "
                        />

                        <h3
                            className="
                                flex items-center gap-3
                                text-accent
                                font-mono text-sm
                                tracking-[0.3em]
                                uppercase
                            "
                        >
                            <ShieldCheck size={20} />
                            Vice President
                        </h3>

                        <div
                            className="
                                h-px flex-1
                                bg-gradient-to-r
                                from-transparent
                                via-accent/20
                                to-transparent
                            "
                        />
                    </div>

                    <div
                        className="
                            grid grid-cols-1
                            md:grid-cols-2
                            gap-8
                            max-w-5xl mx-auto
                        "
                    >
                        {(members['vice president'] || [])
                            .map((person, i) => (
                                <MemberCard
                                    key={person.id || i}
                                    person={person}
                                    index={i}
                                    special={true}
                                    executiveType="vice"
                                />
                            ))}
                    </div>
                </section>

                {/* DOMAINS */}
                <section>

                    <div className="mb-14">


                        <h2
                            className="
                                text-4xl md:text-5xl
                                font-black
                                text-white
                                tracking-tight
                            "
                        >
                            Explore Domains
                        </h2>
                    </div>

                    <div className="flex flex-col gap-6">
                        {/* First Row - 3 cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {otherDomains.slice(0, 3).map(
                                (
                                    [domain, domainMembers],
                                    index
                                ) => (
                                    <DomainCard
                                        key={domain}
                                        domain={domain}
                                        index={index}
                                        onOpen={() =>
                                            setSelectedDomain({
                                                domain,
                                                members:
                                                    domainMembers
                                            })
                                        }
                                    />
                                )
                            )}
                        </div>

                        {/* Second Row - 2 cards centered */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:max-w-2xl lg:mx-auto lg:w-full">
                            {otherDomains.slice(3).map(
                                (
                                    [domain, domainMembers],
                                    index
                                ) => (
                                    <DomainCard
                                        key={domain}
                                        domain={domain}
                                        index={index + 3}
                                        onOpen={() =>
                                            setSelectedDomain({
                                                domain,
                                                members:
                                                    domainMembers
                                            })
                                        }
                                    />
                                )
                            )}
                        </div>
                    </div>
                </section>
            </div>

            {/* MODAL */}
            {selectedDomain && (
                <DomainModal
                    domain={selectedDomain.domain}
                    members={selectedDomain.members}
                    isOpen={true}
                    onClose={() =>
                        setSelectedDomain(null)
                    }
                />
            )}
        </div>
    );
};

export default Members;