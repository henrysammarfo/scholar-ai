"use client";

import { useAppKit } from "@reown/appkit/react";
import { useAccount, useDisconnect } from "wagmi";
import { Loader2, Wallet, LogOut } from "lucide-react";

export default function WalletConnect() {
    const { open } = useAppKit();
    const { address, isConnected, isConnecting } = useAccount();
    const { disconnect } = useDisconnect();

    if (isConnecting) {
        return (
            <button disabled className="btn-primary flex items-center gap-2 opacity-80">
                <Loader2 className="w-4 h-4 animate-spin" />
                Connecting...
            </button>
        );
    }

    if (isConnected) {
        return (
            <div className="flex items-center gap-2">
                <button
                    onClick={() => open()}
                    className="btn-secondary flex items-center gap-2 text-sm !py-2 !px-4"
                >
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    {address?.slice(0, 6)}...{address?.slice(-4)}
                </button>
                <button
                    onClick={() => disconnect()}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                    title="Disconnect"
                >
                    <LogOut className="w-4 h-4" />
                </button>
            </div>
        );
    }

    return (
        <button
            onClick={() => open()}
            className="px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-lg hover:shadow-blue-200 transition-all flex items-center gap-2 active:scale-95"
        >
            <Wallet className="w-4 h-4" />
            Connect Wallet
        </button>
    );
}
