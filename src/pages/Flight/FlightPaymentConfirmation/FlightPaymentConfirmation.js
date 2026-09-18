const FLIGHT = {
  originCity: "Kolkata",
  destinationCity: "Mumbai",
  formattedDate: "Thu, Oct 15",
  stops: 0,
  totalDuration: "2h 10m",
  refundable: true,
};
 
const SEGMENTS = [
  {
    airlineName: "IndiGo",
    airlineCode: "6E",
    flightNumber: "6203",
    aircraftType: "Airbus A320",
    departureTime: "09:15",
    arrivalTime: "11:25",
    originCity: "Kolkata (CCU)",
    destinationCity: "Mumbai (BOM)",
    originTerminal: "2",
    destinationTerminal: "1",
    duration: "2h 10m",
  },
];
 // eslint-disable-next-line
const CANCELLATION_ROWS = [
  { label: "48+ hrs before departure", charge: "₹ 3,500" },
  { label: "24–48 hrs before departure", charge: "₹ 4,750" },
  { label: "0–24 hrs before departure", charge: "₹ 5,500" },
];
 // eslint-disable-next-line
const BAGGAGE = {
  cabin: "7 Kgs / Adult",
  checkIn: "15 Kgs / Adult",
};
 // eslint-disable-next-line
const FARE_SUMMARY = {
  baseFare: "₹ 4,200",
  adult: "₹ 4,200 (1 X ₹ 4,200)",
  taxes: "₹ 850",
  total: "₹ 5,050",
};
 // eslint-disable-next-line
const COUPONS = [
  {
    id: 1,
    code: "FLY200",
    discount: "₹200 off",
    description: "Instant discount on domestic flights",
    minAmount: "₹ 4,000",
  },
  {
    id: 2,
    code: "SAVE10",
    discount: "10% off",
    description: "Get 10% off up to ₹500 on your booking",
    minAmount: "₹ 3,000",
  },
];
 // eslint-disable-next-line
const TRAVELLERS = {
  adultCount: 1,
  childCount: 0,
  infantCount: 0,
};



