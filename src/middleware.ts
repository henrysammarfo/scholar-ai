import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { rateLimiter } from '@/lib/rate-limiter';

/**
 * Middleware for rate limiting and bot protection
 * Runs on all /api routes
 */
export function middleware(request: NextRequest) {
    // Only apply to API routes
    if (!request.nextUrl.pathname.startsWith('/api')) {
        return NextResponse.next();
    }

    // Get client IP
    const ip = request.ip ||
        request.headers.get('x-forwarded-for')?.split(',')[0] ||
        request.headers.get('x-real-ip') ||
        'unknown';

    // Get wallet address from header (if authenticated)
    const wallet = request.headers.get('x-wallet-address');

    // Bot detection - check User-Agent
    const userAgent = request.headers.get('user-agent') || '';
    const suspiciousBots = ['curl', 'wget', 'python-requests', 'bot', 'crawler', 'spider'];
    const isSuspicious = suspiciousBots.some(bot => userAgent.toLowerCase().includes(bot));

    if (isSuspicious && !userAgent.includes('Googlebot')) {
        console.warn(`[Middleware] Suspicious bot detected: ${userAgent} from ${ip}`);
        // Allow but log - you can change this to block if needed
        // return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Check IP-based rate limit
    const ipLimit = rateLimiter.checkIpLimit(ip);
    if (!ipLimit.allowed) {
        console.warn(`[Middleware] IP rate limit exceeded: ${ip}`);
        return NextResponse.json(
            {
                error: 'Too many requests from this IP. Please try again later.',
                retryAfter: ipLimit.retryAfter
            },
            {
                status: 429,
                headers: {
                    'Retry-After': String(ipLimit.retryAfter || 60),
                    'X-RateLimit-Limit': String(rateLimiter.getIpRemaining(ip) + 1),
                    'X-RateLimit-Remaining': '0'
                }
            }
        );
    }

    // Check wallet-based rate limit (if authenticated)
    if (wallet) {
        const walletLimit = rateLimiter.checkWalletLimit(wallet);
        if (!walletLimit.allowed) {
            console.warn(`[Middleware] Wallet rate limit exceeded: ${wallet}`);
            return NextResponse.json(
                {
                    error: 'Too many requests from this wallet. Please try again later.',
                    retryAfter: walletLimit.retryAfter
                },
                {
                    status: 429,
                    headers: {
                        'Retry-After': String(walletLimit.retryAfter || 60),
                        'X-RateLimit-Limit': String(rateLimiter.getWalletRemaining(wallet) + 1),
                        'X-RateLimit-Remaining': '0'
                    }
                }
            );
        }
    }

    // Add rate limit info to response headers
    const response = NextResponse.next();
    response.headers.set('X-RateLimit-IP-Remaining', String(rateLimiter.getIpRemaining(ip)));
    if (wallet) {
        response.headers.set('X-RateLimit-Wallet-Remaining', String(rateLimiter.getWalletRemaining(wallet)));
    }

    return response;
}

// Configure which routes use this middleware
export const config = {
    matcher: '/api/:path*',
};
