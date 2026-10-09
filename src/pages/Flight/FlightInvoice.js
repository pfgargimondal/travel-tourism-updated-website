const defaultData = {
    invoiceNo: "INV-000001",
    date: "09 Oct 2026",
    pnr: "FUOORH",
    billedTo: { name: "Customer name", email: "customer@email.com" },
    items: [
        {
            id: 1,
            title: "Airline fare",
            note: "Includes applicable flight taxes collected on behalf of the airline and other ancillary charges",
            qty: 2,
            baseFare: 20590.0,
        },
        { id: 2, title: "Travel insurance", qty: 1, baseFare: 1234.82 },
        { id: 3, title: "Seat selection", qty: 1, baseFare: 399.0 },
        { id: 4, title: "In-flight meals & beverages", qty: 0, baseFare: 0 },
        { id: 5, title: "Additional baggage charges", qty: 1, baseFare: 699.0 },
        { id: 6, title: "Web check-in service", qty: 0, baseFare: 0 },
        { id: 7, title: "Priority services", qty: 0, baseFare: 0 },
        { id: 8, title: "Special assistance", qty: 0, baseFare: 0 },
        { id: 9, title: "Ground transportation", qty: 0, baseFare: 0 },
    ],
};

const fmt = (n) =>
    n.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });



