"use client";

import { WagmiProvider, createConfig, http } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { inject } from '@vercel/analytics';
import { coinbaseWallet, injected, walletConnect } from 'wagmi/connectors'

const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID || "4928e0af6a150cdf19c97b582c535b81";

export const config = createConfig({
    chains: [baseSepolia],
    connectors: [
        injected(),
        walletConnect({ projectId }),
        coinbaseWallet(),
    ],
    transports: {
        [baseSepolia.id]: http(),
    },
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </WagmiProvider>
    );
}