export const FlightPaymentConfirmation = () => {
    return (
        <>
            <style>
                {`
                    .uindjksnuihfsdf li{
                        font-size: 12px;
                        color: var(--blue-primary-color);
                        list-style: none;
                        font-weight: 600;
                        padding-top: 5px;
                        padding-bottom: 5px;
                        border-bottom: 1px solid var(--border);
                        transition: 0.2s ease-in-out;
                    }

                    .uindjksnuihfsdf li i{
                        color: var(--blue-primary-color);
                        font-size: 12px;
                    }

                    .uindjksnuihfsdf li:hover{
                        background: var(--light-blue-highlighted-background-color);
                        transition: 0.2s ease-in-out;
                    }                    

                    .flight-payment-confirmation-wrapper .diwehidmsad p{
                        color: var(--main-red-color) !important;
                    }

                    .flight-payment-confirmation-wrapper .ihsmdcsdcfdf > div{
                        background: #ebebeb;
                    }

                    .flight-payment-confirmation-wrapper .ciuajmcokzxc ul{
                        position: relative;
                    }

                    .flight-payment-confirmation-wrapper .ciuajmcokzxc ul li{
                        padding-top: 10px;
                        padding-bottom: 10px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;   
                        border-bottom: 1px solid var(--border);   
                        list-style: none;     
                        padding-inline: 1rem;    
                        position: relative;         
                    }

                    .flight-payment-confirmation-wrapper .ciuajmcokzxc ul li:before{
                        border: 2px solid var(--blue-primary-color);
                        position: absolute;
                        content: "";
                        width: 0.8rem;
                        height: 0.8rem;
                        border-radius: 50%;
                        left: -5%;
                        background: #fff;
                    }

                    .flight-payment-confirmation-wrapper .ciuajmcokzxc ul li p{
                        font-weight: 600;
                    }

                    .flight-payment-confirmation-wrapper .ciuajmcokzxc ul li:last-child{
                        background: var(--light-green-highlighted-background-color);
                        border-radius: 5px;
                    }

                    .flight-payment-confirmation-wrapper .ciuajmcokzxc ul li:last-child p{
                        color: var(--blue-primary-color) !important;
                    }

                    .flight-payment-confirmation-wrapper .ciuajmcokzxc ul:before{
                        height: 50%;
                        content: "";
                        position: absolute;
                        border: 1px dashed var(--blue-primary-color);
                        left: -3.6%;
                        top: 50%;
                        transform: translateY(-50%);
                    }
                `}
            </style>

            <div className="sdfsdf655 flight-details-wrapper flight-payment-confirmation-wrapper">
                <div className="container">
                    <div className="asfdgsqwe col-lg-9">
                        <div className="pb-3 row align-items-end">
                            <div className="idnmfser col-lg-9">
                                <p style={{ fontSize: "18px", fontWeight: "600", color: "var(--blue-secondary-color) !important" }} className="mb-1">Ticket is on Hold, Pay to Confirm</p>

                                <h6 style={{ fontSize: "14px" }} className="mb-0">Booking ID IUNKJDUIEJOJERREGJF</h6>                            
                            </div>

                            <div className="col-lg-3">
                                <h6 style={{ fontSize: "14px", fontWeight: 600 }} className="mb-0">Booked on 17 Sep 2026</h6>
                            </div>
                        </div>
                    </div>

                    <div className="fgerfer88 flight-wrppr">
                        <div className="row">
                            {/* Main Content - Left Column */}
                            <div className="col-lg-9">
                                <div className="sdfhgfrfrftr">
                                    <div className="hotel-card">
                                        <div className="card-box">
                                            {/* HEADER */}
                                            <div className="flight-header flex-column pb-3">
                                                <p className="mb-0" style={{ fontSize: "16px", fontWeight: "600" }}>COMPLETE YOUR BOOKING</p>

                                                <div className="diwehidmsad">
                                                    <p style={{ fontSize: "12px" }} className="mb-0">Pay the remaining amount of 8,829 to complete the booking</p>
                                                </div>
                                            </div>

                                            <div className="insdjifncsidm mt-3">
                                                <div className="row">
                                                    <div className="col-lg-8">
                                                        <div className="ihsmdcsdcfdf">
                                                            <div className="px-3 py-2 rounded-2">
                                                                <p className="mb-0" style={{ fontSize: "14px" }}><i className="fa-solid me-1 fa-lock"></i> <b>Price locked at 8,829</b></p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="col-lg-4">
                                                        <div className="ihsmdcsdcfdf">
                                                            <button className="btn-tour mb-1" style={{ fontSize: "14px" }}>PAY & CONFIRM BOOKING</button>

                                                            <p style={{ fontSize: "11px" }} className="mb-0">Vouchers will be available after full payment</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="ciuajmcokzxc d-flex gap-2">
                                                <div className="col-lg-6">
                                                    <ul className="mb-0 ps-0 ms-4">
                                                        <li>
                                                            <p className="mb-0">Fare Lock Charges</p>

                                                            <p className="mb-0">398</p>
                                                        </li>

                                                        <li>
                                                            <p className="mb-0">Pay by 17 Sep, 07:39PM</p>

                                                            <p className="mb-0">8,829</p>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="hotel-card mt-3">
                                        <div className="card-box">
                                            {/* HEADER */}
                                            <div className="flight-header mb-3">
                                                <div className="ciuajmcokzxc d-flex gap-2">
                                                    <div>
                                                        <h5 className="fw-bold mb-1 d-flex align-items-center gap-2">
                                                            {FLIGHT.originCity}
                                                            <img
                                                                src="/images/planesmallicon.png"
                                                                width={25}
                                                                alt=""
                                                            />
                                                            {FLIGHT.destinationCity}
                                                        </h5>

                                                        <p className="uineiokee mb-0">
                                                            <i className="bi me-2 bi-calendar3"></i>
                                                            <span>{FLIGHT.formattedDate} ·</span>
                                                            <span>
                                                                <span style={{ color: "var(--blue-primary-color)" }}>
                                                                    {" "}
                                                                    {FLIGHT.stops === 0
                                                                        ? "Non Stop"
                                                                        : `${FLIGHT.stops} Stop`}{" "}
                                                                    ·{" "}
                                                                </span>
                                                                {FLIGHT.totalDuration}
                                                            </span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* SEGMENTS */}
                                            <div className="flight-segments">
                                                {SEGMENTS.map((segment, index) => (
                                                    <div key={index}>
                                                        <div className="flight-card mb-3 py-3 px-2">
                                                            <div className="gfjh55 d-flex align-items-center gap-2 text-start mb-2">
                                                                <img
                                                                    src="/images/indigo.png"
                                                                    width={45}
                                                                    alt=""
                                                                />
                                                                <div className="dihuewoirwerwer">
                                                                    <h6 className="mb-0">{segment.airlineName}</h6>
                                                                    <p className="odmlksjfmdf mb-0">
                                                                        {segment.airlineCode} {segment.flightNumber}
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            <div className="icsnduhh row">
                                                                <div className="time-wrapper d-flex justify-content-between gap-5">
                                                                    <div className="pt-1">
                                                                        <h5 className="mb-1">{segment.departureTime}</h5>
                                                                        <div className="udnehnewr d-flex flex-column">
                                                                            <p className="fw-semibold mb-0 d-flex flex-column gap-1">
                                                                                <span>{segment.originCity}</span>
                                                                            </p>
                                                                            {segment.originTerminal && (
                                                                                <small
                                                                                    style={{
                                                                                        fontWeight: 500,
                                                                                        color: "var(--light-highlighted-text-color)",
                                                                                    }}
                                                                                >
                                                                                    Terminal {segment.originTerminal}
                                                                                </small>
                                                                            )}
                                                                        </div>
                                                                    </div>

                                                                    <div className="duration-wrapper flex-fill text-center">
                                                                        <small className="dyusbnbsdhfc ufsidnfijsdfsdf">
                                                                            <i className="bi bi-clock"></i> {segment.duration}
                                                                        </small>

                                                                        <div className="dinsjihfnsidhfsdf d-flex align-items-center justify-content-center position-relative my-3">
                                                                            <span className="flgt-drtn-circle d-block"></span>
                                                                            <span className="flgt-drtn-line d-block"></span>
                                                                            <span className="flgt-drtn-circle d-block"></span>
                                                                            <div className="dijsenifjsdf hide-ini position-absolute text-center">
                                                                                <i className="bi bi-airplane-engines d-block text-white"></i>
                                                                            </div>
                                                                            <div className="dijsenifjsdf show-ini position-absolute text-center">
                                                                                <i className="bi bi-airplane-engines d-block text-white"></i>
                                                                            </div>
                                                                        </div>

                                                                        <small className="dyusbnbsdhfc px-3 stop-info">
                                                                            {segment.aircraftType}
                                                                        </small>
                                                                    </div>

                                                                    <div className="text-end pt-1">
                                                                        <h5 className="mb-1">{segment.arrivalTime}</h5>
                                                                        <div className="udnehnewr d-flex flex-column">
                                                                            <p className="fw-semibold mb-0 d-flex flex-column gap-1">
                                                                                <span>{segment.destinationCity}</span>
                                                                            </p>
                                                                            {segment.destinationTerminal && (
                                                                                <small
                                                                                    style={{
                                                                                        fontWeight: 500,
                                                                                        color: "var(--light-highlighted-text-color)",
                                                                                    }}
                                                                                >
                                                                                    Terminal {segment.destinationTerminal}
                                                                                </small>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Important Information */}
                                    <div className="fgdfgdfg">
                                        <div className="sdfgsdf">
                                            <h5 className="mb-3">
                                                <span className="me-3 text-center">
                                                    <i className="fa-solid fa-info"></i>
                                                </span>
                                                Terms & Conditions
                                            </h5>
                                        </div>

                                        <div className="bdfsdf855e">
                                            <div className="dfgf555 bg-white py-3">
                                                <div className="dfxgbdczdcd position-relative px-3">
                                                    <h6 className="mb-2">
                                                        Check travel guidelines and baggage information below:
                                                    </h6>
                                                    <p className="mb-0">
                                                        Carry no more than 1 check-in baggage and 1 hand baggage per
                                                        passenger. If violated, airline may levy extra charges.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Traveller Details (static display only) */}
                                    <div className="fgdfgdfg">
                                        <div className="sdfgsdf">
                                            <h5 className="mb-3">Primary Contact Details</h5>
                                        </div>

                                        <div className="bdfsdf855e">
                                            <div className="dfgf555 bg-white py-3">
                                                <div className="dfxgbdczdcd position-relative px-3">
                                                    <h6 className="mb-2">
                                                        This is your primary contact, you can not change it. You can however send the ticket to other emails.
                                                    </h6>

                                                    <p className="mb-0"><b>pfsupport@gmail.com</b></p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Sidebar - Right Column */}
                            <div className="col-lg-3">
                                <div className="sticky-top">
                                    {/* SUMMARY */}
                                    <div className="fgdfgdf mb-3">
                                        <div className="summary overflow-hidden p-0">
                                            <h6 className="mb-0 px-3 py-2">
                                                <i className="bi me-1 bi-wallet"></i> Payment Details
                                            </h6>

                                            <div className="diewnjrjwer p-3 py-0">
                                                <table className="table mb-0">
                                                    <tbody>
                                                        <tr>
                                                            <td>UPI</td>
                                                            
                                                            <td>398</td>
                                                        </tr>

                                                        <tr>
                                                            <td className="asdfsdfsdf">Amount Paid</td>
                                                            
                                                            <td>398</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>

                                    {/* COUPON */}
                                    <div className="dfdff5585">
                                        <div className="coupon-box">
                                            <div className="hjhjk">
                                                <h6 className="mb-0 px-3 py-2">
                                                    <i className="bi me-1 bi-tags"></i>
                                                    Price Breakup
                                                </h6>

                                                <div className="diewnjrjwer p-3 py-0">
                                                    <table className="table mb-0">
                                                        <tbody>
                                                            <tr>
                                                                <td>Price Lock Charge</td>
                                                                
                                                                <td>398</td>
                                                            </tr>

                                                            <tr>
                                                                <td className="asdfsdfsdf">Total Amount</td>
                                                                
                                                                <td>398</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
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