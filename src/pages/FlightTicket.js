export const FlightTicket = () => {
    // ---- Design tokens ----
    const colors = {
        ink: "#1f2937",
        text: "#000",
        line: "#e3e3e3",
        boxLine: "#e6e6e6",
        navy: "var(--blue-secondary-color, #13355e)",
        green: "#1a8f3c",
        paper: "#ffffff",
        mist: "#fafafa",
    };

    const font = "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

    // ---- Data ----
    const booking = {
        agencyName: "My Cheap Tickets",
        address: "15A, Kamal Darshan, Plot No. 188, Road No. 28A, SION EAST, MUMBAI (INDIA)",
        mobile: "+91 98765 43210",
        email: "support@mycheaptickets.com",
        status: "Ticketed",
        pnr: "PYK7FZ",
        issueDate: "Wed, 26 Aug 2026, 13:15",
        customerMobile: "+91 98765 00000",
        customerEmail: "customer@example.com",
        bookingNumber: "FLYB7LFV3",
        fareType: "Refundable",
        payable: "INR 30000",
    };

    const passengers = [
        { name: "John Doe", type: "Adult", bag: "7 KG / 15 KG", meal: "Veg", seat: "14A", ticketNo: "PYK7FZFV31", retTicketNo: "PYK7FZFV41" },
        { name: "Jane Doe", type: "Adult", bag: "7 KG / 15 KG", meal: "Non-veg", seat: "14B", ticketNo: "PYK7FZFV32", retTicketNo: "PYK7FZFV42" },
    ];

    // One object per journey. "Onward" and "Return" each render their own Booking Summary box.
    const journeys = [
        {
            title: "Onward",
            segments: [
                {
                    airlineCode: "6E",
                    flightNo: "6E-6442",
                    airline: "IndiGo",
                    from: { city: "Dibrugarh", code: "DIB", date: "Thu, 27 Aug 2026", time: "15:35", terminal: "1" },
                    to: { city: "Guwahati", code: "GAU", date: "Thu, 27 Aug 2026", time: "16:40", terminal: "2" },
                    cls: "Economy",
                    airlineRef: "PYK7FZ",
                    status: "Confirmed",
                    duration: "01h 05m",
                }
            ],
        },
        {
            title: "Return",
            segments: [
                {
                    airlineCode: "6E",
                    flightNo: "6E-6443",
                    airline: "IndiGo",
                    from: { city: "Guwahati", code: "GAU", date: "Thu, 3 Sep 2026", time: "14:40", terminal: "2" },
                    to: { city: "Dibrugarh", code: "DIB", date: "Thu, 3 Sep 2026", time: "15:45", terminal: "1" },
                    cls: "Economy",
                    airlineRef: "PYK7FZ",
                    status: "Confirmed",
                    duration: "01h 05m",
                },
            ],
        },
    ];

    const terms = [
        "Web check-in is mandatory and closes 60 minutes before departure.",
        "Carry a valid government-issued photo ID for verification at the airport.",
        "Reconfirm your flight status and terminal 24 hours before travel, as these can change.",
        "Arrive at least 2 hours before a domestic departure to allow time for check-in and security.",
        "Changes within 24 hours of departure must be made directly with the airline.",
        "Power banks are allowed only in hand baggage, not in checked baggage.",
    ];

    // ---- Reusable styles ----
    const pageTable = {
        width: "800px",
        maxWidth: "95%",
        marginInline: "auto",
        marginTop: "3rem",
        marginBottom: "3rem",
        background: colors.paper,
        border: `1px solid ${colors.line}`,
        borderCollapse: "collapse",
        fontFamily: font,
        color: colors.text,
        fontSize: "12px",
        lineHeight: 1.5,
        boxSizing: "border-box",
    };

    const fullTable = { width: "100%", borderCollapse: "collapse" };

    const boxTable = {
        width: "100%",
        borderCollapse: "collapse",
        border: `1px solid ${colors.boxLine}`,
        background: colors.paper,
    };

    const boxTitle = {
        padding: "14px 16px 12px",
        fontSize: "13px",
        fontWeight: 600,
        color: colors.ink,
    };

    const th = {
        textAlign: "left",
        verticalAlign: "top",
        padding: "8px 8px 8px 0",
        fontSize: "11.5px",
        fontWeight: 600,
        borderTop: `1px solid ${colors.line}`,
        borderBottom: `1px solid ${colors.line}`,
        background: colors.mist,
    };

    const td = {
        textAlign: "left",
        verticalAlign: "top",
        padding: "10px 8px 10px 0",
        fontSize: "11.5px",
    };

    // Bordered card: title row + content row, all table cells.
    const Box = ({ title, marginTop, minHeight, children }) => (
        <table style={{ ...boxTable, marginTop }} cellPadding={0} cellSpacing={0}>
            <tbody>
                <tr>
                    <td style={boxTitle}>{title}</td>
                </tr>
                <tr>
                    <td style={{ padding: "0 16px 18px", height: minHeight, verticalAlign: "top" }}>{children}</td>
                </tr>
            </tbody>
        </table>
    );

    const AirlineLogo = ({ code }) => (
        <table style={{ borderCollapse: "collapse", marginBottom: "4px" }} cellPadding={0} cellSpacing={0}>
            <tbody>
                <tr>
                    <td
                        style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "6px",
                            background: "#1b2a8a",
                            color: "#fff",
                            fontSize: "13px",
                            fontWeight: 700,
                            textAlign: "center",
                            verticalAlign: "middle",
                            letterSpacing: "0.02em",
                        }}
                    >
                        {code}
                    </td>
                </tr>
            </tbody>
        </table>
    );

    return (
        <table style={pageTable} cellPadding={0} cellSpacing={0}>
            <tbody>
                <tr>
                    <td style={{ padding: "28px 30px 36px" }}>
                        <table>
                            <tbody>
                                <tr>
                                    <td className="agency-logo" style={{ paddingBottom: "10px" }}>
                                        <img
                                            src="/images/COlgfJcjQfjCUywmAAiIwIAxQnnk1YYYP4j3NGUu.png"
                                            style={{ height: "2.4rem" }}
                                            alt=""
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        {/* ===== HEADER ===== */}
                        <table style={fullTable} cellPadding={0} cellSpacing={0}>
                            <tbody>
                                <tr>
                                    {/* Agency */}
                                    <td style={{ width: "38%", verticalAlign: "top", textAlign: "left", paddingRight: "12px" }}>
                                        <table style={fullTable} cellPadding={0} cellSpacing={0}>
                                            <tbody>
                                                <tr>
                                                    <td style={{ fontSize: "11px", lineHeight: 1.6 }}>
                                                        <b>Agency Name:</b> {booking.agencyName}
                                                        <br />
                                                        <b>Address:</b> {booking.address}
                                                        <br />
                                                        <b>Mobile No:</b> {booking.mobile}
                                                        <br />
                                                        <b>Email:</b> {booking.email}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>

                                    {/* Title */}
                                    <td style={{ width: "24%", verticalAlign: "top", textAlign: "center", paddingTop: "22px" }}>
                                        <table style={fullTable} cellPadding={0} cellSpacing={0}>
                                            <tbody>
                                                <tr>
                                                    <td style={{ textAlign: "center", fontSize: "20px", fontWeight: 700, color: colors.navy, lineHeight: 1.2 }}>
                                                        E-Ticket
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style={{ textAlign: "center", paddingTop: "6px" }}>
                                                        <table style={{ borderCollapse: "collapse", marginInline: "auto" }} cellPadding={0} cellSpacing={0}>
                                                            <tbody>
                                                                <tr>
                                                                    <td
                                                                        style={{
                                                                            padding: "1px 8px",
                                                                            border: `1px solid ${colors.green}`,
                                                                            fontSize: "10px",
                                                                            color: colors.text,
                                                                        }}
                                                                    >
                                                                        {booking.status}
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>

                                    {/* Booking meta */}
                                    <td style={{ width: "38%", verticalAlign: "top", textAlign: "right", paddingLeft: "12px", fontSize: "11px", lineHeight: 1.7 }}>
                                        <b>PNR:</b> {booking.pnr}
                                        <br />
                                        <b>Issue Date:</b> {booking.issueDate}
                                        <br />
                                        <b>Customer Mb No:</b> {booking.customerMobile}
                                        <br />
                                        <b>Customer Email:</b> {booking.customerEmail}
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        {/* ===== BOOKING NUMBER ROW ===== */}
                        <table style={{ ...fullTable, marginTop: "18px", borderTop: `1px solid ${colors.line}`, borderBottom: `1px solid ${colors.line}` }} cellPadding={0} cellSpacing={0}>
                            <tbody>
                                <tr>
                                    <td style={{ width: "36%", padding: "9px 0", fontSize: "11.5px", fontWeight: 600, textAlign: "left" }}>
                                        Booking Number: {booking.bookingNumber}
                                    </td>
                                    <td style={{ width: "30%", padding: "9px 0", fontSize: "11.5px", fontWeight: 600, textAlign: "left" }}>
                                        PNR: {booking.pnr}
                                    </td>
                                    <td style={{ width: "34%", padding: "9px 0", fontSize: "11.5px", fontWeight: 600, textAlign: "right" }}>
                                        Fare Type: {booking.fareType}
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        {/* ===== PASSENGER INFORMATION ===== */}
                        <Box title="Passenger Information" marginTop="22px">
                            <table style={fullTable} cellPadding={0} cellSpacing={0}>
                                <tbody>
                                    <tr>
                                        <td style={{ ...th, paddingLeft: "8px", width: "17%" }}>Passenger Name</td>
                                        <td style={{ ...th, width: "9%" }}>Type</td>
                                        <td style={{ ...th, width: "15%" }}>Baggage</td>
                                        <td style={{ ...th, width: "10%" }}>Meals</td>
                                        <td style={{ ...th, width: "8%" }}>Seat</td>
                                        <td style={{ ...th, width: "20%" }}>Ticket Number</td>
                                        <td style={{ ...th, width: "21%" }}>Ret Ticket Number</td>
                                    </tr>
                                    {passengers.map((p, i) => {
                                        const cell = { ...td, borderTop: i === 0 ? "none" : `1px solid ${colors.line}` };
                                        return (
                                            <tr key={i}>
                                                <td style={{ ...cell, paddingLeft: "8px" }}>{p.name}</td>
                                                <td style={cell}>{p.type}</td>
                                                <td style={cell}>{p.bag}</td>
                                                <td style={cell}>{p.meal}</td>
                                                <td style={cell}>{p.seat}</td>
                                                <td style={cell}>{p.ticketNo}</td>
                                                <td style={cell}>{p.retTicketNo || "-"}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </Box>

                        {/* ===== BOOKING SUMMARY (ONWARD / RETURN) ===== */}
                        {journeys.map((j) => (
                            <Box key={j.title} title={`Booking Summary ${j.title}`} marginTop="18px">
                                <table style={fullTable} cellPadding={0} cellSpacing={0}>
                                    <tbody>
                                        <tr>
                                            <td style={{ ...th, paddingLeft: "8px", width: "20%" }}>Flight Details</td>
                                            <td style={{ ...th, width: "27%" }}>Departure</td>
                                            <td style={{ ...th, width: "27%" }}>Arrival</td>
                                            <td style={{ ...th, width: "26%" }}>Status</td>
                                        </tr>
                                        {j.segments.map((s, i) =>
                                            s.layover ? (
                                                <tr key={i}>
                                                    <td
                                                        colSpan={4}
                                                        style={{
                                                            padding: "6px 8px",
                                                            textAlign: "center",
                                                            fontSize: "11px",
                                                            fontStyle: "italic",
                                                            background: colors.mist,
                                                            borderTop: `1px dashed ${colors.line}`,
                                                            borderBottom: `1px dashed ${colors.line}`,
                                                        }}
                                                    >
                                                        {s.layover}
                                                    </td>
                                                </tr>
                                            ) : (
                                                <tr key={i}>
                                                    <td style={{ ...td, paddingLeft: "8px" }}>
                                                        <AirlineLogo code={s.airlineCode} />
                                                        <b style={{ fontSize: "11px" }}>{s.flightNo}</b>
                                                        <br />
                                                        {s.airline}
                                                    </td>
                                                    <td style={td}>
                                                        <b>{s.from.city},{s.from.code}</b>
                                                        <br />
                                                        {s.from.date}, {s.from.time}hr
                                                        <br />
                                                        Class: {s.cls}
                                                        <br />
                                                        Dep. Terminal : {s.from.terminal}
                                                    </td>
                                                    <td style={td}>
                                                        <b>{s.to.city},{s.to.code}</b>
                                                        <br />
                                                        {s.to.date}, {s.to.time}hr
                                                        <br />
                                                        Class: {s.cls}
                                                        <br />
                                                        Arr. Terminal : {s.to.terminal}
                                                    </td>
                                                    <td style={td}>
                                                        <b>Airline Ref : </b>
                                                        <b style={{ color: colors.green }}>{s.airlineRef}</b>
                                                        <br />
                                                        <b>Status : </b>
                                                        {s.status}
                                                        <br />
                                                        <b>Duration : </b>
                                                        {s.duration}
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </Box>
                        ))}

                        {/* ===== PAYABLE AMOUNT ===== */}
                        <table style={{ ...fullTable, marginTop: "14px" }} cellPadding={0} cellSpacing={0}>
                            <tbody>
                                <tr>
                                    <td style={{ textAlign: "right", verticalAlign: "middle", padding: "6px 12px 6px 0", fontSize: "12px", fontWeight: 600 }}>
                                        Payable Amount :
                                    </td>
                                    <td style={{ width: "30%", textAlign: "right", verticalAlign: "middle", padding: "6px 16px 6px 0", fontSize: "22px", fontWeight: 700, color: colors.navy, whiteSpace: "nowrap" }}>
                                        {booking.payable}
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        {/* ===== IMPORTANT INFORMATION ===== */}
                        <Box title="Important Information" marginTop="18px" minHeight="140px">
                            <table style={fullTable} cellPadding={0} cellSpacing={0}>
                                <tbody>
                                    {terms.map((t, i) => (
                                        <tr key={i}>
                                            <td style={{ width: "16px", verticalAlign: "top", padding: "3px 0", fontSize: "11px", fontWeight: 700 }}>•</td>
                                            <td style={{ padding: "3px 0", fontSize: "11px", lineHeight: 1.5 }}>{t}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </Box>
                    </td>
                </tr>
            </tbody>
        </table>
    );
};