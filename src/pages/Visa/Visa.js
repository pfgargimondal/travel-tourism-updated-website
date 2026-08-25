import { ServiceCategories } from "../../component/ServiceCategories/ServiceCategories";
import "./Visa.css";



export const Visa = () => {
    return (
        <>
            <div className="bannervisa" style={{ width: "100%", height: "450px", backgroundImage: "url(./images/busbanner.jpg)", backgroundSize: "cover" }}></div>

            <section className="menu-section">
                <div className="container my-5">
                    <ServiceCategories />

                    <div className="fbjhbs5555dfs">
                        <div className="travel-wrapper">
                            {/* DESTINATION */}
                            <div className="travel-box dropdown">
                                <div className="travel-label">Select Destination</div>
                                <div className="travel-input" id="destinationBox">
                                    Where are you going?
                                </div>
                                <div className="dropdown-list" id="countryList" />
                            </div>
                            {/* DEPARTURE */}
                            <div className="travel-box">
                                <div className="travel-label">Date of Departure</div>
                                <div className="travel-input">Select Date</div>
                                <input type="date" className="real-date" />
                            </div>
                            {/* RETURN */}
                            <div className="travel-box">
                                <div className="travel-label">Date of Return</div>
                                <div className="travel-input">Select Date</div>
                                <input type="date" className="real-date" />
                            </div>
                        </div>
                        <div className="sdbfhjdsf55">
                            <button className="flight-search-btn">SEARCH</button>
                        </div>
                    </div>
                </div>
            </section>            

            <div className="fdnkjfddf">
                <div className="container py-4">
                    <div className="sdjndsf85">
                        <h4>Most-visited Countries</h4>
                    </div>
                    <div className="row g-4">
                        {/* CARD 1 */}
                        <div className="col-lg-3 col-md-6">
                            <div className="visa-card">
                                <div className="visa-top">
                                    <img src="https://flagcdn.com/w40/ae.png" className="visa-flag" alt=""/>
                                    <div className="visa-badge">E-Visa</div>
                                </div>
                                <div className="visa-title">United Arab Emirates</div>
                                <div className="visa-sub">Get Your Visa By 14 March</div>
                                <div className="visa-text">Quick &amp; Easy Processed</div>
                                <div className="visa-text">10000+ Visa Processed</div>
                                <div className="visa-price">
                                    <div>
                                        <strong>₹ 6599</strong> / Per Adult
                                    </div>
                                    <div className="arrow">›</div>
                                </div>
                                <div className="visa-bottom">
                                    ₹ Get Tourism Tour &amp; Attraction Voucher
                                </div>
                            </div>
                        </div>
                        {/* CARD 2 */}
                        <div className="col-lg-3 col-md-6">
                            <div className="visa-card">
                                <div className="visa-top">
                                    <img src="https://flagcdn.com/w40/us.png" className="visa-flag" alt=""/>
                                    <div className="visa-badge">E-Visa</div>
                                </div>
                                <div className="visa-title">United States Of America</div>
                                <div className="visa-sub">Get Your Visa By 14 March</div>
                                <div className="visa-text">Quick &amp; Easy Processed</div>
                                <div className="visa-text">10000+ Visa Processed</div>
                                <div className="visa-price">
                                    <div>
                                        <strong>₹ 6599</strong> / Per Adult
                                    </div>
                                    <div className="arrow">›</div>
                                </div>
                                <div className="visa-bottom">
                                    ₹ Get Tourism Tour &amp; Attraction Voucher
                                </div>
                            </div>
                        </div>
                        {/* CARD 3 */}
                        <div className="col-lg-3 col-md-6">
                            <div className="visa-card">
                                <div className="visa-top">
                                    <img src="https://flagcdn.com/w40/th.png" className="visa-flag" alt=""/>
                                    <div className="visa-badge">E-Visa</div>
                                </div>
                                <div className="visa-title">Thailand</div>
                                <div className="visa-sub">Get Your Visa By 14 March</div>
                                <div className="visa-text">Quick &amp; Easy Processed</div>
                                <div className="visa-text">10000+ Visa Processed</div>
                                <div className="visa-price">
                                    <div>
                                        <strong>₹ 6599</strong> / Per Adult
                                    </div>
                                    <div className="arrow">›</div>
                                </div>
                                <div className="visa-bottom">
                                    ₹ Get Tourism Tour &amp; Attraction Voucher
                                </div>
                            </div>
                        </div>
                        {/* CARD 4 */}
                        <div className="col-lg-3 col-md-6">
                            <div className="visa-card">
                                <div className="visa-top">
                                    <img src="https://flagcdn.com/w40/tr.png" className="visa-flag" alt=""/>
                                    <div className="visa-badge">E-Visa</div>
                                </div>
                                <div className="visa-title">Turkey</div>
                                <div className="visa-sub">Get Your Visa By 14 March</div>
                                <div className="visa-text">Quick &amp; Easy Processed</div>
                                <div className="visa-text">10000+ Visa Processed</div>
                                <div className="visa-price">
                                    <div>
                                        <strong>₹ 6599</strong> / Per Adult
                                    </div>
                                    <div className="arrow">›</div>
                                </div>
                                <div className="visa-bottom">
                                    ₹ Get Tourism Tour &amp; Attraction Voucher
                                </div>
                            </div>
                        </div>
                        {/* CARD 5 */}
                        <div className="col-lg-3 col-md-6">
                            <div className="visa-card">
                                <div className="visa-top">
                                    <img src="https://flagcdn.com/w40/gr.png" className="visa-flag" alt=""/>
                                    <div className="visa-badge">E-Visa</div>
                                </div>
                                <div className="visa-title">Greece</div>
                                <div className="visa-sub">Get Your Visa By 14 March</div>
                                <div className="visa-text">Quick &amp; Easy Processed</div>
                                <div className="visa-text">10000+ Visa Processed</div>
                                <div className="visa-price">
                                    <div>
                                        <strong>₹ 6599</strong> / Per Adult
                                    </div>
                                    <div className="arrow">›</div>
                                </div>
                                <div className="visa-bottom">
                                    ₹ Get Tourism Tour &amp; Attraction Voucher
                                </div>
                            </div>
                        </div>
                        {/* CARD 6 */}
                        <div className="col-lg-3 col-md-6">
                            <div className="visa-card">
                                <div className="visa-top">
                                    <img src="https://flagcdn.com/w40/id.png" className="visa-flag" alt=""/>
                                    <div className="visa-badge">E-Visa</div>
                                </div>
                                <div className="visa-title">Indonesia</div>
                                <div className="visa-sub">Get Your Visa By 14 March</div>
                                <div className="visa-text">Quick &amp; Easy Processed</div>
                                <div className="visa-text">10000+ Visa Processed</div>
                                <div className="visa-price">
                                    <div>
                                        <strong>₹ 6599</strong> / Per Adult
                                    </div>
                                    <div className="arrow">›</div>
                                </div>
                                <div className="visa-bottom">
                                    ₹ Get Tourism Tour &amp; Attraction Voucher
                                </div>
                            </div>
                        </div>
                        {/* CARD 7 */}
                        <div className="col-lg-3 col-md-6">
                            <div className="visa-card">
                                <div className="visa-top">
                                    <img src="https://flagcdn.com/w40/eg.png" className="visa-flag" alt=""/>
                                    <div className="visa-badge">E-Visa</div>
                                </div>
                                <div className="visa-title">Egypt</div>
                                <div className="visa-sub">Get Your Visa By 14 March</div>
                                <div className="visa-text">Quick &amp; Easy Processed</div>
                                <div className="visa-text">10000+ Visa Processed</div>
                                <div className="visa-price">
                                    <div>
                                        <strong>₹ 6599</strong> / Per Adult
                                    </div>
                                    <div className="arrow">›</div>
                                </div>
                                <div className="visa-bottom">
                                    ₹ Get Tourism Tour &amp; Attraction Voucher
                                </div>
                            </div>
                        </div>
                        {/* CARD 8 */}
                        <div className="col-lg-3 col-md-6">
                            <div className="visa-card">
                                <div className="visa-top">
                                    <img src="https://flagcdn.com/w40/my.png" className="visa-flag" alt=""/>
                                    <div className="visa-badge">E-Visa</div>
                                </div>
                                <div className="visa-title">Malaysia</div>
                                <div className="visa-sub">Get Your Visa By 14 March</div>
                                <div className="visa-text">Quick &amp; Easy Processed</div>
                                <div className="visa-text">10000+ Visa Processed</div>
                                <div className="visa-price">
                                    <div>
                                        <strong>₹ 6599</strong> / Per Adult
                                    </div>
                                    <div className="arrow">›</div>
                                </div>
                                <div className="visa-bottom">
                                    ₹ Get Tourism Tour &amp; Attraction Voucher
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="dsfnhdsbsdfdf">
                <div className="container">
                    <div className="sdjndsf85 mt-5">
                        <h4>Visit Europe !</h4>
                    </div>
                    <div className="bbfdgfdg">
                        <div className="row">
                            {/* CARD 1 */}
                            <div className="col-lg-3 col-md-6">
                                <div className="visa-card">
                                    <img
                                        src="https://flagcdn.com/w320/gr.png" alt=""
                                        style={{ width: "100%", borderRadius: 12 }}
                                    />
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            marginTop: 10
                                        }}
                                    >
                                        <div className="visa-title">Greece</div>
                                        <div className="visa-badge">E-Visa</div>
                                    </div>
                                    <div className="visa-price">
                                        <div>
                                            <strong>₹ 6599</strong> / Per Adult
                                        </div>
                                        <div className="arrow">›</div>
                                    </div>
                                    <div className="visa-bottom">
                                        ₹ Get Tourism Tour &amp; Attraction Voucher
                                    </div>
                                </div>
                            </div>
                            {/* CARD 2 */}
                            <div className="col-lg-3 col-md-6">
                                <div className="visa-card">
                                    <img
                                        src="https://flagcdn.com/w320/fr.png" alt=""
                                        style={{ width: "100%", borderRadius: 12 }}
                                    />
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            marginTop: 10
                                        }}
                                    >
                                        <div className="visa-title">France</div>
                                        <div className="visa-badge">E-Visa</div>
                                    </div>
                                    <div className="visa-price">
                                        <div>
                                            <strong>₹ 6599</strong> / Per Adult
                                        </div>
                                        <div className="arrow">›</div>
                                    </div>
                                    <div className="visa-bottom">
                                        ₹ Get Tourism Tour &amp; Attraction Voucher
                                    </div>
                                </div>
                            </div>
                            {/* CARD 3 */}
                            <div className="col-lg-3 col-md-6">
                                <div className="visa-card">
                                    <img
                                        src="https://flagcdn.com/w320/it.png" alt=""
                                        style={{ width: "100%", borderRadius: 12 }}
                                    />
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            marginTop: 10
                                        }}
                                    >
                                        <div className="visa-title">Italy</div>
                                        <div className="visa-badge">E-Visa</div>
                                    </div>
                                    <div className="visa-price">
                                        <div>
                                            <strong>₹ 6599</strong> / Per Adult
                                        </div>
                                        <div className="arrow">›</div>
                                    </div>
                                    <div className="visa-bottom">
                                        ₹ Get Tourism Tour &amp; Attraction Voucher
                                    </div>
                                </div>
                            </div>
                            {/* CARD 4 */}
                            <div className="col-lg-3 col-md-6">
                                <div className="visa-card">
                                    <img
                                        src="https://flagcdn.com/w320/es.png" alt=""
                                        style={{ width: "100%", borderRadius: 12 }}
                                    />
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            marginTop: 10
                                        }}
                                    >
                                        <div className="visa-title">Spain</div>
                                        <div className="visa-badge">E-Visa</div>
                                    </div>
                                    <div className="visa-price">
                                        <div>
                                            <strong>₹ 6599</strong> / Per Adult
                                        </div>
                                        <div className="arrow">›</div>
                                    </div>
                                    <div className="visa-bottom">
                                        ₹ Get Tourism Tour &amp; Attraction Voucher
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="dsbhujvdds">
                <div className="container mt-5">
                    <div className="nhildbvfdvfdvfdv">
                        <div className="snvhfvfdv">
                            <h4>Customer Viwer</h4>
                        </div>
                        <div className="gfgfhfg">
                            {/* TOP RIGHT ARROWS */}
                            <div className="d-flex justify-content-end mb-3 gap-2">
                                <button
                                    className="custom-arrow"
                                    data-bs-target="#visaSlider"
                                    data-bs-slide="prev"
                                >
                                    <i className="bi bi-chevron-left" />
                                </button>
                                <button
                                    className="custom-arrow"
                                    data-bs-target="#visaSlider"
                                    data-bs-slide="next"
                                >
                                    <i className="bi bi-chevron-right" />
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* SLIDER */}
                    <div id="visaSlider" className="carousel slide">
                        <div className="carousel-inner">
                            {/* SLIDE 1 */}
                            <div className="carousel-item active">
                                <div className="row g-4">
                                    <div className="col-lg-3">
                                        <div className="visaBox">
                                            <div className="visaTop">
                                                <img
                                                    src="https://flagcdn.com/w40/ae.png" alt=""
                                                    className="visaFlag"
                                                />
                                                <div className="visaCountry">United Arab Emirates</div>
                                            </div>
                                            <div className="visaTitle">Quick &amp; Smooth Visa</div>
                                            <div className="visaDesc">
                                                There Are Many Variations Of Passages Of Lorem Ipsum
                                                Available, But The Majority Have Suffered Alteration In Some
                                                Form.
                                            </div>
                                            <div className="visaFooter">
                                                <div className="visaName">Chunkey Pandy</div>
                                                <div className="visaDate">17.03.2025</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-3">
                                        <div className="visaBox">
                                            <div className="visaTop">
                                                <img
                                                    src="https://flagcdn.com/w40/tr.png" alt=""
                                                    className="visaFlag"
                                                />
                                                <div className="visaCountry">Turkey</div>
                                            </div>
                                            <div className="visaTitle">Seamless Visa Process</div>
                                            <div className="visaDesc">
                                                There Are Many Variations Of Passages Of Lorem Ipsum
                                                Available, But The Majority Have Suffered Alteration In Some
                                                Form.
                                            </div>
                                            <div className="visaFooter">
                                                <div className="visaName">Rahul Sharma</div>
                                                <div className="visaDate">12.02.2025</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-3">
                                        <div className="visaBox">
                                            <div className="visaTop">
                                                <img
                                                    src="https://flagcdn.com/w40/gr.png" alt=""
                                                    className="visaFlag"
                                                />
                                                <div className="visaCountry">Greece</div>
                                            </div>
                                            <div className="visaTitle">
                                                Easy Process &amp; Fair Pricing
                                            </div>
                                            <div className="visaDesc">
                                                There Are Many Variations Of Passages Of Lorem Ipsum
                                                Available, But The Majority Have Suffered Alteration In Some
                                                Form.
                                            </div>
                                            <div className="visaFooter">
                                                <div className="visaName">Ankit Verma</div>
                                                <div className="visaDate">05.01.2025</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-3">
                                        <div className="visaBox">
                                            <div className="visaTop">
                                                <img
                                                    src="https://flagcdn.com/w40/eg.png" alt=""
                                                    className="visaFlag" 
                                                />
                                                <div className="visaCountry">Egypt</div>
                                            </div>
                                            <div className="visaTitle">Fast Visa Approval</div>
                                            <div className="visaDesc">
                                                There Are Many Variations Of Passages Of Lorem Ipsum
                                                Available, But The Majority Have Suffered Alteration In Some
                                                Form.
                                            </div>
                                            <div className="visaFooter">
                                                <div className="visaName">Soham Das</div>
                                                <div className="visaDate">22.03.2025</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* SLIDE 2 */}
                            <div className="carousel-item">
                                <div className="row g-4">
                                    <div className="col-lg-3">
                                        <div className="visaBox">
                                            <div className="visaTop">
                                                <img
                                                    src="https://flagcdn.com/w40/in.png" alt=""
                                                    className="visaFlag"
                                                />
                                                <div className="visaCountry">India</div>
                                            </div>
                                            <div className="visaTitle">Hassle Free Visa</div>
                                            <div className="visaDesc">
                                                There Are Many Variations Of Passages Of Lorem Ipsum
                                                Available, But The Majority Have Suffered Alteration In Some
                                                Form.
                                            </div>
                                            <div className="visaFooter">
                                                <div className="visaName">Amit Roy</div>
                                                <div className="visaDate">10.04.2025</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-3">
                                        <div className="visaBox">
                                            <div className="visaTop">
                                                <img
                                                    src="https://flagcdn.com/w40/us.png" alt=""
                                                    className="visaFlag"
                                                />
                                                <div className="visaCountry">United States</div>
                                            </div>
                                            <div className="visaTitle">Premium Visa Service</div>
                                            <div className="visaDesc">
                                                There Are Many Variations Of Passages Of Lorem Ipsum
                                                Available, But The Majority Have Suffered Alteration In Some
                                                Form.
                                            </div>
                                            <div className="visaFooter">
                                                <div className="visaName">John Smith</div>
                                                <div className="visaDate">01.05.2025</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-3">
                                        <div className="visaBox">
                                            <div className="visaTop">
                                                <img
                                                    src="https://flagcdn.com/w40/gb.png" alt=""
                                                    className="visaFlag"
                                                />
                                                <div className="visaCountry">United Kingdom</div>
                                            </div>
                                            <div className="visaTitle">Quick Visa Processing</div>
                                            <div className="visaDesc">
                                                There Are Many Variations Of Passages Of Lorem Ipsum
                                                Available, But The Majority Have Suffered Alteration In Some
                                                Form.
                                            </div>
                                            <div className="visaFooter">
                                                <div className="visaName">David Miller</div>
                                                <div className="visaDate">18.06.2025</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-3">
                                        <div className="visaBox">
                                            <div className="visaTop">
                                                <img
                                                    src="https://flagcdn.com/w40/ca.png" alt=""
                                                    className="visaFlag"
                                                />
                                                <div className="visaCountry">Canada</div>
                                            </div>
                                            <div className="visaTitle">Reliable Visa Assistance</div>
                                            <div className="visaDesc">
                                                There Are Many Variations Of Passages Of Lorem Ipsum
                                                Available, But The Majority Have Suffered Alteration In Some
                                                Form.
                                            </div>
                                            <div className="visaFooter">
                                                <div className="visaName">Arjun Kapoor</div>
                                                <div className="visaDate">25.07.2025</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="fdiulfdhgfdgfdgf">
                <div className="container mt-5">
                    <div className="whySection">
                        <div className="whyTitle">Why Choose My Cheaptickets</div>
                        <div className="row g-4">
                            {/* 1 */}
                            <div className="col-lg-4">
                                <div className="whyCard">
                                    <div className="whyIcon">
                                        <i className="bi bi-hand-thumbs-up-fill" />
                                    </div>
                                    <div>
                                        <div className="whyCardTitle">99.3% Approval Rate</div>
                                        <div className="whyCardDesc">
                                            With a visa approval rate of 99.3%, we have processed over
                                            5,00,000 visas in just 1 year
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* 2 */}
                            <div className="col-lg-4">
                                <div className="whyCard">
                                    <div className="whyIcon">
                                        <i className="bi bi-headset" />
                                    </div>
                                    <div>
                                        <div className="whyCardTitle">Dedicated Visa Team</div>
                                        <div className="whyCardDesc">
                                            A specialised team of visa consultants assists you on every
                                            step of the visa application process
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* 3 */}
                            <div className="col-lg-4">
                                <div className="whyCard">
                                    <div className="whyIcon">
                                        <i className="bi bi-currency-rupee" />
                                    </div>
                                    <div>
                                        <div className="whyCardTitle">Transparent Pricing</div>
                                        <div className="whyCardDesc">
                                            Transparent &amp; clearly marked fare breakdowns ensure that
                                            there are no hidden costs
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}