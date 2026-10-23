const defaultData = {
    brand: "MyCheapTickets",
    logo: "/images/COlgfJcjQfjCUywmAAiIwIAxQnnk1YYYP4j3NGUu.png",

    // Top block
    passengerName: "VENKATESH SWAMY",
    mobile: "917838373877",
    email: "support@mycheaptickets.in",
    pnr: "DSQXEB",
    airlineCode: "AI",
    airlineLogo: "", // optional image url; falls back to a red tile with airlineCode
    route: "Ahmedabad – Delhi",
    tripType: "ROUNDTRIP",
    fareType: "Refundable",
    travelLine: "28 November, 1 Passenger(s)",

    booking: {
        reference: "MCT9459433220",
        pnr: "DSQXEB",
        status: "Confirm",
        date: "12 November 2025",
        paymentStatus: "success",
        promo: "",
    },

    flights: [
        {
            flight: "AI 882",
            from: "Ahmedabad (Terminal 1)",
            to: "Delhi (Terminal 3)",
            stops: "",
            depDate: "01 December 2025",
            departs: "16:00",
            arrDate: "01 December 2025",
            arrives: "17:45",
        },
    ],

    passengers: [
        { name: "Mr. SATYAJIT SEN", type: "Adult", checkIn: "15 Kilograms", cabin: "7Kg", ticketNo: "0985800254980" },
    ],

    ssr: [{ name: "Mr. SATYAJIT SEN", meals: "---", seat: "---", baggage: "---" }],

    fare: [
        ["Basic", "INR 3,039"],
        ["Taxes", "INR 1,353"],
        ["SSR Amount (+)", "INR 0"],
        ["Instant Discount (-)", "INR 0"],
        ["Grand Total:", "INR 4,392"],
    ],

    payment: [
        ["ID", "E2511120P3J8GK"],
        ["Amount", "INR 8421.6"],
        ["Payment date", "2025-11-12 16:42:54"],
        ["Payment Status", "success"],
        ["Payment Mode", "UPI"],
    ],

    steps: [
        { icon: "./images/co.png", title: "Check-in online", text: "Check-in online between 48 hours to 60 mins before your flight and select your preferred seat" },
        { icon: "./images/aea.png", title: "Arrive early at the airport", text: "Reach the airport at least 120 minutes before your flight" },
        { icon: "./images/ca.png", title: "Check-in at the airport", text: "Check-in counter will close 60 mins prior to departure" },
        { icon: "./images/ba.png", title: "Baggage allowance", text: "Check-in baggage: 15 Kilograms per person; Cabin baggage: 7Kg per person" },
        { icon: "./images/byf.png", title: "Board your flight", text: "Boarding gate will close 25 mins prior to departure" },
    ],

    terms: [
        { pre: "For more information on your itinerary, please", href: "#" },
        { pre: "To read our conditions of carriage as per Indian regulations, please", href: "#" },
        { pre: "For details on the Passenger Charter issued by the Ministry of Civil Aviation (MoCA), please", href: "#" },
    ],

    dangerous: [
        { icon: "./images/explosives.png", text: "Explosives" },
        { icon: "./images/gases.png", text: "Gases" },
        { icon: "./images/dry-coconut-copra.png", text: "Dry coconut (Copra)" },
        { icon: "./images/flammable-substances.png", text: "Flammable substances" },
        { icon: "./images/oxidizers-organic-peroxides.png", text: "Oxidizers and Organic peroxides" },
        { icon: "./images/toxic-infectious-substance.png", text: "Toxic and infectious substance" },
        { icon: "./images/radioactive-materials.png", text: "Radioactive materials" },
        { icon: "./images/corrosives.png", text: "Corrosives" },
        { icon: "./images/batteries-powerbank-carry-on-only.png", text: "Batteries and Powerbank are allowed in Carry-on baggage only" },
        { icon: "./images/misc-dangerous-goods.png", text: "Misc dangerous goods" },
        { icon: "./images/satellite-phones.png", text: "Satellite phones" },
        { icon: "./images/spillable-batteries.png", text: "Spillable batteries" },
    ],

    website: "MyCheapTickets.in / MyCheapTickets.com",
    phone: "+919429693667",
    supportEmail: "support@mycheaptickets.com",
};

