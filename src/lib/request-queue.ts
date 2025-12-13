/**
 * Request Queue System
 * Prevents API quota exhaustion by queuing and throttling concurrent requests
 */

import Bottleneck from 'bottleneck';

// Configuration
const MAX_CONCURRENT = parseInt(process.env.MAX_CONCURRENT_REQUESTS || '1'); // Strict concurrency
const MIN_TIME_BETWEEN_REQUESTS = 4500; // 4.5 seconds (approx 13 RPM) to be safe under 15 RPM limit

/**
 * Global request limiter using Bottleneck
 * Ensures only MAX_CONCURRENT requests run simultaneously
 * and enforces minimum time between requests
 */
export const requestQueue = new Bottleneck({
    maxConcurrent: MAX_CONCURRENT,
    minTime: MIN_TIME_BETWEEN_REQUESTS,

    // Reservoir settings (optional - limits total requests per time period)
    reservoir: 15, // 15 requests
    reservoirRefreshAmount: 15,
    reservoirRefreshInterval: 60 * 1000, // per minute

    // Retry settings
    retryCount: 2,
    retryDelay: (retryCount) => {
        // Exponential backoff: 2s, 4s, 8s...
        return Math.min(1000 * Math.pow(2, retryCount), 10000);
    }
});

/**
 * Queue status monitoring
 */
requestQueue.on('failed', async (error, jobInfo) => {
    console.error(`[RequestQueue] Job failed:`, error);
    const id = jobInfo.options.id;

    // Retry logic
    if (jobInfo.retryCount < 2) {
        console.log(`[RequestQueue] Retrying job ${id} (attempt ${jobInfo.retryCount + 1})`);
        return 1000; // Retry after 1 second
    }
});

requestQueue.on('retry', (error, jobInfo) => {
    console.log(`[RequestQueue] Retrying job ${jobInfo.options.id}`);
});

requestQueue.on('queued', (info) => {
    console.log(`[RequestQueue] Job queued. Queue size: ${requestQueue.counts().QUEUED}`);
});

requestQueue.on('executing', (info) => {
    console.log(`[RequestQueue] Job executing. Running: ${requestQueue.counts().EXECUTING}`);
});

/**
 * Get current queue statistics
 */
export function getQueueStats() {
    const counts = requestQueue.counts();
    return {
        queued: counts.QUEUED,
        executing: counts.EXECUTING,
        done: counts.DONE,
        failed: counts.FAILED
    };
}

/**
 * Wrapper function to schedule API requests
 */
export async function scheduleRequest<T>(
    fn: () => Promise<T>,
    options?: { id?: string; priority?: number }
): Promise<T> {
    return requestQueue.schedule(
        { id: options?.id, priority: options?.priority || 5 },
        fn
    );
}
