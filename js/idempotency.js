// ==========================================
// IDEMPOTENCY MODULE (Stripe-Style Safety)
// ==========================================

const IdempotencyManager = (function () {
    let currentKey = null;

    /**
     * Generates or retrieves an existing idempotency key for the current checkout attempt.
     * Uses native Web Crypto API UUID v4 if available.
     */
    function getKey() {
        if (!currentKey) {
            if (typeof crypto !== "undefined" && crypto.randomUUID) {
                currentKey = "idem_" + crypto.randomUUID();
            } else {
                currentKey = "idem_" + Date.now() + "_" + Math.random().toString(36).substring(2, 11);
            }
        }
        return currentKey;
    }

    /**
     * Clears the current key when an order is successfully finalized
     * or when form input changes meaningfully.
     */
    function resetKey() {
        currentKey = null;
    }

    return {
        getKey,
        resetKey
    };
})();
