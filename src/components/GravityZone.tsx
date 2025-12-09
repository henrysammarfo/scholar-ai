"use client";

import { useEffect, useRef, useState, useCallback, useContext } from "react";
import Matter from "matter-js";
import { PhysicsContext } from "./PhysicsContext";

export function GravityZone({ children }: { children: React.ReactNode }) {
    const sceneRef = useRef<HTMLDivElement>(null);
    const engineRef = useRef<Matter.Engine | null>(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        if (!sceneRef.current) return;

        // Setup Engine
        const Engine = Matter.Engine,
            Runner = Matter.Runner,
            MouseConstraint = Matter.MouseConstraint,
            Mouse = Matter.Mouse,
            World = Matter.World,
            Bodies = Matter.Bodies;

        const engine = Engine.create();
        engineRef.current = engine;

        // Set standard earth gravity
        engine.world.gravity.y = 1;

        // Boundaries
        const width = window.innerWidth;
        const height = window.innerHeight;
        const wallOptions = { isStatic: true, render: { visible: false } };

        const ground = Bodies.rectangle(width / 2, height + 50, width, 100, wallOptions);
        const ceiling = Bodies.rectangle(width / 2, -500, width, 100, wallOptions); // High ceiling to drop items in
        const leftWall = Bodies.rectangle(-50, height / 2, 100, height * 2, wallOptions);
        const rightWall = Bodies.rectangle(width + 50, height / 2, 100, height * 2, wallOptions);

        World.add(engine.world, [ground, ceiling, leftWall, rightWall]);

        // Mouse Interaction
        const mouse = Mouse.create(sceneRef.current);
        const mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.1, // Softer drag
                render: { visible: false }
            }
        });

        // Fix mouse offset for scrolling/relative positioning if needed, 
        // but fixed position overlay usually doesn't need it.
        // mouse.pixelRatio = window.devicePixelRatio;

        World.add(engine.world, mouseConstraint);

        // Run
        const runner = Runner.create();
        Runner.run(runner, engine);
        setReady(true);

        return () => {
            Runner.stop(runner);
            Engine.clear(engine);
        };
    }, []);

    return (
        <PhysicsContext.Provider value={{ engine: engineRef.current || null }}>
            <div ref={sceneRef} className="absolute inset-0 overflow-hidden z-0 bg-transparent pointer-events-none">
                {ready && children}
            </div>
        </PhysicsContext.Provider>
    );
}

interface PhysicsItemProps {
    children: React.ReactNode;
    id: string;
    x: number;
    y: number;
    width?: number; // Estimated, or we can measure ref
    height?: number;
    className?: string;
    isStatic?: boolean;
}

export function PhysicsItem({ children, id, x, y, width = 200, height = 100, className = "", isStatic = false }: PhysicsItemProps) {
    const { engine } = useContext(PhysicsContext);
    const bodyRef = useRef<Matter.Body | null>(null);
    const elementRef = useRef<HTMLDivElement>(null);
    const [pos, setPos] = useState({ x, y, angle: 0 });

    useEffect(() => {
        if (!engine || bodyRef.current) return;

        // Create Body
        const body = Matter.Bodies.rectangle(x, y, width, height, {
            isStatic,
            chamfer: { radius: 10 }, // Rounded corners physics
            restitution: 0.5, // Bounciness
            friction: 0.1
        });

        Matter.World.add(engine.world, body);
        bodyRef.current = body;

        // Update Loop
        const update = () => {
            if (bodyRef.current && elementRef.current) {
                const { x, y } = bodyRef.current.position;
                const angle = bodyRef.current.angle;

                // Direct DOM manipulation for performance (React state might be too slow for 60fps physics)
                elementRef.current.style.transform = `translate(${x - width / 2}px, ${y - height / 2}px) rotate(${angle}rad)`;
            }
            requestAnimationFrame(update);
        };

        const animId = requestAnimationFrame(update);

        return () => {
            cancelAnimationFrame(animId);
            if (bodyRef.current) Matter.World.remove(engine.world, bodyRef.current);
        };
    }, [engine, x, y, width, height, isStatic]);

    return (
        <div
            ref={elementRef}
            className={`absolute top-0 left-0 will-change-transform ${className}`}
            style={{ width, height }}
        >
            <div className={`w-full h-full pointer-events-auto flex items-center justify-center bg-white border border-gray-200 rounded-3xl shadow-xl text-gray-900 select-none`}>
                {children}
            </div>
        </div>
    );
}

// End of file

