"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useAccount } from "wagmi";

export type Message = {
    role: "user" | "agent";
    content: string;
    timestamp: number;
    type?: "text" | "report" | "error";
};

export type Session = {
    id: string;
    title: string;
    messages: Message[];
    createdAt: number;
    lastUpdated: number;
};

type SessionContextType = {
    sessions: Session[];
    currentSessionId: string | null;
    createSession: () => void;
    switchSession: (id: string) => void;
    addMessage: (sessionId: string, message: Message) => void;
    deleteSession: (id: string) => void;
    clearAllSessions: () => void;
};

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
    const { address } = useAccount();
    const [sessions, setSessions] = useState<Session[]>([]);
    const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

    // Load sessions from LocalStorage when wallet connects
    useEffect(() => {
        if (!address) {
            setSessions([]);
            setCurrentSessionId(null);
            return;
        }

        const key = `scholar_ai_sessions_${address}`;
        const stored = localStorage.getItem(key);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                setSessions(parsed);
                if (parsed.length > 0) {
                    setCurrentSessionId(parsed[0].id);
                }
            } catch (e) {
                console.error("Failed to parse sessions", e);
            }
        }
    }, [address]);

    // Save sessions to LocalStorage whenever they change
    useEffect(() => {
        if (!address) return;
        const key = `scholar_ai_sessions_${address}`;
        localStorage.setItem(key, JSON.stringify(sessions));
    }, [sessions, address]);

    const createSession = () => {
        const newSession: Session = {
            id: crypto.randomUUID(),
            title: `Research Session ${new Date().toLocaleTimeString()}`,
            messages: [],
            createdAt: Date.now(),
            lastUpdated: Date.now(),
        };
        setSessions((prev) => [newSession, ...prev]);
        setCurrentSessionId(newSession.id);
    };

    const switchSession = (id: string) => {
        setCurrentSessionId(id);
    };

    const addMessage = (sessionId: string, message: Message) => {
        setSessions((prev) =>
            prev.map((s) => {
                if (s.id === sessionId) {
                    // Auto-update title based on first user message
                    let title = s.title;
                    if (s.messages.length === 0 && message.role === "user") {
                        title = message.content.slice(0, 30) + (message.content.length > 30 ? "..." : "");
                    }
                    return {
                        ...s,
                        messages: [...s.messages, message],
                        lastUpdated: Date.now(),
                        title,
                    };
                }
                return s;
            })
        );
    };

    const deleteSession = (id: string) => {
        setSessions((prev) => prev.filter((s) => s.id !== id));
        if (currentSessionId === id) {
            setCurrentSessionId(null);
        }
    };

    const clearAllSessions = () => {
        setSessions([]);
        setCurrentSessionId(null);
    };

    return (
        <SessionContext.Provider
            value={{
                sessions,
                currentSessionId,
                createSession,
                switchSession,
                addMessage,
                deleteSession,
                clearAllSessions,
            }}
        >
            {children}
        </SessionContext.Provider>
    );
}

export function useSession() {
    const context = useContext(SessionContext);
    if (context === undefined) {
        throw new Error("useSession must be used within a SessionProvider");
    }
    return context;
}
