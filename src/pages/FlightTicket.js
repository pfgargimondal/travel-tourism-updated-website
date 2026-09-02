export const FlightTicket = () => {
    // ---- Design tokens ----
    const colors = {
        ink: "#111827",
        subtle: "#6b7280",
        line: "#e5e7eb",
        navy: "#0b2545",
        navySoft: "#13355e",
        paper: "#ffffff",
        mist: "#f7f8fa",
        accent: "#2f6fed",
        accentSoft: "#eaf1ff",
        good: "#0f7a4a",
        goodSoft: "#e7f6ee",
    };

    const font = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
    const mono = "'SF Mono', 'Roboto Mono', Menlo, Consolas, monospace";

    const segments = [
        {
            flightNo: "6E 6442",
            aircraft: "Airbus A320",
            fareClass: "Economy · Refundable",
            from: { code: "DIB", city: "Dibrugarh", time: "15:35", date: "27 Aug", terminal: "1" },
            to: { code: "GAU", city: "Guwahati", time: "16:40", date: "27 Aug", terminal: "2" },
            duration: "1h 05m",
        },
        { layover: "4h 20m layover in Guwahati · change terminals" },
        {
            flightNo: "6E 5066",
            aircraft: "Airbus A321",
            fareClass: "Economy · Refundable",
            from: { code: "GAU", city: "Guwahati", time: "21:00", date: "27 Aug", terminal: "2" },
            to: { code: "BOM", city: "Mumbai", time: "00:20", date: "28 Aug", terminal: "1" },
            duration: "3h 20m",
        },
    ];

    const passengers = [
        { name: "John Doe", type: "Adult", ticketNo: "PYK7FZFV31", seat: "14A", meal: "Veg", bag: "7 KG / 15 KG" },
        { name: "Jane Doe", type: "Adult", ticketNo: "PYK7FZFV32", seat: "14B", meal: "Non-veg", bag: "7 KG / 15 KG" },
    ];

    const terms = [
        "Web check-in is mandatory and closes 60 minutes before departure.",
        "Carry a valid government-issued photo ID for verification at the airport.",
        "Reconfirm your flight status and terminal 24 hours before travel, as these can change.",
        "Arrive at least 2 hours before a domestic departure to allow time for check-in and security.",
        "Changes within 24 hours of departure must be made directly with the airline.",
        "Power banks are allowed only in hand baggage, not in checked baggage.",
    ];

    // ---- Reusable style objects ----
    const card = {
        width: "720px",
        maxWidth: "95%",
        marginInline: "auto",
        marginTop: "4rem",
        marginBottom: "3rem",
        background: colors.paper,
        borderRadius: "16px",
        border: `1px solid ${colors.line}`,
        boxShadow: "0 1px 2px rgba(16,24,40,0.04), 0 8px 24px rgba(16,24,40,0.06)",
        overflow: "hidden",
        fontFamily: font,
        color: colors.ink,
    };

    const section = { padding: "28px 32px" };

    const label = {
        fontSize: "11px",
        letterSpacing: "0.04em",
        color: colors.subtle,
        marginBottom: "4px",
    };

    const value = { fontSize: "14px", fontWeight: 500, color: colors.ink };

    const pill = {
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "4px 10px",
        borderRadius: "999px",
        background: colors.goodSoft,
        color: colors.good,
        fontSize: "12px",
        fontWeight: 600,
    };

    const PlaneIcon = ({ size = 18, color = colors.accent }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ display: "block" }}>
            <path
                d="M21 15.5v-2l-8-5V4.5a1.5 1.5 0 0 0-3 0v4l-8 5v2l8-2.5V17l-2.5 2v1.5l3.5-1 3.5 1V19l-2.5-2v-4.5l8 2.5Z"
                fill={color}
            />
        </svg>
    );

    return (
        <div style={card}>
            {/* HEADER */}
            <div
                style={{
                    background: "#fff",
                    padding: "24px 32px",
                    color: "#000",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: `1px solid ${colors.line}`
                }}
            >
                <div>
                    <div style={{ fontSize: "12px", letterSpacing: "0.06em", fontWeight: 600, color: "#000", marginBottom: "4px" }}>
                        E-TICKET
                    </div>
                    <div style={{ fontSize: "20px", fontWeight: 600 }}>IndiGo</div>
                </div>

                <div className="agency-logo">
                    <img src="/images/COlgfJcjQfjCUywmAAiIwIAxQnnk1YYYP4j3NGUu.png" style={{ height: "2rem" }} alt="" />
                </div>

                <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "12px", fontWeight: 600, color: "#000", marginBottom: "2px" }}>PNR</div>
                    <div style={{ fontFamily: mono, fontSize: "18px", fontWeight: 600, letterSpacing: "0.06em" }}>
                        PYK7FZ
                    </div>
                </div>
            </div>

            {/* AGENCY + BOOKING META */}
            <div
                style={{
                    ...section,
                    paddingTop: "20px",
                    paddingBottom: "20px",
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "24px",
                    borderBottom: `1px solid ${colors.line}`,
                    flexWrap: "wrap",
                }}
            >
                <div>
                    <div style={value}>My Cheap Tickets</div>
                    <div style={{ fontSize: "13px", color: colors.subtle, marginTop: "2px" }}>
                        15A, Kamal Darshan, Plot No. 188, <br /> Road No. 28A, SION EAST, MUMBAI (INDIA)
                    </div>
                </div>
                <div style={{ display: "flex", gap: "28px" }}>
                    <div>
                        <div style={label}>BOOKING ID</div>
                        <div style={{ ...value, fontFamily: mono }}>FLYB7LFV3</div>
                    </div>
                    <div>
                        <div style={label}>ISSUED</div>
                        <div style={value}>26 Aug 2026</div>
                    </div>
                    <div>
                        <div style={label}>STATUS</div>
                        <span style={pill}>
                            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: colors.good }} />
                            Confirmed
                        </span>
                    </div>
                </div>
            </div>

            {/* ITINERARY */}
            <div style={section}>
                <div style={{ ...label, marginBottom: "16px" }}>ITINERARY</div>

                {segments.map((seg, i) =>
                    seg.layover ? (
                        <div
                            key={i}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                                margin: "14px 0",
                                fontSize: "12px",
                                color: colors.subtle,
                            }}
                        >
                            <div style={{ flex: 1, borderTop: `1px dashed ${colors.line}` }} />
                            <span>{seg.layover}</span>
                            <div style={{ flex: 1, borderTop: `1px dashed ${colors.line}` }} />
                        </div>
                    ) : (
                        <div
                            key={i}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "18px",
                                padding: "16px",
                                background: colors.mist,
                                borderRadius: "12px",
                                marginBottom: "6px",
                            }}
                        >
                            <div style={{ width: "88px" }}>
                                <div style={{ fontSize: "24px", fontWeight: 700, lineHeight: 1 }}>{seg.from.code}</div>
                                <div style={{ fontSize: "12px", color: colors.subtle, marginTop: "4px" }}>{seg.from.city}</div>
                                <div style={{ fontSize: "13px", fontWeight: 500, marginTop: "6px" }}>{seg.from.time}</div>
                                <div style={{ fontSize: "11px", color: colors.subtle }}>{seg.from.date} · T{seg.from.terminal}</div>
                            </div>

                            <div style={{ flex: 1, textAlign: "center" }}>
                                <div style={{ fontSize: "12px", color: colors.subtle, marginBottom: "6px" }}>{seg.duration}</div>
                                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                    <div style={{ flex: 1, height: "1px", background: colors.line }} />
                                    <PlaneIcon />
                                    <div style={{ flex: 1, height: "1px", background: colors.line }} />
                                </div>
                                <div style={{ fontSize: "12px", color: colors.subtle, marginTop: "6px" }}>
                                    {seg.flightNo} · {seg.aircraft}
                                </div>
                                <div style={{ fontSize: "11px", color: colors.accent, marginTop: "2px" }}>{seg.fareClass}</div>
                            </div>

                            <div style={{ width: "88px", textAlign: "right" }}>
                                <div style={{ fontSize: "24px", fontWeight: 700, lineHeight: 1 }}>{seg.to.code}</div>
                                <div style={{ fontSize: "12px", color: colors.subtle, marginTop: "4px" }}>{seg.to.city}</div>
                                <div style={{ fontSize: "13px", fontWeight: 500, marginTop: "6px" }}>{seg.to.time}</div>
                                <div style={{ fontSize: "11px", color: colors.subtle }}>{seg.to.date} · T{seg.to.terminal}</div>
                            </div>
                        </div>
                    )
                )}
            </div>

            {/* PERFORATED DIVIDER */}
            <div style={{ position: "relative", height: "0" }}>
                <div
                    style={{
                        position: "absolute",
                        left: "-10px",
                        top: "-10px",
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        background: "var(--page-bg, #fff)",
                        border: `1px solid ${colors.line}`,
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        right: "-10px",
                        top: "-10px",
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        background: "var(--page-bg, #fff)",
                        border: `1px solid ${colors.line}`,
                    }}
                />
            </div>
            <div style={{ borderTop: `1px dashed ${colors.line}`, margin: "0 24px" }} />

            {/* PASSENGERS */}
            <div style={section}>
                <div style={{ ...label, marginBottom: "12px" }}>PASSENGERS</div>
                <table width="100%" style={{ borderCollapse: "collapse", fontSize: "13px" }}>
                    <thead>
                        <tr style={{ borderBottom: `1px solid ${colors.line}` }}>
                            {["Name", "Ticket No.", "Seat", "Meal", "Baggage"].map((h) => (
                                <th
                                    key={h}
                                    style={{
                                        textAlign: "left",
                                        padding: "0 0 8px",
                                        fontSize: "11px",
                                        color: colors.subtle,
                                        fontWeight: 600,
                                        letterSpacing: "0.03em",
                                    }}
                                >
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {passengers.map((p, i) => (
                            <tr key={i} style={{ borderBottom: i === passengers.length - 1 ? "none" : `1px solid ${colors.line}` }}>
                                <td style={{ padding: "10px 0", fontWeight: 500 }}>{p.name}</td>
                                <td style={{ padding: "10px 0", fontFamily: mono, color: colors.subtle }}>{p.ticketNo}</td>
                                <td style={{ padding: "10px 0" }}>{p.seat}</td>
                                <td style={{ padding: "10px 0" }}>{p.meal}</td>
                                <td style={{ padding: "10px 0", color: colors.subtle }}>{p.bag}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* FARE SUMMARY */}
            <div style={{ ...section, paddingTop: 0 }}>
                <div style={{ ...label, marginBottom: "12px" }}>FARE SUMMARY</div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", padding: "6px 0", color: colors.subtle }}>
                    <span>Base fare</span>
                    <span>₹22,017</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", padding: "6px 0", color: colors.subtle }}>
                    <span>Taxes & fees</span>
                    <span>₹7,983</span>
                </div>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: "10px",
                        padding: "14px 16px",
                        borderRadius: "10px",
                        background: colors.navy,
                        color: "#fff",
                    }}
                >
                    <span style={{ fontSize: "13px", fontWeight: 500 }}>Total fare</span>
                    <span style={{ fontSize: "20px", fontWeight: 700 }}>₹30,000</span>
                </div>
            </div>

            {/* IMPORTANT INFORMATION */}
            <div style={{ ...section, paddingTop: 0 }}>
                <div style={{ ...label, marginBottom: "10px" }}>GOOD TO KNOW</div>
                <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                    {terms.map((t, i) => (
                        <li
                            key={i}
                            style={{
                                display: "flex",
                                gap: "10px",
                                fontSize: "12.5px",
                                color: colors.subtle,
                                padding: "6px 0",
                                lineHeight: 1.5,
                            }}
                        >
                            <span style={{ color: colors.accent, fontWeight: 700 }}>·</span>
                            <span>{t}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* FOOTER */}
            <div
                style={{
                    padding: "16px 32px",
                    borderTop: `1px solid ${colors.line}`,
                    background: colors.mist,
                    textAlign: "center",
                    fontSize: "12px",
                    color: colors.subtle,
                }}
            >
                Need help with this booking? Contact{" "}
                <span style={{ color: colors.accent, fontWeight: 500 }}>support@skylinetravel.example</span> or call +91 98765 43210
            </div>
        </div>
    );
};