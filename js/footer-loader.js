// ======================
// FOOTER LOADER
// ======================

document.addEventListener("DOMContentLoaded", function () {

    const footerContainer =
        document.getElementById("footer-container");

    if (!footerContainer) {
        return;
    }

    footerContainer.innerHTML = `

        <footer class="site-footer">

            <div class="footer-container">

                <!-- ShopEase -->

                <div class="footer-column">

                    <h3>ShopEase</h3>

                    <p>
                        Your trusted online shopping destination
                        for quality products at great prices.
                    </p>

                </div>


                <!-- Quick Links -->

                <div class="footer-column">

                    <h3>Quick Links</h3>

                    <a href="Shopping.html">
                        Home
                    </a>

                    <a href="Shopping.html">
                        Products
                    </a>

                    <a href="OrderHistory.html">
                        My Orders
                    </a>

                    <a href="Checkout.html">
                        Checkout
                    </a>

                </div>


                <!-- Customer Service -->

                <div class="footer-column">

                    <h3>Customer Service</h3>

                    <a href="HelpCenter.html">
                        Help Center
                    </a>

                    <a href="ContactUs.html">
                        Contact Us
                    </a>

                    <a href="TrackOrder.html">
                        Track Order
                    </a>

                    <a href="FAQ.html">
                        FAQ
                    </a>

                </div>


                <!-- Information -->

                <div class="footer-column">

                    <h3>Information</h3>

                    <a href="AboutUs.html">
                        About Us
                    </a>

                    <a href="ShippingInformation.html">
                        Shipping Information
                    </a>

                    <a href="ReturnRefund.html">
                        Return & Refund Policy
                    </a>

                    <a href="TermsConditions.html">
                        Terms & Conditions
                    </a>

                    <a href="PrivacyPolicy.html">
                        Privacy Policy
                    </a>

                </div>


                <!-- Social & Payments -->

                <div class="footer-column">

                    <h3>Connect With Us</h3>

                    <div class="footer-social-links">

                        <a href="https://www.facebook.com/profile.php?id=100084812984120"
   target="_blank"
   rel="noopener noreferrer"
   aria-label="Facebook">
    Facebook
</a>

<a href="https://www.instagram.com/jha_shitanshu16/"
   target="_blank"
   rel="noopener noreferrer"
   aria-label="Instagram">
    Instagram
</a>

<a href="https://www.linkedin.com/in/shitanshu-jha-738012342/"
   target="_blank"
   rel="noopener noreferrer"
   aria-label="LinkedIn">
    LinkedIn
</a>

<a href="https://github.com/Shitanshu686"
   target="_blank"
   rel="noopener noreferrer"
   aria-label="GitHub">
    GitHub
</a>

                    </div>


                    <h3 class="footer-payment-title">
                        Secure Payments
                    </h3>

                    <div class="footer-payment-badges">

                        <span>🔒 Secure</span>

                        <span>💳 Razorpay</span>

                        <span>🛡️ Protected</span>

                    </div>

                </div>

            </div>


            <!-- Footer Bottom -->

            <div class="footer-bottom">

                <p>
                    © 2026 ShopEase | Developed by Shitanshu Jha
                </p>

            </div>

        </footer>

    `;

});