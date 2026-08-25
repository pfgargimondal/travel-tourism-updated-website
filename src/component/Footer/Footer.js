import { Link } from "react-router-dom";
import "./Footer.css";

export const Footer = () => {

    return (
      <div>
        <footer class="main-footer pt-5">
            <div class="container">
                <div class="row">
                    <div class="col-lg-4 col-md-6 col-sm-6 col-12 mb-4">
                        <h3 class="footer-logo">Ticket Booking</h3>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                            Odio suspendisse leo neque iaculis molestie sagittis.
                        </p>

                        <ul class="footer-contact list-unstyled">
                            <li><strong>PO Box:</strong> +47-252-254-2542</li>
                            <li><strong>Location:</strong> Collins Street, Sydney, Australia</li>
                            <li><strong>Email:</strong> info@travel.com</li>
                            <li><strong>Website:</strong> www.travel.com</li>
                        </ul>

                        <div class="payment-section mt-4">
                            <span>We Support:</span>
                            <div class="payment-logos">
                                <img src="./images/trans1.png" alt="Visa" />
                                <img src="./images/trans2.png" alt="Mastercard" />
                                <img src="./images/trans3.png" alt="PayPal" />
                                <img src="./images/trans4.png" alt="Stripe" />
                                <img src="./images/trans5.png" alt="Stripe" />
                            </div>
                        </div>
                    </div>

                    <div class="col-lg-2 col-md-6 col-sm-6 col-12 mb-4">
                        <h5>Quick Link</h5>
                        <ul class="footer-links list-unstyled">
                            <li><Link to="/about-us">About Us</Link></li>
                            <li><a href="/">Delivery Information</a></li>
                            <li><Link to="/privacy-policy">Privacy Policy</Link></li>
                            <li><Link to="/terms-&-conditions">Terms & Conditions</Link></li>
                            <li><Link to="/customer-service">Customer Service</Link></li>
                            <li><Link to="/return-policy">Return Policy</Link></li>
                        </ul>
                    </div>

                    <div class="col-lg-2 col-md-6 col-sm-6 col-12 mb-4">
                        <h5>Categories</h5>
                        <ul class="footer-links list-unstyled">
                            <li><a href="/">Travel</a></li>
                            <li><a href="/">Technology</a></li>
                            <li><a href="/">Lifestyle</a></li>
                            <li><a href="/">Destinations</a></li>
                            <li><a href="/">Entertainment</a></li>
                            <li><a href="/">Business</a></li>
                        </ul>
                    </div>

                    <div class="col-lg-4 col-md-6 col-sm-6 col-12 mb-4">
                        <h5>Newsletter</h5>
                        <p>
                            Join our community of over 200,000 global readers who receives emails filled with news,
                            promotions,
                            and other good stuff.
                        </p>

                        <form class="newsletter-form d-flex">
                            <input type="email" class="form-control" placeholder="Email Address" />
                            <button class="btn btn-tour">Subscribe</button>
                        </form>
                    </div>
                </div>
            </div>

            <div class="footer-bottom mt-4">
                <div class="container d-flex justify-content-between align-items-center">
                    <p class="mb-0">2026 Travel. All rights reserved.</p>

                    <div class="social-icons">
                        <a href="/"><img src="./images/facebookicon.png" alt="" /></a>
                        <a href="/"><img src="./images/twittericon.png" alt="" /></a>
                        <a href="/"><img src="./images/instaicon.png" alt="" /></a>
                        <a href="/"><img src="./images/linkedinicon.png" alt="" /></a>
                    </div>
                </div>
            </div>

        </footer>
      </div>
    )
}
