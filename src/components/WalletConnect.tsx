"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Wallet, LogOut } from "lucide-react";

export default function WalletConnect() {
    const { address, isConnected } = useAccount();
    const { connect, connectors } = useConnect();
    const { disconnect } = useDisconnect();

    if (isConnected) {
        return (
            <button
                onClick={() => disconnect()}
                className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-xl transition-all border border-gray-700"
            >
                <Wallet className="w-4 h-4 text-green-400" />
                <span className="font-mono text-sm">
                    {address?.slice(0, 6)}...{address?.slice(-4)}
                </span>
                <LogOut className="w-4 h-4 ml-2 opacity-50" />
            </button>
        );
    }

    return (
        <div className="flex gap-2">
            {connectors.filter(c => c.id === 'injected' || c.id === 'io.metamask').map((connector) => (
                <button
                    key={connector.uid}
                    onClick={() => connect({ connector })}
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-6 py-2 rounded-xl font-medium transition-all"
                >
                    <Wallet className="w-4 h-4" />
                    Connect Wallet
                </button>
            )).slice(0, 1)}
        </div>
    );
}
