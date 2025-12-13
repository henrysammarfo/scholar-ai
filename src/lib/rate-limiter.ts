/**
 * Rate Limiter Utility
 * Implements IP-based and wallet-based rate limiting to protect API from bots and abuse
 */

interface RateLimitEntry {
    count: number;
    resetTime: number;
}

class RateLimiter {
    private ipLimits: Map<string, RateLimitEntry> = new Map();
    private walletLimits: Map<string, RateLimitEntry> = new Map();

    // Configuration
    private readonly IP_MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_IP_MAX || '10');
    private readonly IP_WINDOW_MS = parseInt(process.env.RATE_LIMIT_IP_WINDOW_MS || '900000'); // 15 minutes
    private readonly WALLET_MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_WALLET_MAX || '20');
    private readonly WALLET_WINDOW_MS = parseInt(process.env.RATE_LIMIT_WALLET_WINDOW_MS || '3600000'); // 1 hour

    constructor() {
        // Cleanup expired entries every 5 minutes
        setInterval(() => this.cleanup(), 300000);
    }

    /**
     * Check if an IP address has exceeded rate limits
     */
    checkIpLimit(ip: string): { allowed: boolean; retryAfter?: number } {
        const now = Date.now();
        const entry = this.ipLimits.get(ip);

        if (!entry || now > entry.resetTime) {
            // Create new entry or reset expired one
            this.ipLimits.set(ip, {
                count: 1,
                resetTime: now + this.IP_WINDOW_MS
            });
            return { allowed: true };
        }

        if (entry.count >= this.IP_MAX_REQUESTS) {
            const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
            return { allowed: false, retryAfter };
        }

        // Increment count
        entry.count++;
        return { allowed: true };
    }

    /**
     * Check if a wallet address has exceeded rate limits
     */
    checkWalletLimit(wallet: string): { allowed: boolean; retryAfter?: number } {
        const now = Date.now();
        const entry = this.walletLimits.get(wallet.toLowerCase());

        if (!entry || now > entry.resetTime) {
            // Create new entry or reset expired one
            this.walletLimits.set(wallet.toLowerCase(), {
                count: 1,
                resetTime: now + this.WALLET_WINDOW_MS
            });
            return { allowed: true };
        }

        if (entry.count >= this.WALLET_MAX_REQUESTS) {
            const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
            return { allowed: false, retryAfter };
        }

        // Increment count
        entry.count++;
        return { allowed: true };
    }

    /**
     * Get remaining requests for an IP
     */
    getIpRemaining(ip: string): number {
        const entry = this.ipLimits.get(ip);
        if (!entry || Date.now() > entry.resetTime) {
            return this.IP_MAX_REQUESTS;
        }
        return Math.max(0, this.IP_MAX_REQUESTS - entry.count);
    }

    /**
     * Get remaining requests for a wallet
     */
    getWalletRemaining(wallet: string): number {
        const entry = this.walletLimits.get(wallet.toLowerCase());
        if (!entry || Date.now() > entry.resetTime) {
            return this.WALLET_MAX_REQUESTS;
        }
        return Math.max(0, this.WALLET_MAX_REQUESTS - entry.count);
    }

    /**
     * Cleanup expired entries
     */
    private cleanup() {
        const now = Date.now();

        // Cleanup IP limits
        for (const [ip, entry] of this.ipLimits.entries()) {
            if (now > entry.resetTime) {
                this.ipLimits.delete(ip);
            }
        }

        // Cleanup wallet limits
        for (const [wallet, entry] of this.walletLimits.entries()) {
            if (now > entry.resetTime) {
                this.walletLimits.delete(wallet);
            }
        }

        console.log(`[RateLimiter] Cleanup complete. Active IPs: ${this.ipLimits.size}, Active Wallets: ${this.walletLimits.size}`);
    }

    /**
     * Reset limits for testing purposes
     */
    reset() {
        this.ipLimits.clear();
        this.walletLimits.clear();
    }
}

// Singleton instance
export const rateLimiter = new RateLimiter();