export const FlightInvoice = ({ data = defaultData }) => {
    const d = { ...defaultData, ...data };

    // Section card: olive header row + body row (tables only)
    const Section = ({ title, children }) => (
        <table className="bc-sec">
            <tbody>
                <tr>
                    <td className="bc-sec-head">{title}</td>
                </tr>
                <tr>
                    <td className="bc-sec-body">{children}</td>
                </tr>
            </tbody>
        </table>
    );

    // Label / value rows for Fare + Payment summaries
    const KV = ({ rows }) => (
        <table className="bc-kv">
            <tbody>
                {rows.map(([k, v]) => (
                    <tr key={k}>
                        <td className="k">{k}</td>
                        <td className="v">{v}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );

    return (
        <>
            <style>{`
                main{
                    margin-top: 0;
                }
                .bc-page {
                    --olive: #7f6800;
                    --ink: #111;
                    --head-bg: #f1f4f9;
                    --rule: #e2e6ee;
                    --red: #e5382b;
                    --green: #0a9a1f;
                    --link: #6a3df0;

                    width: 100%;
                    max-width: 800px;
                    margin: 0 auto;
                    border-collapse: collapse;
                    border: 1px solid #cfd5df;
                    background: #fff;
                    color: var(--ink);
                    font-family: "Manrope", "Mulish", "Segoe UI", system-ui, sans-serif;
                    font-size: 13px;
                    line-height: 1.45;
                }
                .bc-page table { width: 100%; border-collapse: collapse; }
                .bc-page > tbody > tr > td { padding: 0 20px 40px; }
                .bc-page .bc-topbar { height: 6px; background: var(--olive); padding: 0 !important; }
                .bc-gap { height: 18px; }

                /* Title row */
                .bc-title { font-size: 24px; font-weight: 700; color: var(--olive); padding-top: 20px; }
                .bc-brand { text-align: right; padding-top: 20px; }
                .bc-brand img { height: 2rem; }

                /* Identity row */
                .bc-id td { vertical-align: top; }
                .bc-name { width: 38%; vertical-align: middle !important; font-size: 18px; font-weight: 500; padding-top: 28px; }
                .bc-pnrcell { width: 24%; text-align: center; padding-top: 4px; }
                .bc-pnrbox {
                    width: 122px !important;
                    margin: 0 auto;
                    border-collapse: separate !important;
                    border-spacing: 0;
                    border: 2px solid var(--olive);
                    border-radius: 8px;
                }
                .bc-pnrbox td { text-align: center; padding: 10px 6px 10px; }
                .bc-tile {
                    width: 44px !important;
                    margin: 0 auto;
                    border-collapse: separate !important;
                }
                .bc-tile td {
                    width: 44px; height: 44px; padding: 0 !important;
                    background: #e11b2b; color: #fff; font-weight: 800; font-size: 15px;
                    border-radius: 9px; text-align: center; vertical-align: middle;
                }
                .bc-tile img { width: 44px; height: 44px; display: block; }
                .bc-pnr { font-size: 20px; font-weight: 800; letter-spacing: -0.01em; padding-top: 10px !important; }
                .bc-route { width: 38%; text-align: right; padding-top: 24px; font-size: 16px; font-weight: 500; line-height: 1.6; }
                .bc-route .refund { color: var(--green); font-weight: 600; }
                .bc-contact { padding-top: 4px; font-size: 13.5px; line-height: 1.7; }
                .bc-date { text-align: right; vertical-align: top; padding-top: 18px; font-size: 13.5px; }

                /* Section cards */
                table.bc-sec {
                    border-collapse: separate !important;
                    border-spacing: 0;
                    border: 1px solid var(--rule);
                    border-radius: 7px;
                    overflow: hidden;
                    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
                    margin-top: 18px;
                }
                .bc-sec-head {
                    background: var(--olive);
                    color: #fff;
                    padding: 8px 12px;
                    font-size: 13.5px;
                    text-transform: uppercase;
                }
                .bc-sec-body { padding: 0; }

                /* Grids */
                .bc-grid td {
                    text-align: center;
                    vertical-align: middle;
                    padding: 10px 8px;
                    font-size: 13px;
                    border-left: 1px solid var(--rule);
                }
                .bc-grid td:first-child { border-left: none; }
                .bc-grid td.h {
                    background: var(--head-bg);
                    font-weight: 700;
                    border-left: 1px solid #fff;
                }
                .bc-grid td.h:first-child { border-left: none; }
                .bc-grid td.l { text-align: left; padding-left: 10px; }

                /* Fare + payment */
                .bc-two { border-collapse: separate !important; border-spacing: 0; }
                .bc-two > tbody > tr > td { width: 50%; vertical-align: top; padding: 0; }
                .bc-two > tbody > tr > td:first-child { padding-right: 3px; }
                .bc-two > tbody > tr > td:last-child { padding-left: 3px; }
                .bc-two table.bc-sec { margin-top: 0; }
                .bc-kv td { padding: 2px 10px; font-size: 13px; vertical-align: top; }
                .bc-kv td.k { width: 55%; }
                .bc-two .bc-sec-body { padding: 4px 0 4px; }

                /* Notes */
                .bc-note-red { color: var(--red); font-size: 14px; padding-top: 14px; }
                .bc-note { font-size: 12.5px; padding-top: 14px; line-height: 1.4; }
                .bc-note .red { color: var(--red); font-weight: 700; }
                .bc-tips { color: var(--olive); font-weight: 700; font-size: 17px; padding-top: 26px; }

                /* Steps */
                .bc-steps td { width: 20%; vertical-align: top; padding-right: 10px; }
                .bc-step-ico { font-size: 34px; line-height: 1; padding-bottom: 10px; }
                .bc-step-t { font-weight: 700; font-size: 14px; line-height: 1.3; }
                .bc-step-d { font-size: 11.5px; line-height: 1.45; padding-top: 2px; }

                /* Terms */
                .bc-terms { background: #e3e7ee; margin-top: 20px; }
                .bc-terms td { padding: 0 16px; font-size: 13px; line-height: 1.6; }
                .bc-terms td.bc-h { padding-top: 14px; font-size: 17px; font-weight: 500; }
                .bc-terms tr:last-child td { padding-bottom: 14px; }
                .bc-terms a { color: var(--link); }

                /* Dangerous goods */
                .bc-danger { background: #fde3d3; margin-top: 20px; }
                .bc-danger > tbody > tr > td { padding: 12px 16px 10px; }
                .bc-danger .bc-h { font-size: 17px; font-weight: 500; }
                .bc-danger .bc-d { font-size: 13px; line-height: 1.45; padding-top: 2px; }
                .bc-dg { border-collapse: separate !important; border-spacing: 8px; margin: 6px -8px -8px; width: calc(100% + 16px) !important; }
                .bc-dg td { background: #fff; width: 33.33%; height: 46px; padding: 6px 10px; font-size: 13px; vertical-align: middle; font-weight: 600; }
                .bc-dg .ic { font-size: 20px; width: 34px; padding-right: 8px; }

                /* Footer */
                .bc-foot { margin-top: 34px; border-top: 1px solid #bbb; border-bottom: 1px solid #bbb; }
                .bc-foot > tbody > tr > td { padding: 12px 6px; vertical-align: middle; }
                .bc-foot table { width: auto; }
                .bc-foot .ci {
                    width: 30px; height: 30px; background: var(--olive); color: #fff;
                    border-radius: 50%; text-align: center; font-size: 14px; padding: 0 !important;
                }
                .bc-foot .ct { padding-left: 8px; font-size: 12px; white-space: nowrap; font-weight: 600 }

                @media (max-width: 640px) {
                    .bc-page > tbody > tr > td { padding: 0 14px 28px; }
                    .bc-title { font-size: 18px; }
                    .bc-name { font-size: 14px; }
                    .bc-route { font-size: 12px; }
                    .bc-contact, .bc-date { font-size: 11px; }
                    .bc-pnrbox { width: 90px !important; }
                    .bc-pnr { font-size: 17px; }
                    .bc-grid td, .bc-kv td { font-size: 10px; padding: 6px 3px; }
                    .bc-sec-head { font-size: 11px; }
                    .bc-step-t { font-size: 11px; }
                    .bc-step-d { font-size: 9px; }
                    .bc-dg td { font-size: 10px; padding: 4px 6px; }
                    .bc-foot .ct { font-size: 9px; white-space: normal; }
                }

                @media print {
                    .bc-page .bc-topbar, .bc-sec-head, .bc-grid td.h, .bc-terms, .bc-danger, .bc-dg td, .bc-tile td, .bc-foot .ci {
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    table.bc-sec { box-shadow: none; }
                }
            `}</style>

            <table className="bc-page">
                <tbody>
                    <tr>
                        <td className="bc-topbar"></td>
                    </tr>
                    <tr>
                        <td>
                            {/* ===== TITLE + LOGO ===== */}
                            <table>
                                <tbody>
                                    <tr>
                                        <td className="bc-title">Booking Confirmation</td>
                                        <td className="bc-brand">
                                            <img src={d.logo} alt={d.brand} />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            {/* ===== NAME / PNR BOX / ROUTE ===== */}
                            <table className="bc-id">
                                <tbody>
                                    <tr>
                                        <td className="bc-name"><strong>{d.passengerName}</strong></td>
                                        <td className="bc-pnrcell">
                                            <table className="bc-pnrbox">
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            <table className="bc-tile">
                                                                <tbody>
                                                                    <tr>
                                                                        <td>
                                                                            {d.airlineLogo ? <img src={d.airlineLogo} alt={d.airlineCode} /> : d.airlineCode}
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="bc-pnr">{d.pnr}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                        <td className="bc-route">
                                            {d.route}
                                            <br />
                                            {d.tripType}
                                            <br />
                                            <b className="refund">{d.fareType}</b>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="bc-contact">
                                            Mobile No : {d.mobile}
                                            <br />
                                            Email – {d.email}
                                        </td>
                                        <td></td>
                                        <td className="bc-date">{d.travelLine}</td>
                                    </tr>
                                </tbody>
                            </table>

                            {/* ===== BOOKING DETAILS ===== */}
                            <Section title="Booking Details">
                                <table className="bc-grid">
                                    <tbody>
                                        <tr>
                                            <td className="h" style={{ width: "21%", borderBottom: "1px solid var(--rule)" }}>Booking Reference</td>
                                            <td className="h" style={{ width: "11%", borderBottom: "1px solid var(--rule)" }}>PNR</td>
                                            <td className="h" style={{ width: "16%", borderBottom: "1px solid var(--rule)" }}>Booking Status</td>
                                            <td className="h" style={{ width: "19%", borderBottom: "1px solid var(--rule)" }}>Date of Booking</td>
                                            <td className="h" style={{ width: "18%", borderBottom: "1px solid var(--rule)" }}>Payment Status</td>
                                            <td className="h" style={{ width: "15%", borderBottom: "1px solid var(--rule)" }}>Promo Code</td>
                                        </tr>
                                        <tr>
                                            <td>{d.booking.reference}</td>
                                            <td>{d.booking.pnr}</td>
                                            <td>{d.booking.status}</td>
                                            <td>{d.booking.date}</td>
                                            <td>{d.booking.paymentStatus}</td>
                                            <td>{d.booking.promo}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </Section>

                            {/* ===== FLIGHT DETAILS ===== */}
                            <Section title="Flight Details">
                                <table className="bc-grid">
                                    <tbody>
                                        <tr>
                                            <td className="h" style={{ width: "8%", borderBottom: "1px solid var(--rule)" }}>Flight</td>
                                            <td className="h" style={{ width: "20%", borderBottom: "1px solid var(--rule)" }}>From</td>
                                            <td className="h" style={{ width: "15%", borderBottom: "1px solid var(--rule)" }}>To</td>
                                            <td className="h" style={{ width: "7%", borderBottom: "1px solid var(--rule)" }}>Stops</td>
                                            <td className="h" style={{ width: "16%", borderBottom: "1px solid var(--rule)" }}>Departure Date</td>
                                            <td className="h" style={{ width: "8%", borderBottom: "1px solid var(--rule)" }}>Departs</td>
                                            <td className="h" style={{ width: "15%", borderBottom: "1px solid var(--rule)" }}>Arrival Date</td>
                                            <td className="h" style={{ width: "11%", borderBottom: "1px solid var(--rule)" }}>Arrives</td>
                                        </tr>
                                        {d.flights.map((f, i) => (
                                            <tr key={i}>
                                                <td>{f.flight}</td>
                                                <td>{f.from}</td>
                                                <td>{f.to}</td>
                                                <td>{f.stops}</td>
                                                <td>{f.depDate}</td>
                                                <td>{f.departs}</td>
                                                <td>{f.arrDate}</td>
                                                <td>{f.arrives}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </Section>

                            <table>
                                <tbody>
                                    <tr>
                                        <td className="bc-note-red">Check-in counters close 60 minutes prior to departure.</td>
                                    </tr>
                                </tbody>
                            </table>

                            {/* ===== PASSENGER DETAILS ===== */}
                            <Section title="Passenger Details">
                                <table className="bc-grid">
                                    <tbody>
                                        <tr>
                                            <td className="h" style={{ width: "25%", borderBottom: "1px solid var(--rule)" }}>Passenger Name</td>
                                            <td className="h" style={{ width: "10%", borderBottom: "1px solid var(--rule)" }}>Type</td>
                                            <td className="h" style={{ width: "42%", borderBottom: "1px solid var(--rule)" }}>Baggage Allowance (Per pax)</td>
                                            <td className="h" style={{ width: "23%", borderBottom: "1px solid var(--rule)" }}>Ticket Number</td>
                                        </tr>
                                        {d.passengers.map((p, i) => (
                                            <tr key={i}>
                                                <td className="l">{i + 1}. {p.name}</td>
                                                <td>{p.type}</td>
                                                <td>
                                                    <b>Check-In</b>: {p.checkIn}, <b>Cabin</b>: {p.cabin}
                                                </td>
                                                <td>{p.ticketNo}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </Section>

                            <table>
                                <tbody>
                                    <tr>
                                        <td className="bc-note">
                                            ✈️ <b className="red">Web check-in is mandatory</b> and must be completed{" "}
                                            <b className="red">at least 24 hours before departure.</b> Please make sure to check in online to avoid any issues at the airport.
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            {/* ===== SSR DETAILS ===== */}
                            <Section title="SSR Details">
                                <table className="bc-grid">
                                    <tbody>
                                        <tr>
                                            <td className="h" style={{ width: "37%", borderBottom: "1px solid var(--rule)" }}>Passenger Name</td>
                                            <td className="h" style={{ width: "15%", borderBottom: "1px solid var(--rule)" }}>Meals</td>
                                            <td className="h" style={{ width: "13%", borderBottom: "1px solid var(--rule)" }}>Seat</td>
                                            <td className="h" style={{ width: "35%", borderBottom: "1px solid var(--rule)" }}>Add On Baggage</td>
                                        </tr>
                                        {d.ssr.map((s, i) => (
                                            <tr key={i}>
                                                <td className="l">
                                                    <b>{i + 1}.</b> {s.name}
                                                </td>
                                                <td>{s.meals}</td>
                                                <td>{s.seat}</td>
                                                <td>{s.baggage}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </Section>

                            {/* ===== FARE SUMMARY + PAYMENT SUMMARY ===== */}
                            <table className="bc-two" style={{ marginTop: "18px" }}>
                                <tbody>
                                    <tr>
                                        <td>
                                            <Section title="Fare Summary">
                                                <KV rows={d.fare} />
                                            </Section>
                                        </td>
                                        <td>
                                            <Section title="Payment Summary">
                                                <KV rows={d.payment} />
                                            </Section>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            {/* ===== TRAVEL TIPS ===== */}
                            <table>
                                <tbody>
                                    <tr>
                                        <td className="bc-tips">Travel Tips:</td>
                                    </tr>
                                </tbody>
                            </table>

                            <table className="bc-steps">
                                <tbody>
                                    <tr>
                                        {d.steps.map((s) => (
                                            <td key={s.title}>
                                                <table>
                                                    <tbody>
                                                        <tr>
                                                            <td className="bc-step-ico"><img style={{ width: "3rem" }} src={s.icon} alt="" /> </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="bc-step-t" style={{ width: "auto" }}>{s.title}</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="bc-step-d" style={{ width: "auto" }}>{s.text}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        ))}
                                    </tr>
                                </tbody>
                            </table>

                            {/* ===== TERMS ===== */}
                            <table className="bc-terms">
                                <tbody>
                                    <tr>
                                        <td className="bc-h">Terms and Conditions</td>
                                    </tr>
                                    {d.terms.map((t, i) => (
                                        <tr key={i}>
                                            <td className="bc-t">
                                                {i + 1}. {t.pre} <a href={t.href}>Click here</a>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* ===== DANGEROUS GOODS ===== */}
                            <table className="bc-danger">
                                <tbody>
                                    <tr>
                                        <td>
                                            <table>
                                                <tbody>
                                                    <tr>
                                                        <td className="bc-h">Dangerous goods &amp; restricted articles</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="bc-d">
                                                            Do not carry dangerous goods in your baggage or on your person. For more information regarding dangerous goods in baggage, please contact the Airline Care Centre
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <table className="bc-dg">
                                                <tbody>
                                                    {Array.from({ length: Math.ceil(d.dangerous.length / 3) }).map((_, r) => (
                                                        <tr key={r}>
                                                            {d.dangerous.slice(r * 3, r * 3 + 3).map((g) => (
                                                                <td key={g.text}>
                                                                    <table>
                                                                        <tbody>
                                                                            <tr>
                                                                                <td className="ic" style={{ width: "34px", height: "auto", padding: "0 8px 0 0", background: "transparent" }}>
                                                                                    <img style={{ width: "2rem" }} src={g.icon} alt="" />
                                                                                </td>

                                                                                <td style={{ height: "auto", padding: 0, background: "transparent", width: "auto" }}>{g.text}</td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </td>
                                                            ))}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            {/* ===== FOOTER ===== */}
                            <table className="bc-foot">
                                <tbody>
                                    <tr>
                                        <td>
                                            <table>
                                                <tbody>
                                                    <tr>
                                                        <td className="ci">🌐</td>
                                                        <td className="ct">{d.website}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                        <td>
                                            <table>
                                                <tbody>
                                                    <tr>
                                                        <td className="ci">✆</td>
                                                        <td className="ct">{d.phone}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                        <td>
                                            <table>
                                                <tbody>
                                                    <tr>
                                                        <td className="ci">✉</td>
                                                        <td className="ct">{d.supportEmail}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table>
        </>
    );
};