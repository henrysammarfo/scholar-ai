"use client";

import { createContext, useContext } from "react";
import Matter from "matter-js";

export const PhysicsContext = createContext<{ engine: Matter.Engine | null }>({ engine: null });

export function usePhysics() {
    return useContext(PhysicsContext);
}
