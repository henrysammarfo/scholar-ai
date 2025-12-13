"use client";

import { useEffect, useRef, useState, useCallback, useContext } from "react";
import Matter from "matter-js";
import { PhysicsContext } from "./PhysicsContext";

export function GravityZone({ children }: { children: React.ReactNode }) {
    const sceneRef = useRef<HTMLDivElement>(null);
    const [engine, setEngine] = useState<Matter.Engine | null>(null);

    useEffect(() => {
        if (!sceneRef.current) return;

        // Setup Engine
        const Engine = Matter.Engine,
            MouseConstraint = Matter.MouseConstraint,
            Mouse = Matter.Mouse,
            World = Matter.World,
            Bodies = Matter.Bodies,
            Composite = Matter.Composite;

        const _engine = Engine.create();

        // Set standard earth gravity
        _engine.world.gravity.y = 1;

        // Boundaries
        const updateBoundaries = () => {
            if (!_engine.world) return;
            const width = window.innerWidth;
            const height = window.innerHeight;

            const bodies = Composite.allBodies(_engine.world);
            const existingWalls = bodies.filter(b => b.label === "Wall");
            Composite.remove(_engine.world, existingWalls);

            const wallOptions = { isStatic: true, render: { visible: false }, label: "Wall" };
            const ground = Bodies.rectangle(width / 2, height + 50, width, 100, wallOptions);
            const leftWall = Bodies.rectangle(-50, height / 2, 100, height * 5, wallOptions);
            const rightWall = Bodies.rectangle(width + 50, height / 2, 100, height * 5, wallOptions);

            Composite.add(_engine.world, [ground, leftWall, rightWall]);
        };

        updateBoundaries();

        // Mouse Interface
        const mouse = Mouse.create(sceneRef.current);
        const mouseConstraint = MouseConstraint.create(_engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: { visible: false }
            }
        });
        World.add(_engine.world, mouseConstraint);

        // MANUAL LOOP for reliability
        let animationFrameId: number;
        const tick = () => {
            Engine.update(_engine, 1000 / 60);
            animationFrameId = requestAnimationFrame(tick);
        };
        tick();

        setEngine(_engine);

        const handleResize = () => updateBoundaries();
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            cancelAnimationFrame(animationFrameId);
            Engine.clear(_engine);
            setEngine(null);
        };
    }, []);

    return (
        <PhysicsContext.Provider value={{ engine }}>
            <div ref={sceneRef} className="absolute inset-0 overflow-hidden z-0 bg-transparent pointer-events-auto">
                {engine && children}
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
            chamfer: { radius: 10 },
            restitution: 0.4, // Bouncier
            friction: 0.1,
            frictionAir: 0.01, // Standard air resistance (was 0.05 too sticky)
            density: 0.05,
        });

        // Ensure it doesn't sleep
        Matter.Sleeping.set(body, false);
        // @ts-ignore
        body.allowSleeping = false;

        // Initial kick to ensure movement
        Matter.Body.setVelocity(body, { x: 0, y: 2 });
        Matter.Body.setAngularVelocity(body, Math.random() * 0.02 - 0.01);

        // Allow natural rotation
        // Matter.Body.setInertia(body, Infinity);

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
            if (bodyRef.current) {
                Matter.World.remove(engine.world, bodyRef.current);
                bodyRef.current = null;
            }
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

