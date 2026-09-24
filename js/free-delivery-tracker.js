/* =========================================================
   SAFE DYNAMIC FREE DELIVERY CALCULATOR (NO LOOP)
========================================================= */

(function () {
    const THRESHOLD = 999;

    function updateFreeDeliveryProgress() {
        const cartPanel = document.getElementById("cartPanel");
        const msgEl = document.getElementById("deliveryMsg");
        const fillEl = document.getElementById("deliveryProgressFill");

        if (!cartPanel || !msgEl || !fillEl) return;

        let total = 0;

        // 1. Agar tumhare cart panel me subtotal ka element hai
        const subtotalEl = cartPanel.querySelector("#cartTotal, #cartSubtotal, .cart-total, .total-price");
        if (subtotalEl) {
            const parsed = parseFloat(subtotalEl.textContent.replace(/[^\d.]/g, ""));
            if (!isNaN(parsed) && parsed > 0) total = parsed;
        }

        // 2. Fallback: item cards ke andar se total read karna (without looping)
        if (total === 0) {
            const priceElements = cartPanel.querySelectorAll("p, span, div");
            for (let el of priceElements) {
                // Free delivery box ke andar ke elements ko ignore karo
                if (el.closest("#freeDeliveryBox")) continue;
                const txt = el.textContent.trim();
                // Item total price dhoondo jaise "₹2,998" ya "₹3,499"
                if (txt.startsWith("₹") && !txt.includes("Qty")) {
                    const val = parseFloat(txt.replace(/[^\d.]/g, ""));
                    if (!isNaN(val) && val > 0) {
                        total += val;
                    }
                }
            }
        }

        const percent = Math.min(100, Math.max(0, (total / THRESHOLD) * 100));
        fillEl.style.width = percent + "%";

        if (total === 0) {
            msgEl.innerHTML = 'Shop for <strong>₹' + THRESHOLD + '</strong> to get <strong>Free Delivery!</strong>';
            fillEl.style.background = "#3b82f6";
        } else if (total >= THRESHOLD) {
            msgEl.innerHTML = '🎉 Congratulations! You unlocked <strong>FREE DELIVERY!</strong>';
            fillEl.style.background = "#16a34a";
        } else {
            const diff = THRESHOLD - total;
            msgEl.innerHTML = 'Add <strong>₹' + Math.round(diff) + '</strong> more to get <strong>FREE DELIVERY!</strong>';
            fillEl.style.background = "linear-gradient(90deg, #3b82f6, #16a34a)";
        }
    }

    // Sirf jab user click kare ya cart open ho tabhi chalega (Zero Lag / Zero Loop)
    window.updateFreeDeliveryProgress = updateFreeDeliveryProgress;

    document.addEventListener("click", function (e) {
        if (e.target.closest("#cartBtn, .add-cart-btn, [onclick*='openCart'], [onclick*='closeCart'], #cartPanel button")) {
            setTimeout(updateFreeDeliveryProgress, 100);
        }
    });

    window.addEventListener("load", function () {
        setTimeout(updateFreeDeliveryProgress, 300);
    });
})();
