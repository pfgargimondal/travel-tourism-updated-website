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



export const FlightLocked = () => {
    return (
        <>
            <style>
                {`
                    .flight-locked-wrapper .flight-header{
                        border-bottom: 1px dashed var(--border);
                    }

                    .flight-locked-wrapper .flight-card{
                        border: 0;
                    }

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
                `}
            </style>

            <div className="sdfsdf655 flight-details-wrapper flight-locked-wrapper">
                <div className="container">
                    <div className="asfdgsqwe">
                        <div className="pb-3">
                            <p style={{ fontSize: "18px", fontWeight: "600" }} className="mb-1">Price Locked <i className="fa-solid ms-1 text-success fa-circle-check"></i></p>

                            <h6 style={{ fontSize: "14px" }} className="mb-0">Confirmation mail sent to <span style={{ fontWeight: "600" }}>support@gmail.com</span></h6>
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
                                            <div className="flight-header pb-3 mb-3">
                                                <p className="mb-0" style={{ fontSize: "12px", fontWeight: "600" }}>SELECTED FLIGHT</p>

                                                <div className="diwehidmsad d-flex flex-column text-end gap-1">
                                                    <p style={{ fontSize: "12px" }} className="mb-0">LOCKING ID: &nbsp; <b>IJDNJSWBHFNSDHFSJBDJFN</b></p>
                                                </div>
                                            </div>

                                            <div className="ciuajmcokzxc d-flex justify-content-between gap-2">
                                                <div className="d-flex">
                                                    {SEGMENTS.map((segment, index) => (
                                                        <div key={index}>
                                                            <div className="flight-card px-2 py-0 mb-0">
                                                                <div className="gfjh55">
                                                                    <img
                                                                        src="/images/indigo.png"
                                                                        width={45}
                                                                        alt=""
                                                                    />
                                                                    <div className="dihuewoirwerwer">
                                                                        <p className="odmlksjfmdf mb-0">
                                                                            {segment.airlineCode} {segment.flightNumber}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}                                                    

                                                    <div>
                                                        <h5 className="fw-bold mb-1 d-flex align-items-center gap-2">
                                                            {SEGMENTS.map((segment) => (
                                                                <div>
                                                                    <span className="d-flex align-items-center">
                                                                        {FLIGHT.originCity}&nbsp;

                                                                        <div>
                                                                            <span className="mb-1">({segment.departureTime})</span>
                                                                        </div>
                                                                    </span>

                                                                    <div className="soidfnsdfn">
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
                                                            ))}

                                                            <img
                                                                src="/images/planesmallicon.png"
                                                                width={25}
                                                                alt=""
                                                            />

                                                            {SEGMENTS.map((segment) => (
                                                                <div>
                                                                    <span className="d-flex align-items-center">
                                                                        {FLIGHT.destinationCity}&nbsp;

                                                                        <div>
                                                                            <span className="mb-1">({segment.arrivalTime})</span>
                                                                        </div>
                                                                    </span>


                                                                    <div className="soidfnsdfn">
                                                                        {segment.originTerminal && (
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
                                                        ))}
                                                        </h5>                                                    
                                                    </div>
                                                </div>

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

                                    {/* Free Date Change */}
                                    <div className="sdbfsdhfsd">
                                        <div className="dfbsdfgsdf">
                                            <div className="row">
                                                <div className="col-lg-10">
                                                    <div className="fgsdfsdf d-block mb-2">
                                                        <div className="dfsdf">
                                                            <div className="sdfgsdf">
                                                                <h5 className="mb-0">Paid Now</h5>
                                                            </div>                                                            
                                                        </div>
                                                    </div>

                                                    <div className="dfsdfsdf">
                                                        <p className="mb-0">
                                                            To complete the booking, plese pay the balance amount of <b>8,829 by 2026-09-17 19:39</b> <br/>
                                                                To check your payment details <span style={{ color: "var(--blue-primary-color)" }}><b>Go to My Dashboard</b></span>
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="col-lg-2">
                                                    <div className="fsdfsdfsd fghdzgsd text-center">
                                                        <img src="/images/hfggdf.png" alt="" />
                                                        <div className="dfgbdfgdf">
                                                            <h4 className="mb-0">₹ 398</h4>
                                                        </div>
                                                    </div>
                                                </div>
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
                                                Important Information
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

                                        <div className="oijnodijsdef text-end">
                                            <p className="mb-0">...See more</p>
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
                                                Manage Your Trip & Get All The Help
                                            </h6>

                                            <ul className="uindjksnuihfsdf px-3 mb-2">
                                                <li><i className="fa-solid me-2 fa-ticket"></i> Download Voucher</li>
                                                
                                                <li><i className="fa-solid me-2 fa-chair"></i> Add Seat or Meal</li>
                                                
                                                <li><i className="fa-regular me-2 fa-calendar"></i> Modify Dates</li>
                                                
                                                <li><i className="fa-solid me-2 fa-ban"></i> Cancel All Tickets</li>
                                            </ul>

                                            <div className="text-center mb-3">
                                                <button className="btn-tour">GO TO MY DASHBOARD</button>
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