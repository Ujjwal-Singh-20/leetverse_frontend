import React, { useMemo, useRef, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PerspectiveCamera, Environment, ContactShadows, OrbitControls, Preload, Html, Center, Line } from '@react-three/drei';
import * as THREE from 'three';

// Deterministic random generator
function mulberry32(a) {
    return function () {
        var t = a += 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}

const Loader = () => (
    <Html center>
        <div className="flex flex-col items-center justify-center">
            <div className="w-8 h-8 border-2 border-accent/20 border-t-accent rounded-full animate-spin mb-2" />
            <p className="text-[8px] font-mono text-accent uppercase tracking-[0.3em] animate-pulse">Compiling_Structure...</p>
        </div>
    </Html>
);

const InteractiveNode = ({ position, rotation = [0, 0, 0], colors, type, size }) => {
    const meshRef = useRef();
    const [hovered, setHovered] = useState(false);
    const [jumpAnim, setJumpAnim] = useState(0);

    const s = Array.isArray(size) ? size : [size, size, size];

    useFrame((state, delta) => {
        if (!meshRef.current) return;

        if (hovered && jumpAnim < 1) {
            setJumpAnim(Math.min(1, jumpAnim + delta * 8));
        } else if (!hovered && jumpAnim > 0) {
            setJumpAnim(Math.max(0, jumpAnim - delta * 5));
        }

        const bounce = Math.sin(jumpAnim * Math.PI) * 0.3;
        meshRef.current.position.y = position[1] + bounce;

        const scaleMult = 1 + jumpAnim * 0.2;
        meshRef.current.scale.set(s[0] * scaleMult, s[1] * scaleMult, s[2] * scaleMult);
    });

    const isBox = type === 'box';

    return (
        <mesh
            ref={meshRef}
            position={position}
            rotation={rotation}
            onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
            onPointerOut={() => setHovered(false)}
        >
            {isBox ? <boxGeometry args={[1, 1, 1]} /> : <sphereGeometry args={[1, 32, 32]} />}

            <meshPhysicalMaterial
                color={hovered ? colors.neon : colors.glass}
                emissive={hovered ? colors.neon : colors.glass}
                emissiveIntensity={hovered ? 2 : 0.8}
                transmission={0.9}
                opacity={1}
                metalness={0.2}
                roughness={0.1}
                ior={1.5}
                thickness={0.5}
                transparent
            />
        </mesh>
    );
};

const BinaryTree = ({ random, colors }) => {
    const { nodes, edges } = useMemo(() => {
        const n = [];
        const e = [];
        const maxDepth = 3 + Math.floor(random() * 2);

        const generate = (x, y, depth, currentDepth) => {
            if (currentDepth > maxDepth) return null;
            if (currentDepth > 1 && random() > 0.85) return null; // Sporadic missing nodes

            const node = { position: [x, y, 0] };
            n.push(node);

            const spread = 2.5 / currentDepth;
            const yOffset = -1.5;

            const leftNode = generate(x - spread, y + yOffset, depth, currentDepth + 1);
            if (leftNode) e.push({ start: [x, y, 0], end: leftNode.position });

            const rightNode = generate(x + spread, y + yOffset, depth, currentDepth + 1);
            if (rightNode) e.push({ start: [x, y, 0], end: rightNode.position });

            return node;
        };

        generate(0, Math.max(1.5, maxDepth * 0.5), maxDepth, 1);
        return { nodes: n, edges: e };
    }, [random]);

    return (
        <Center>
            <group>
                {edges.map((edge, i) => (
                    <Line key={`edge-${i}`} points={[edge.start, edge.end]} color={colors.metal} lineWidth={3} transparent opacity={0.6} />
                ))}
                {nodes.map((node, i) => (
                    <InteractiveNode key={`node-${i}`} position={node.position} colors={colors} type="sphere" size={0.35} />
                ))}
            </group>
        </Center>
    );
};

const LinkedList = ({ random, colors }) => {
    const { nodes, edges } = useMemo(() => {
        const isCircular = random() > 0.5;
        const length = 5 + Math.floor(random() * 4);
        const n = [];
        const e = [];

        if (isCircular) {
            const radius = 2 + random() * 1;
            for (let i = 0; i < length; i++) {
                const angle = (i / length) * Math.PI * 2;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                n.push({ position: [x, y, 0], rotation: [0, 0, angle] });

                const nextAngle = ((i + 1) % length) / length * Math.PI * 2;
                e.push({ start: [x, y, 0], end: [Math.cos(nextAngle) * radius, Math.sin(nextAngle) * radius, 0] });
            }
        } else {
            const spacing = 1.4;
            const startX = -((length - 1) * spacing) / 2;
            for (let i = 0; i < length; i++) {
                const x = startX + i * spacing;
                const y = Math.sin(i * 0.8) * 0.5; // slight wave
                n.push({ position: [x, y, 0], rotation: [0, 0, 0] });
                if (i < length - 1) {
                    const nextX = startX + (i + 1) * spacing;
                    const nextY = Math.sin((i + 1) * 0.8) * 0.5;
                    e.push({ start: [x, y, 0], end: [nextX, nextY, 0] });
                }
            }
        }
        return { nodes: n, edges: e };
    }, [random]);

    return (
        <Center>
            <group>
                {edges.map((edge, i) => (
                    <Line key={`edge-${i}`} points={[edge.start, edge.end]} color={colors.metal} lineWidth={4} transparent opacity={0.8} />
                ))}
                {nodes.map((node, i) => (
                    <InteractiveNode key={`node-${i}`} position={node.position} rotation={node.rotation} colors={colors} type="box" size={0.6} />
                ))}
            </group>
        </Center>
    );
};

const CodeGlyph = ({ random, colors }) => {
    const glyphCode = useMemo(() => {
        const glyphs = ['braces', 'brackets', 'angles'];
        return glyphs[Math.floor(random() * glyphs.length)];
    }, [random]);

    const renderBracket = (side) => {
        const sign = side === 'left' ? -1 : 1;
        const xOffset = sign * 1.5;
        const height = 3.5;
        const width = 1.8;
        const t = 0.45; // thickness

        if (glyphCode === 'brackets') {
            return (
                <group position={[xOffset, 0, 0]}>
                    <InteractiveNode position={[0, height / 2, 0]} colors={colors} type="box" size={[width, t, t]} />
                    <InteractiveNode position={[sign * (width / 2 - t / 2), 0, 0]} colors={colors} type="box" size={[t, height, t]} />
                    <InteractiveNode position={[0, -height / 2, 0]} colors={colors} type="box" size={[width, t, t]} />
                </group>
            );
        } else if (glyphCode === 'angles') {
            return (
                <group position={[xOffset, 0, 0]}>
                    <InteractiveNode position={[(sign * width) / 4, height / 4, 0]} rotation={[0, 0, sign * Math.PI / 4]} colors={colors} type="box" size={[width * 1.5, t, t]} />
                    <InteractiveNode position={[(sign * width) / 4, -height / 4, 0]} rotation={[0, 0, -sign * Math.PI / 4]} colors={colors} type="box" size={[width * 1.5, t, t]} />
                </group>
            );
        } else {
            // braces {}
            return (
                <group position={[xOffset, 0, 0]}>
                    <InteractiveNode position={[sign * width / 4, height / 2, 0]} colors={colors} type="box" size={[width / 2, t, t]} />
                    <InteractiveNode position={[sign * width / 2, height / 4, 0]} colors={colors} type="box" size={[t, height / 2, t]} />
                    <InteractiveNode position={[sign * width / 4, 0, 0]} colors={colors} type="box" size={[width / 2, t, t]} />
                    <InteractiveNode position={[sign * width / 2, -height / 4, 0]} colors={colors} type="box" size={[t, height / 2, t]} />
                    <InteractiveNode position={[sign * width / 4, -height / 2, 0]} colors={colors} type="box" size={[width / 2, t, t]} />
                </group>
            );
        }
    };

    return (
        <Center>
            <group scale={0.75}>
                {renderBracket('left')}
                {renderBracket('right')}
                <InteractiveNode position={[0, 0, 0]} colors={colors} type="sphere" size={0.7} />
            </group>
        </Center>
    );
};

const DsaSculpture = ({ seed }) => {
    const groupRef = useRef();

    const config = useMemo(() => {
        let numericSeed = 0;
        const seedStr = String(seed);
        for (let i = 0; i < seedStr.length; i++) {
            numericSeed = ((numericSeed << 5) - numericSeed) + seedStr.charCodeAt(i);
            numericSeed |= 0;
        }

        const hash = Math.abs(numericSeed);
        const random = mulberry32(hash);

        const palettes = [
            { glass: '#2C0076', neon: '#00FF9D', metal: '#8A4FFF', name: 'Cosmic-Pulse' },
            { glass: '#001A33', neon: '#00E5FF', metal: '#4D99FF', name: 'Deep-Void' },
            { glass: '#4D0000', neon: '#FF0055', metal: '#FF6666', name: 'Solar-Flare' },
            { glass: '#003311', neon: '#FFFF00', metal: '#33FF66', name: 'Bio-Static' }
        ];
        const colors = palettes[hash % palettes.length];

        const archetypes = ['Tree', 'List', 'Glyph'];
        const archetype = archetypes[hash % archetypes.length];

        return { random, colors, archetype };
    }, [seed]);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (groupRef.current) {
            groupRef.current.rotation.y = t * 0.15;
            // groupRef.current.position.y = Math.sin(t) * 0.1; // Handled by Float wrapper now
        }
    });

    return (
        <group ref={groupRef}>
            {config.archetype === 'Tree' && <BinaryTree random={config.random} colors={config.colors} />}
            {config.archetype === 'List' && <LinkedList random={config.random} colors={config.colors} />}
            {config.archetype === 'Glyph' && <CodeGlyph random={config.random} colors={config.colors} />}
        </group>
    );
};

