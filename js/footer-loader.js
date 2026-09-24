// ======================
// FOOTER LOADER (UNIFIED & MERGED)
// ======================

document.addEventListener("DOMContentLoaded", function () {
    const footerContainer = document.getElementById("footer-container");
    if (!footerContainer) return;

    footerContainer.innerHTML = `
        <footer class="site-footer">
            <div class="footer-container">

                <!-- ShopEase Brand -->
                <div class="footer-column">
                    <h3>ShopEase</h3>
                    <p>
                        Your trusted online shopping destination
                        for quality products at great prices.
                    </p>
                    <div class="footer-payment-badges" style="margin-top: 14px;">
                        <span>⚡ Razorpay</span>
                        <span>UPI / GPAY</span>
                        <span>Cards</span>
                    </div>
                </div>

                <!-- Quick Links -->
                <div class="footer-column">
                    <h3>Quick Links</h3>
                    <a href="Shopping.html">Home</a>
                    <a href="#productsContainer">Products</a>
                    <a href="#brandShowcaseSection">Featured Brands</a>
                    <a href="javascript:void(0)" onclick="openCart()">View Cart</a>
                    <a href="OrderHistory.html">My Orders</a>
                    <a href="Checkout.html">Checkout</a>
                </div>

                <!-- Customer Service -->
                <div class="footer-column">
                    <h3>Customer Service</h3>
                    <a href="HelpCenter.html">Help Center</a>
                    <a href="ContactUs.html">Contact Us</a>
                    <a href="TrackOrder.html">Track Order</a>
                    <a href="FAQ.html">FAQ</a>
                </div>

                <!-- Information -->
                <div class="footer-column">
                    <h3>Information</h3>
                    <a href="AboutUs.html">About Us</a>
                    <a href="ShippingInformation.html">Shipping Information</a>
                    <a href="ReturnRefund.html">Return & Refund Policy</a>
                    <a href="TermsConditions.html">Terms & Conditions</a>
                    <a href="PrivacyPolicy.html">Privacy Policy</a>
                </div>

                <!-- Social & Newsletter -->
                <div class="footer-column">
                    <h3>Connect With Us</h3>
                    <div class="footer-social-links">
                        <a href="https://www.facebook.com/profile.php?id=100084812984120" target="_blank" rel="noopener noreferrer" aria-label="Facebook">Facebook</a>
                        <a href="https://www.instagram.com/jha_shitanshu16/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">Instagram</a>
                        <a href="https://www.linkedin.com/in/shitanshu-jha-738012342/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">LinkedIn</a>
                        <a href="https://github.com/Shitanshu686" target="_blank" rel="noopener noreferrer" aria-label="GitHub">GitHub</a>
                    </div>

                    <h3 style="margin-top: 18px; font-size: 14px;">Stay Updated</h3>
                    <div style="display: flex; gap: 6px; margin-top: 8px;">
                        <input type="email" id="newsletterInput" placeholder="Enter email" style="padding: 6px 10px; border-radius: 6px; border: 1px solid #334155; background: #0b1329; color: #fff; font-size: 12px; outline: none; flex: 1; min-width: 110px;">
                        <button type="button" onclick="handleNewsletterSubscribe()" style="padding: 6px 12px; background: #2563eb; color: #fff; border: none; border-radius: 6px; font-weight: 600; font-size: 12px; cursor: pointer;">Join</button>
                    </div>
                </div>

            </div>

            <!-- Footer Bottom -->
            <div class="footer-bottom">
                <p>© 2026 ShopEase | Developed by Shitanshu Jha</p>
            </div>
        </footer>
    `;
});

function handleNewsletterSubscribe() {
    const input = document.getElementById("newsletterInput");
    if (!input) return;
    const email = input.value.trim();
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
        alert("Please enter your email address.");
        input.focus();
        return;
    }
    if (!regex.test(email)) {
        alert("Please enter a valid email address.");
        input.focus();
        return;
    }
    let subs = JSON.parse(localStorage.getItem("shopease_subscribers") || "[]");
    if (subs.includes(email)) {
        alert("You are already subscribed to ShopEase updates!");
        input.value = "";
        return;
    }
    subs.push(email);
    localStorage.setItem("shopease_subscribers", JSON.stringify(subs));
    alert("🎉 Thank you for subscribing! Check your inbox for special ShopEase offers.");
    input.value = "";
}