export const FlightInvoice = ({ data = defaultData }) => {
    const { brand, invoiceNo, date, pnr, billedTo, items } = data;
    const charged = items.filter((i) => i.qty > 0);
    const notAvailed = items.filter((i) => i.qty === 0);
    const total = charged.reduce((s, i) => s + i.qty * i.baseFare, 0);



    return (
        <>
            <style>{`
                .inv-page {
                    --ink: #12263f;
                    --muted: #667589;
                    --rule: #dfe5ec;
                    --tint: #f2f5f9;
                    --accent: #e08a00;
                    --stub: #12263f;
                    --bg: #e9edf2;

                    width: 100%;
                    border-collapse: collapse;
                    background: var(--bg);
                    font-family: "Manrope", "Segoe UI", system-ui, sans-serif;
                    color: var(--ink);
                }
                .inv-page > tbody > tr > td { padding: 32px 16px; }

                .inv-sheet {
                    width: 100%;
                    max-width: 820px;
                    margin: 0 auto;
                    background: #fff;
                    border-collapse: separate;
                    border-spacing: 0;
                    border-radius: 6px;
                    overflow: hidden;
                    box-shadow: 0 10px 30px rgba(18, 38, 63, 0.12);
                }
                .inv-sheet > tbody > tr > td { padding: 0; }

                .inv-inner { width: 100%; border-collapse: collapse; }

                /* Header */
                .inv-head > td {
                    padding: 36px 44px 28px !important;
                    border-bottom: 4px solid var(--accent);
                }
                .inv-head td { vertical-align: bottom; }
                .inv-logo { width: 15rem; max-width: 100%; display: block; }
                .inv-title { text-align: right; }
                .inv-title-text {
                    font-size: 34px;
                    font-weight: 700;
                    line-height: 1;
                }
                main{
                    margin-top: 0;
                }
                .inv-no {
                    padding-top: 6px;
                    color: var(--muted);
                    font-size: 14px;
                    font-variant-numeric: tabular-nums;
                }

                /* Meta */
                .inv-meta-row > td {
                    padding: 28px 44px !important;
                    background: var(--tint);
                }
                .inv-meta td {
                    width: 28%;
                    vertical-align: top;
                    font-size: 14px;
                    line-height: 1.7;
                    padding-right: 24px;
                }
                .inv-meta td:first-child { width: 44%; }
                .inv-meta .sub { color: var(--muted); }
                .inv-label {
                    font-size: 12.5px;
                    font-weight: 600;
                    color: var(--muted);
                }
                .inv-pnr {
                    font-size: 20px;
                    letter-spacing: 0.08em;
                    font-variant-numeric: tabular-nums;
                }

                /* Items */
                .inv-items-row > td { padding: 28px 44px 0 !important; }
                .inv-table { width: 100%; border-collapse: collapse; font-size: 14px; }
                .inv-table th {
                    padding: 10px 8px;
                    text-align: left;
                    font-size: 12.5px;
                    font-weight: 600;
                    color: var(--muted);
                    border-bottom: 2px solid var(--ink);
                }
                .inv-table td {
                    padding: 16px 8px;
                    vertical-align: top;
                    border-bottom: 1px solid var(--rule);
                }
                .inv-table .num {
                    text-align: right;
                    white-space: nowrap;
                    font-variant-numeric: tabular-nums;
                }
                .inv-table .c-sn { width: 48px; color: var(--muted); }
                .inv-table .c-qty { width: 56px; }
                .inv-table .c-amt { width: 120px; }
                .inv-item { display: block; font-weight: 600; }
                .inv-note {
                    display: block;
                    margin-top: 4px;
                    max-width: 400px;
                    font-size: 12.5px;
                    line-height: 1.5;
                    color: var(--muted);
                }
                .inv-skipped-row > td {
                    padding: 14px 44px 32px !important;
                    font-size: 12.5px;
                    line-height: 1.6;
                    color: var(--muted);
                }

                /* Tear-off line */
                .inv-tear { width: 100%; border-collapse: collapse; }
                .inv-tear td { padding: 0; height: 22px; }
                .inv-tear .notch { width: 11px; background: var(--bg); }
                .inv-tear .notch-l { border-radius: 0 11px 11px 0; }
                .inv-tear .notch-r { border-radius: 11px 0 0 11px; }
                .inv-tear .line {
                    height: 11px;
                    border-bottom: 2px dashed #b9c3d0;
                }

                /* Stub */
                .inv-stub-row > td {
                    padding: 30px 44px 34px !important;
                    background: var(--stub);
                    color: #fff;
                }
                .inv-stub td { vertical-align: middle; }
                .inv-stub .inv-label { color: #f3b84a; }
                .inv-thanks {
                    display: block;
                    max-width: 340px;
                    margin-top: 6px;
                    font-size: 13px;
                    line-height: 1.55;
                    color: #fff;
                }
                .inv-total {
                    text-align: right;
                    font-size: 40px;
                    font-weight: 800;
                    letter-spacing: -0.03em;
                    white-space: nowrap;
                    font-variant-numeric: tabular-nums;
                }
                .inv-date{
                    text-align: right;
                    padding-right: 0 !important;
                }
                .inv-total span { margin-right: 4px; color: #f3b84a; font-weight: 600; }

                /* Small screens */
                @media (max-width: 640px) {
                    .inv-head > td { padding: 24px 20px 20px !important; }
                    .inv-meta-row > td { padding: 20px !important; }
                    .inv-items-row > td { padding: 20px 20px 0 !important; }
                    .inv-skipped-row > td { padding: 14px 20px 24px !important; }
                    .inv-stub-row > td { padding: 24px 20px !important; }       
                    .inv-table { font-size: 13px; }
                    .inv-table .c-amt { width: 90px; }
                    .inv-total { font-size: 18px; }
                    .inv-logo {
                        width: 12rem;
                    }
                    .inv-title-text {
                        font-size: 20px;
                    }
                    .inv-no {
                        font-size: 12px;
                    }
                    .inv-pnr {
                        font-size: 16px;
                    }

                    .inv-stub td:first-child {
                        padding-right: 12px;
                    }
                }

                @media (max-width: 424px){
                    .inv-pnr {
                        font-size: 14px;
                    }

                    .inv-label {
                        font-size: 10px;
                    }

                    .inv-meta td {
                        font-size: 10px;
                        padding-right: 10px;
                    }

                    .inv-thanks {
                        font-size: 10px;
                    }

                    .inv-total {
                        font-size: 16px;
                    }

                    .inv-logo {
                        width: 10rem;
                    }
                }

                /* Print */
                @media print {
                    .inv-page, .inv-page > tbody > tr > td { background: #fff; padding: 0; }
                    .inv-sheet { box-shadow: none; border-radius: 0; }
                    .inv-tear .notch { background: #fff; }
                    .inv-stub-row > td,
                    .inv-table thead th {
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                }
            `}</style>

            <table className="inv-page">
                <tbody>
                    <tr>
                        <td>
                            <table className="inv-sheet">
                                <tbody>
                                    {/* Header */}
                                    <tr className="inv-head">
                                        <td>
                                            <table className="inv-inner">
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            <img
                                                                className="inv-logo"
                                                                src="/images/COlgfJcjQfjCUywmAAiIwIAxQnnk1YYYP4j3NGUu.png"
                                                                alt={brand}
                                                            />
                                                        </td>
                                                        <td className="inv-title">
                                                            <div className="inv-title-text">Invoice</div>
                                                            <div className="inv-no">{invoiceNo}</div>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>

                                    {/* Meta */}
                                    <tr className="inv-meta-row">
                                        <td>
                                            <table className="inv-inner inv-meta">
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            <span className="inv-label">Billed to</span>
                                                            <br />
                                                            <strong>{billedTo.name}</strong>
                                                            <br />
                                                            <span className="sub">{billedTo.email}</span>
                                                        </td>
                                                        <td>
                                                            <span className="inv-label">Booking reference (PNR)</span>
                                                            <br />
                                                            <strong className="inv-pnr">{pnr}</strong>
                                                        </td>
                                                        <td className="inv-date">
                                                            <span className="inv-label">Invoice date</span>
                                                            <br />
                                                            <strong>{date}</strong>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>

                                    {/* Items */}
                                    <tr className="inv-items-row">
                                        <td>
                                            <table className="inv-table">
                                                <thead>
                                                    <tr>
                                                        <th className="c-sn">No.</th>
                                                        <th>Description</th>
                                                        <th className="num c-qty">Qty</th>
                                                        <th className="num c-amt">Base fare</th>
                                                        <th className="num c-amt">Total</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {charged.map((r, idx) => (
                                                        <tr key={r.id}>
                                                            <td className="c-sn">{idx + 1}</td>
                                                            <td>
                                                                <span className="inv-item">{r.title}</span>
                                                                {r.note && <span className="inv-note">{r.note}</span>}
                                                            </td>
                                                            <td className="num">{r.qty}</td>
                                                            <td className="num">{fmt(r.baseFare)}</td>
                                                            <td className="num">{fmt(r.qty * r.baseFare)}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>

                                    {/* Not availed */}
                                    {notAvailed.length > 0 && (
                                        <tr className="inv-skipped-row">
                                            <td>
                                                Not availed: {notAvailed.map((i) => i.title).join(", ")}.
                                            </td>
                                        </tr>
                                    )}

                                    {/* Tear-off line */}
                                    <tr>
                                        <td>
                                            <table className="inv-tear">
                                                <tbody>
                                                    <tr>
                                                        <td className="notch notch-l"></td>
                                                        <td className="line"></td>
                                                        <td className="notch notch-r"></td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>

                                    {/* Stub */}
                                    <tr className="inv-stub-row">
                                        <td>
                                            <table className="inv-inner inv-stub">
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            <span className="inv-label">Amount payable (INR)</span>
                                                            <span className="inv-thanks">
                                                                Thank you for booking with {brand}. Keep this
                                                                invoice with your travel documents.
                                                            </span>
                                                        </td>
                                                        <td className="inv-total">
                                                            <span>₹</span>
                                                            {fmt(total)}
                                                        </td>
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
    )
}