const UserAvatar = ({ seed }) => {
    return (
        <div className="w-full h-full min-h-[350px] relative cursor-pointer active:cursor-grabbing group">
            <Canvas dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
                <Suspense fallback={<Loader />}>
                    <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={38} />

                    <OrbitControls
                        enableZoom={false}
                        enablePan={false}
                        minPolarAngle={Math.PI / 4}
                        maxPolarAngle={Math.PI / 1.5}
                        rotateSpeed={0.5}
                        makeDefault
                    />

                    <ambientLight intensity={0.5} />
                    <directionalLight position={[10, 10, 5]} intensity={2} color="#ffffff" />
                    <pointLight position={[-10, -10, -10]} intensity={1.5} color="#aaaaaa" />

                    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
                        <DsaSculpture seed={seed} />
                    </Float>

                    <ContactShadows
                        position={[0, -3.5, 0]}
                        opacity={0.4}
                        scale={15}
                        blur={3}
                        far={5}
                        resolution={256}
                    />

                    <Environment preset="night" />
                    <Preload all />
                </Suspense>
            </Canvas>

            {/* Atmospheric Overlay */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.5)_100%)] opacity-40" />

            <div className="absolute top-4 left-6 pointer-events-none opacity-20 group-hover:opacity-60 transition-opacity">
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse shadow-[0_0_10px_#00ff9d]" />
                    <span className="text-[8px] font-mono text-white/40 tracking-[0.4em] uppercase">Algorithm_Compiled</span>
                </div>
            </div>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-none opacity-10 group-hover:opacity-40 transition-opacity whitespace-nowrap">
                <p className="text-[7px] font-mono text-white tracking-[0.6em] uppercase text-center font-bold">
                    SEEDED_DSA_SCULPTURE
                </p>
            </div>
        </div>
    );
};

export default UserAvatar;
