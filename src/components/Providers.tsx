"use client";

import { WagmiProvider, createConfig, http } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { inject } from '@vercel/analytics';
import { SessionProvider } from "@/context/SessionContext";
import { createAppKit } from '@reown/appkit/react';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';

// 1. Get Project ID
const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID || "4928e0af6a150cdf19c97b582c535b81";

// 2. Set up Wagmi Adapter
export const networks = [baseSepolia];

export const wagmiAdapter = new WagmiAdapter({
    projectId,
    networks
});

export const config = wagmiAdapter.wagmiConfig;

// 3. Create AppKit
createAppKit({
    adapters: [wagmiAdapter],
    networks: [baseSepolia],
    projectId,
    features: {
        analytics: true
    }
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <SessionProvider>
                    {children}
                </SessionProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}
