import "./Css/BusFilter.css";



export const BusFilter = () => {
    const busFilters = [
        {
            id: 1,
            filter_name: "Primo Bus",
            icon: "bi-stars",
            count: 27
        },
        {
            id: 2,
            filter_name: "Free Cancellation",
            icon: "bi-shield-check",
            count: 74
        },
        {
            id: 3,
            filter_name: "AC",
            icon: "bi-snow",
            count: 132
        },
        {
            id: 4,
            filter_name: "Sleeper",
            icon: "bi-bed",
            count: 129
        },
        {
            id: 5,
            filter_name: "Single Seats",
            icon: "bi-person",
            count: 126
        },
        {
            id: 6,
            filter_name: "Seater",
            icon: "bi-people",
            count: 54
        },
        {
            id: 7,
            filter_name: "Non AC",
            icon: "bi-x-circle",
            count: 4
        },
        {
            id: 8,
            filter_name: "18:00-24:00",
            icon: "bi-clock",
            count: 114
        },
        {
            id: 9,
            filter_name: "High Rated Buses",
            icon: "bi-star",
            count: 121
        },
        {
            id: 10,
            filter_name: "Live Tracking",
            icon: "bi-geo-alt",
            count: 112
        },
        {
            id: 11,
            filter_name: "Volvo Buses",
            icon: "bi-check-circle",
            count: 13
        }
    ];



    return (
        <>
            <div className="bannerbus" style={{ width: "100%", height: "450px", background: "url('./images/busbanner.jpg') no-repeat", backgroundSize: "cover" }}></div>

            <div className="cvdbgxfvbsdffc">
                <div className="container">
                    <div className="rb-wrapper">
                        <div className="rb-box">
                            <div className="rb-top">
                                {/* FROM */}
                                <div className="rb-field dfdfggd">
                                    <i className="fa-solid fa-bus" />
                                    <input type="text" className="rb-input" placeholder="From" />
                                </div>
                                {/* TO */}
                                <div className="rb-field dfdfggd">
                                    <i className="fa-solid fa-location-dot" />
                                    <input type="text" className="rb-input" placeholder="To" />
                                </div>
                                {/* DATE */}
                                <div className="rb-field">
                                    <i className="fa-regular fa-calendar" />
                                    <div className="rb-date-box">
                                        <div className="rb-date-label">Date of Journey</div>
                                        <div className="rb-date-row">
                                            <div className="hjgsdds">
                                                <div className="rb-date-main" id="showDate" />
                                                <div className="rb-date-sub">(Today)</div>
                                            </div>
                                            <div className="rb-date-actions">
                                                <button className="rb-btn rb-today">Today</button>
                                                <button className="rb-btn rb-tomorrow">Tomorrow</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* WOMEN */}
                                <div className="rb-women-box">
                                    <img src="./images/american.png" alt=""/>
                                    <div>
                                        <div style={{ fontSize: 13, fontWeight: 600 }}>
                                            Booking for women
                                        </div>
                                        <div style={{ fontSize: 11, color: "#007bff" }}>Know more</div>
                                    </div>
                                    <label className="switch ms-2">
                                        <input type="checkbox" />
                                        <span className="slider" />
                                    </label>
                                </div>
                                {/* ✅ SEARCH BUTTON (RIGHT SIDE) */}
                            </div>
                        </div>
                    </div>
                    <div className="uieuie89">
                        <div className="rb-search-wrap">
                            <button className="rb-search">
                                <i className="fa-solid fa-magnifying-glass" /> Search buses
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="asmjsdbfdsdsd">
                <div className="container">
                    <div className="fjhdfd">
                        <div className="row">
                            <div className="col-lg-3">
                                <div className="adgaehewdasx">
                                    <div className="filter-container mb-3">
                                        <div className="filter-title">Filter buses</div>
                                        {/* Buttons */}

                                        <div className="cosihdfoijsdf">
                                            {busFilters.map(busFilter => (
                                                <div className="suggested-item" key={busFilter.id}>
                                                    <div className="checkbox-wrapper-33 w-100">
                                                        <label className="checkbox w-100" htmlFor={`fs-${busFilter.id}`}>
                                                            <input
                                                                className="checkbox__trigger visuallyhidden"
                                                                name="dishif"
                                                                type="checkbox"
                                                                id={`fs-${busFilter.id}`}
                                                            />

                                                            <span className="checkbox__symbol">
                                                                <svg
                                                                    aria-hidden="true"
                                                                    className="icon-checkbox"
                                                                    width="28px"
                                                                    height="28px"
                                                                    viewBox="0 0 28 28"
                                                                    version="1.1"
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                >
                                                                    <path d="M4 14l8 7L24 7"></path>
                                                                </svg>
                                                            </span>

                                                            <p className="checkbox__textwrapper"><i className={`bi ${busFilter.icon}`} /> {busFilter.filter_name}</p>

                                                            <span className="item-count">({busFilter.count})</span>
                                                        </label>
                                                    </div>
                                                </div>
                                            ))}                                            
                                        </div>                                        
                                    </div>

                                    <div className="filter-box mb-3">
                                        {/* HEADER */}
                                        <div
                                            className="filter-header"
                                            data-bs-toggle="collapse"
                                            data-bs-target="#departure"
                                        >
                                            <span>Departure time from source</span>
                                            <i className="bi bi-chevron-up" />
                                        </div>
                                        {/* BODY */}
                                        <div id="departure" className="collapse dbsdzvsef show">
                                            {/* ITEM 1 */}
                                            <div className="filter-item mt-2">
                                                <div className="item-left">
                                                    <i className="bi bi-brightness-high" />
                                                    <div>
                                                        <div className="time">12:00–18:00</div>
                                                        <div className="label">Afternoon</div>
                                                    </div>
                                                </div>

                                                <div className="item-right">
                                                    <div className="count">13</div>

                                                    <div className="suggested-item mb-0">
                                                        <div className="checkbox-wrapper-33">
                                                            <label className="checkbox">
                                                                <input
                                                                    className="checkbox__trigger visuallyhidden"
                                                                    type="checkbox"
                                                                />

                                                                <span className="checkbox__symbol">
                                                                    <svg
                                                                        aria-hidden="true"
                                                                        className="icon-checkbox"
                                                                        width="28px"
                                                                        height="28px"
                                                                        viewBox="0 0 28 28"
                                                                        version="1.1"
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                    >
                                                                        <path d="M4 14l8 7L24 7"></path>
                                                                    </svg>
                                                                </span>
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* ITEM 2 */}
                                            <div className="filter-item">
                                                <div className="item-left">
                                                    <i className="bi bi-sunset" />
                                                    <div>
                                                        <div className="time">18:00–24:00</div>
                                                        <div className="label">Evening</div>
                                                    </div>
                                                </div>

                                                <div className="item-right">
                                                    <div className="count">114</div>
                                                    
                                                    <div className="suggested-item mb-0">
                                                        <div className="checkbox-wrapper-33">
                                                            <label className="checkbox">
                                                                <input
                                                                    className="checkbox__trigger visuallyhidden"
                                                                    type="checkbox"
                                                                />

                                                                <span className="checkbox__symbol">
                                                                    <svg
                                                                        aria-hidden="true"
                                                                        className="icon-checkbox"
                                                                        width="28px"
                                                                        height="28px"
                                                                        viewBox="0 0 28 28"
                                                                        version="1.1"
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                    >
                                                                        <path d="M4 14l8 7L24 7"></path>
                                                                    </svg>
                                                                </span>
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                            
                                            {/* ITEM 3 */}
                                            <div className="filter-item">
                                                <div className="item-left">
                                                    <i className="bi bi-moon" />
                                                    <div>
                                                        <div className="time">00:00–06:00</div>
                                                        <div className="label">Night</div>
                                                    </div>
                                                </div>

                                                <div className="item-right">
                                                    <div className="count">9</div>
                                                    
                                                    <div className="suggested-item mb-0">
                                                        <div className="checkbox-wrapper-33">
                                                            <label className="checkbox">
                                                                <input
                                                                    className="checkbox__trigger visuallyhidden"
                                                                    type="checkbox"
                                                                />

                                                                <span className="checkbox__symbol">
                                                                    <svg
                                                                        aria-hidden="true"
                                                                        className="icon-checkbox"
                                                                        width="28px"
                                                                        height="28px"
                                                                        viewBox="0 0 28 28"
                                                                        version="1.1"
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                    >
                                                                        <path d="M4 14l8 7L24 7"></path>
                                                                    </svg>
                                                                </span>
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="filter-box mb-3">
                                        {/* ARRIVAL TIME */}
                                        <div
                                            className="filter-header collapsed"
                                            data-bs-toggle="collapse"
                                            data-bs-target="#arrival"
                                        >
                                            <span>Arrival time at destination</span>
                                            <i className="bi bi-chevron-up" />
                                        </div>

                                        <div id="arrival" className="collapse dbsdzvsef">
                                            <div className="filter-item mt-2">
                                                <div className="item-left">
                                                    <i className="bi bi-brightness-alt-low"></i>
                                                    <div>
                                                        <div className="time">06:00-12:00</div>
                                                        <div className="label">Morning</div>
                                                    </div>
                                                </div>
                                                <div className="item-right">
                                                    <div className="count">49</div>
                                                    
                                                    <div className="suggested-item mb-0">
                                                        <div className="checkbox-wrapper-33">
                                                            <label className="checkbox">
                                                                <input
                                                                    className="checkbox__trigger visuallyhidden"
                                                                    type="checkbox"
                                                                />

                                                                <span className="checkbox__symbol">
                                                                    <svg
                                                                        aria-hidden="true"
                                                                        className="icon-checkbox"
                                                                        width="28px"
                                                                        height="28px"
                                                                        viewBox="0 0 28 28"
                                                                        version="1.1"
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                    >
                                                                        <path d="M4 14l8 7L24 7"></path>
                                                                    </svg>
                                                                </span>
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="filter-item">
                                                <div className="item-left">
                                                    <i className="bi bi-sunset" />
                                                    <div>
                                                        <div className="time">18:00-24:00</div>
                                                        <div className="label">Evening</div>
                                                    </div>
                                                </div>
                                                <div className="item-right">
                                                    <div className="count">11</div>
                                                    
                                                    <div className="suggested-item mb-0">
                                                        <div className="checkbox-wrapper-33">
                                                            <label className="checkbox">
                                                                <input
                                                                    className="checkbox__trigger visuallyhidden"
                                                                    type="checkbox"
                                                                />

                                                                <span className="checkbox__symbol">
                                                                    <svg
                                                                        aria-hidden="true"
                                                                        className="icon-checkbox"
                                                                        width="28px"
                                                                        height="28px"
                                                                        viewBox="0 0 28 28"
                                                                        version="1.1"
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                    >
                                                                        <path d="M4 14l8 7L24 7"></path>
                                                                    </svg>
                                                                </span>
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="filter-item">
                                                <div className="item-left">
                                                    <i className="bi bi-moon" />
                                                    <div>
                                                        <div className="time">00:00-06:00</div>
                                                        <div className="label">Night</div>
                                                    </div>
                                                </div>
                                                <div className="item-right">
                                                    <div className="count">76</div>
                                                    
                                                    <div className="suggested-item mb-0">
                                                        <div className="checkbox-wrapper-33">
                                                            <label className="checkbox">
                                                                <input
                                                                    className="checkbox__trigger visuallyhidden"
                                                                    type="checkbox"
                                                                />

                                                                <span className="checkbox__symbol">
                                                                    <svg
                                                                        aria-hidden="true"
                                                                        className="icon-checkbox"
                                                                        width="28px"
                                                                        height="28px"
                                                                        viewBox="0 0 28 28"
                                                                        version="1.1"
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                    >
                                                                        <path d="M4 14l8 7L24 7"></path>
                                                                    </svg>
                                                                </span>
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>                                        
                                    </div>

                                    {/* BUS TYPE */}
                                    <div className="duiejroijweorewr mb-3">
                                        <div className="filter-header collapsed"
                                            data-bs-toggle="collapse"
                                            data-bs-target="#bus"
                                        >
                                            <span>Bus type</span>
                                            <i className="bi bi-chevron-up" />
                                        </div>
                                        
                                        <div id="bus" className="collapse sfweafcadw dbsdzvsef dfxfnhdfxd">
                                            <div className="filter-item mt-2">
                                                <div className="item-left">
                                                    <i className="bi bi-snow" />
                                                    <div className="time">AC</div>
                                                </div>
                                                <div className="item-right">
                                                    <div className="count">132</div>

                                                    <div className="suggested-item mb-0">
                                                        <div className="checkbox-wrapper-33">
                                                            <label className="checkbox">
                                                                <input
                                                                    className="checkbox__trigger visuallyhidden"
                                                                    type="checkbox"
                                                                />

                                                                <span className="checkbox__symbol">
                                                                    <svg
                                                                        aria-hidden="true"
                                                                        className="icon-checkbox"
                                                                        width="28px"
                                                                        height="28px"
                                                                        viewBox="0 0 28 28"
                                                                        version="1.1"
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                    >
                                                                        <path d="M4 14l8 7L24 7"></path>
                                                                    </svg>
                                                                </span>
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="filter-item">
                                                <div className="item-left">
                                                    <i className="bi bi-slash-circle" />
                                                    <div className="time">NONAC</div>
                                                </div>
                                                <div className="item-right">
                                                    <div className="count">4</div>
                                                    <div className="suggested-item mb-0">
                                                        <div className="checkbox-wrapper-33">
                                                            <label className="checkbox">
                                                                <input
                                                                    className="checkbox__trigger visuallyhidden"
                                                                    type="checkbox"
                                                                />

                                                                <span className="checkbox__symbol">
                                                                    <svg
                                                                        aria-hidden="true"
                                                                        className="icon-checkbox"
                                                                        width="28px"
                                                                        height="28px"
                                                                        viewBox="0 0 28 28"
                                                                        version="1.1"
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                    >
                                                                        <path d="M4 14l8 7L24 7"></path>
                                                                    </svg>
                                                                </span>
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="filter-item">
                                                <div className="item-left">
                                                    <i className="bi bi-person-seat" />
                                                    <div className="time">SEATER</div>
                                                </div>
                                                <div className="item-right">
                                                    <div className="count">54</div>
                                                    <div className="suggested-item mb-0">
                                                        <div className="checkbox-wrapper-33">
                                                            <label className="checkbox">
                                                                <input
                                                                    className="checkbox__trigger visuallyhidden"
                                                                    type="checkbox"
                                                                />

                                                                <span className="checkbox__symbol">
                                                                    <svg
                                                                        aria-hidden="true"
                                                                        className="icon-checkbox"
                                                                        width="28px"
                                                                        height="28px"
                                                                        viewBox="0 0 28 28"
                                                                        version="1.1"
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                    >
                                                                        <path d="M4 14l8 7L24 7"></path>
                                                                    </svg>
                                                                </span>
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="filter-item">
                                                <div className="item-left">
                                                    <i className="bi bi-grid-1x2" />
                                                    <div className="time">SLEEPER</div>
                                                </div>
                                                <div className="item-right">
                                                    <div className="count">129</div>
                                                    <div className="suggested-item mb-0">
                                                        <div className="checkbox-wrapper-33">
                                                            <label className="checkbox">
                                                                <input
                                                                    className="checkbox__trigger visuallyhidden"
                                                                    type="checkbox"
                                                                />

                                                                <span className="checkbox__symbol">
                                                                    <svg
                                                                        aria-hidden="true"
                                                                        className="icon-checkbox"
                                                                        width="28px"
                                                                        height="28px"
                                                                        viewBox="0 0 28 28"
                                                                        version="1.1"
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                    >
                                                                        <path d="M4 14l8 7L24 7"></path>
                                                                    </svg>
                                                                </span>
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="filter-item">
                                                <div className="item-left">
                                                    <i className="bi bi-check-circle" />
                                                    <div className="time">Volvo Buses</div>
                                                </div>
                                                <div className="item-right">
                                                    <div className="count">13</div>
                                                    <div className="suggested-item mb-0">
                                                        <div className="checkbox-wrapper-33">
                                                            <label className="checkbox">
                                                                <input
                                                                    className="checkbox__trigger visuallyhidden"
                                                                    type="checkbox"
                                                                />

                                                                <span className="checkbox__symbol">
                                                                    <svg
                                                                        aria-hidden="true"
                                                                        className="icon-checkbox"
                                                                        width="28px"
                                                                        height="28px"
                                                                        viewBox="0 0 28 28"
                                                                        version="1.1"
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                    >
                                                                        <path d="M4 14l8 7L24 7"></path>
                                                                    </svg>
                                                                </span>
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>                                    

                                    {/* SINGLE WINDOW */}
                                    <div className="duiejroijweorewr mb-3">
                                        <div className="filter-header collapsed"
                                            data-bs-toggle="collapse"
                                            data-bs-target="#single"
                                        >
                                            <span>Single window seater/sleeper</span>
                                            <i className="bi bi-chevron-up" />
                                        </div>

                                        <div id="single" className="collapse sfweafcadw dbsdzvsef dfxfnhdfxd">
                                            <div className="filter-item mt-2">
                                                <div className="item-left">
                                                    <i className="bi bi-box" />
                                                    <div className="time">Single Seats</div>
                                                </div>
                                                <div className="item-right">
                                                    <div className="count">126</div>
                                                    <div className="suggested-item mb-0">
                                                        <div className="checkbox-wrapper-33">
                                                            <label className="checkbox">
                                                                <input
                                                                    className="checkbox__trigger visuallyhidden"
                                                                    type="checkbox"
                                                                />

                                                                <span className="checkbox__symbol">
                                                                    <svg
                                                                        aria-hidden="true"
                                                                        className="icon-checkbox"
                                                                        width="28px"
                                                                        height="28px"
                                                                        viewBox="0 0 28 28"
                                                                        version="1.1"
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                    >
                                                                        <path d="M4 14l8 7L24 7"></path>
                                                                    </svg>
                                                                </span>
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>                                    

                                    {/* BUS FEATURES */}
                                    <div className="duiejroijweorewr mb-3">
                                        <div className="filter-header collapsed"
                                            data-bs-toggle="collapse"
                                            data-bs-target="#features"
                                        >
                                            <span>Bus features</span>
                                            <i className="bi bi-chevron-up" />
                                        </div>

                                        <div id="features" className="collapse sfweafcadw dbsdzvsef dfxfnhdfxd">
                                            <div className="filter-item mt-2">
                                                <div className="item-left">
                                                    <i className="bi bi-geo-alt" />
                                                    <div className="time">Live Tracking</div>
                                                </div>
                                                <div className="item-right">
                                                    <div className="count">112</div>
                                                    <div className="suggested-item mb-0">
                                                        <div className="checkbox-wrapper-33">
                                                            <label className="checkbox">
                                                                <input
                                                                    className="checkbox__trigger visuallyhidden"
                                                                    type="checkbox"
                                                                />

                                                                <span className="checkbox__symbol">
                                                                    <svg
                                                                        aria-hidden="true"
                                                                        className="icon-checkbox"
                                                                        width="28px"
                                                                        height="28px"
                                                                        viewBox="0 0 28 28"
                                                                        version="1.1"
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                    >
                                                                        <path d="M4 14l8 7L24 7"></path>
                                                                    </svg>
                                                                </span>
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="filter-item">
                                                <div className="item-left">
                                                    <i className="bi bi-star" />
                                                    <div className="time">High Rated Buses</div>
                                                </div>
                                                <div className="item-right">
                                                    <div className="count">121</div>
                                                    <div className="suggested-item mb-0">
                                                        <div className="checkbox-wrapper-33">
                                                            <label className="checkbox">
                                                                <input
                                                                    className="checkbox__trigger visuallyhidden"
                                                                    type="checkbox"
                                                                />

                                                                <span className="checkbox__symbol">
                                                                    <svg
                                                                        aria-hidden="true"
                                                                        className="icon-checkbox"
                                                                        width="28px"
                                                                        height="28px"
                                                                        viewBox="0 0 28 28"
                                                                        version="1.1"
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                    >
                                                                        <path d="M4 14l8 7L24 7"></path>
                                                                    </svg>
                                                                </span>
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="filter-item">
                                                <div className="item-left">
                                                    <i className="bi bi-tag" />
                                                    <div className="time">Deals</div>
                                                </div>
                                                <div className="item-right">
                                                    <div className="count">66</div>
                                                    <div className="suggested-item mb-0">
                                                        <div className="checkbox-wrapper-33">
                                                            <label className="checkbox">
                                                                <input
                                                                    className="checkbox__trigger visuallyhidden"
                                                                    type="checkbox"
                                                                />

                                                                <span className="checkbox__symbol">
                                                                    <svg
                                                                        aria-hidden="true"
                                                                        className="icon-checkbox"
                                                                        width="28px"
                                                                        height="28px"
                                                                        viewBox="0 0 28 28"
                                                                        version="1.1"
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                    >
                                                                        <path d="M4 14l8 7L24 7"></path>
                                                                    </svg>
                                                                </span>
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="filter-item">
                                                <div className="item-left">
                                                    <i className="bi bi-star-half" />
                                                    <div className="time">Primo Bus</div>
                                                </div>
                                                <div className="item-right">
                                                    <div className="count">27</div>
                                                    <div className="suggested-item mb-0">
                                                        <div className="checkbox-wrapper-33">
                                                            <label className="checkbox">
                                                                <input
                                                                    className="checkbox__trigger visuallyhidden"
                                                                    type="checkbox"
                                                                />

                                                                <span className="checkbox__symbol">
                                                                    <svg
                                                                        aria-hidden="true"
                                                                        className="icon-checkbox"
                                                                        width="28px"
                                                                        height="28px"
                                                                        viewBox="0 0 28 28"
                                                                        version="1.1"
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                    >
                                                                        <path d="M4 14l8 7L24 7"></path>
                                                                    </svg>
                                                                </span>
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="filter-item">
                                                <div className="item-left">
                                                    <i className="bi bi-shield-check" />
                                                    <div className="time">Free Cancellation</div>
                                                </div>
                                                <div className="item-right">
                                                    <div className="count">74</div>
                                                    <div className="suggested-item mb-0">
                                                        <div className="checkbox-wrapper-33">
                                                            <label className="checkbox">
                                                                <input
                                                                    className="checkbox__trigger visuallyhidden"
                                                                    type="checkbox"
                                                                />

                                                                <span className="checkbox__symbol">
                                                                    <svg
                                                                        aria-hidden="true"
                                                                        className="icon-checkbox"
                                                                        width="28px"
                                                                        height="28px"
                                                                        viewBox="0 0 28 28"
                                                                        version="1.1"
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                    >
                                                                        <path d="M4 14l8 7L24 7"></path>
                                                                    </svg>
                                                                </span>
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* BUS OPERATOR */}
                                    <div className="duiejroijweorewr mb-3">
                                        <div
                                            className="filter-header collapsed"
                                            data-bs-toggle="collapse"
                                            data-bs-target="#operator"
                                        >
                                            <span>Bus operator</span>
                                            <i className="bi bi-chevron-up" />
                                        </div>

                                        <div id="operator" className="collapse sfweafcadw">
                                            {/* SEARCH BOX */}
                                            <div style={{ padding: "10px 12px" }}>
                                                <input
                                                    type="text"
                                                    placeholder="Search bus operator"
                                                    className="operator-search"
                                                />
                                            </div>
                                            {/* LIST */}
                                            <div className="filter-item">
                                                <div className="item-left">
                                                    <div className="time">ACLS Navigator</div>
                                                </div>
                                                <div className="item-right">
                                                    <div className="count">1</div>
                                                    <input type="checkbox" />
                                                </div>
                                            </div>
                                            <div className="filter-item">
                                                <div className="item-left">
                                                    <div className="time">ADITHIYA AIRBUS</div>
                                                </div>
                                                <div className="item-right">
                                                    <div className="count">3</div>
                                                    <input type="checkbox" />
                                                </div>
                                            </div>
                                            <div className="filter-item">
                                                <div className="item-left">
                                                    <div className="time">ANT KING</div>
                                                </div>
                                                <div className="item-right">
                                                    <div className="count">1</div>
                                                    <input type="checkbox" />
                                                </div>
                                            </div>
                                            <div className="filter-item">
                                                <div className="item-left">
                                                    <div className="time">Apple Travels</div>
                                                </div>
                                                <div className="item-right">
                                                    <div className="count">1</div>
                                                    <input type="checkbox" />
                                                </div>
                                            </div>
                                            {/* VIEW ALL */}
                                            <div style={{ padding: 12 }}>
                                                <a href="/" className="view-all">
                                                    View all bus operators
                                                </a>
                                            </div>
                                        </div>
                                    </div>                                    

                                    {/* BOARDING POINT */}
                                    <div className="duiejroijweorewr mb-3">
                                        <div className="filter-header collapsed"
                                            data-bs-toggle="collapse"
                                            data-bs-target="#boarding"
                                        >
                                            <span>Boarding point</span>
                                            <i className="bi bi-chevron-up" />
                                        </div>

                                        <div id="boarding" className="collapse sfweafcadw">
                                            {/* SEARCH BOX */}
                                            <div style={{ padding: "10px 12px" }}>
                                                <input
                                                    type="text"
                                                    placeholder="Search boarding point"
                                                    className="operator-search"
                                                />
                                            </div>
                                            {/* LIST */}
                                            <div className="filter-item">
                                                <div className="item-left">
                                                    <div className="time">Esplanade</div>
                                                </div>
                                                <div className="item-right">
                                                    <div className="count">5</div>
                                                    <input type="checkbox" />
                                                </div>
                                            </div>
                                            <div className="filter-item">
                                                <div className="item-left">
                                                    <div className="time">Karunamoyee</div>
                                                </div>
                                                <div className="item-right">
                                                    <div className="count">3</div>
                                                    <input type="checkbox" />
                                                </div>
                                            </div>
                                            <div className="filter-item">
                                                <div className="item-left">
                                                    <div className="time">Ultadanga</div>
                                                </div>
                                                <div className="item-right">
                                                    <div className="count">4</div>
                                                    <input type="checkbox" />
                                                </div>
                                            </div>
                                            <div className="filter-item">
                                                <div className="item-left">
                                                    <div className="time">Howrah Station</div>
                                                </div>
                                                <div className="item-right">
                                                    <div className="count">6</div>
                                                    <input type="checkbox" />
                                                </div>
                                            </div>
                                            {/* VIEW ALL */}
                                            <div style={{ padding: 12 }}>
                                                <a href="/" className="view-all">
                                                    View all boarding points
                                                </a>
                                            </div>
                                        </div>
                                    </div>                                    

                                    {/* DROPPING POINT */}
                                    <div className="duiejroijweorewr mb-3">
                                        <div className="filter-header collapsed"
                                            data-bs-toggle="collapse"
                                            data-bs-target="#dropping"
                                        >
                                            <span>Dropping point</span>
                                            <i className="bi bi-chevron-up" />
                                        </div>

                                        <div id="dropping" className="collapse sfweafcadw">
                                            {/* SEARCH BOX */}
                                            <div style={{ padding: "10px 12px" }}>
                                                <input
                                                    type="text"
                                                    placeholder="Search dropping point"
                                                    className="operator-search"
                                                />
                                            </div>
                                            {/* LIST */}
                                            <div className="filter-item">
                                                <div className="item-left">
                                                    <div className="time">Siliguri Junction</div>
                                                </div>
                                                <div className="item-right">
                                                    <div className="count">4</div>
                                                    <input type="checkbox" />
                                                </div>
                                            </div>
                                            <div className="filter-item">
                                                <div className="item-left">
                                                    <div className="time">Sevoke Road</div>
                                                </div>
                                                <div className="item-right">
                                                    <div className="count">3</div>
                                                    <input type="checkbox" />
                                                </div>
                                            </div>
                                            <div className="filter-item">
                                                <div className="item-left">
                                                    <div className="time">Tenzing Norgay Bus Stand</div>
                                                </div>
                                                <div className="item-right">
                                                    <div className="count">5</div>
                                                    <input type="checkbox" />
                                                </div>
                                            </div>
                                            <div className="filter-item">
                                                <div className="item-left">
                                                    <div className="time">Matigara</div>
                                                </div>
                                                <div className="item-right">
                                                    <div className="count">2</div>
                                                    <input type="checkbox" />
                                                </div>
                                            </div>
                                            {/* VIEW ALL */}
                                            <div style={{ padding: 12 }}>
                                                <a href="/" className="view-all">
                                                    View all dropping points
                                                </a>
                                            </div>
                                        </div>
                                    </div>                                    

                                    {/* AMENITIES */}
                                    <div className="duiejroijweorewr mb-3">
                                        <div className="filter-header collapsed"
                                            data-bs-toggle="collapse"
                                            data-bs-target="#amenities"
                                        >
                                            <span>Amenities</span>
                                            <i className="bi bi-chevron-up" />
                                        </div>

                                        <div id="amenities" className="collapse sfweafcadw">
                                            {/* SEARCH BOX */}
                                            <div style={{ padding: "10px 12px" }}>
                                                <input
                                                    type="text"
                                                    placeholder="Search amenities"
                                                    className="operator-search"
                                                />
                                            </div>
                                            {/* LIST */}
                                            <div className="filter-item">
                                                <div className="item-left">
                                                    <i className="bi bi-wifi" />
                                                    <div className="time">WIFI</div>
                                                </div>
                                                <div className="item-right">
                                                    <div className="count">18</div>
                                                    <input type="checkbox" />
                                                </div>
                                            </div>
                                            <div className="filter-item">
                                                <div className="item-left">
                                                    <i className="bi bi-cup-straw" />
                                                    <div className="time">Water Bottle</div>
                                                </div>
                                                <div className="item-right">
                                                    <div className="count">107</div>
                                                    <input type="checkbox" />
                                                </div>
                                            </div>
                                            <div className="filter-item">
                                                <div className="item-left">
                                                    <i className="bi bi-layers" />
                                                    <div className="time">Blankets</div>
                                                </div>
                                                <div className="item-right">
                                                    <div className="count">110</div>
                                                    <input type="checkbox" />
                                                </div>
                                            </div>
                                            <div className="filter-item">
                                                <div className="item-left">
                                                    <i className="bi bi-plug" />
                                                    <div className="time">Charging Point</div>
                                                </div>
                                                <div className="item-right">
                                                    <div className="count">118</div>
                                                    <input type="checkbox" />
                                                </div>
                                            </div>
                                            {/* VIEW ALL */}
                                            <div style={{ padding: 12 }}>
                                                <a href="/" className="view-all">
                                                    View all amenities
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                    

                                    {/* SPECIAL BUS FEATURES */}
                                    <div className="duiejroijweorewr mb-3">
                                        <div className="filter-header collapsed"
                                            data-bs-toggle="collapse"
                                            data-bs-target="#special"
                                        >
                                            <span>Special bus features</span>
                                            <i className="bi bi-chevron-up" />
                                        </div>

                                        <div id="special" className="collapse sfweafcadw">
                                            <div className="filter-item">
                                                <div className="item-left">
                                                    <div className="time">New Bus</div>
                                                </div>
                                                <div className="item-right">
                                                    <div className="count">13</div>
                                                    <input type="checkbox" />
                                                </div>
                                            </div>
                                            <div className="filter-item">
                                                <div className="item-left">
                                                    <div className="time">Business Class</div>
                                                </div>
                                                <div className="item-right">
                                                    <div className="count">10</div>
                                                    <input type="checkbox" />
                                                </div>
                                            </div>
                                            <div className="filter-item">
                                                <div className="item-left">
                                                    <div className="time">On Time</div>
                                                </div>
                                                <div className="item-right">
                                                    <div className="count">33</div>
                                                    <input type="checkbox" />
                                                </div>
                                            </div>
                                            <div className="filter-item">
                                                <div className="item-left">
                                                    <div className="time">Toilet</div>
                                                </div>
                                                <div className="item-right">
                                                    <div className="count">24</div>
                                                    <input type="checkbox" />
                                                </div>
                                            </div>
                                            <div className="filter-item">
                                                <div className="item-left">
                                                    <div className="time">Highly rated by women</div>
                                                </div>
                                                <div className="item-right">
                                                    <div className="count">118</div>
                                                    <input type="checkbox" />
                                                </div>
                                            </div>
                                            <div className="filter-item">
                                                <div className="item-left">
                                                    <div className="time">Women Traveling</div>
                                                </div>
                                                <div className="item-right">
                                                    <div className="count">75</div>
                                                    <input type="checkbox" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>                                    
                                </div>
                            </div>

                            <div className="col-lg-9">
                                <div className="sdsnhbdsvfdvfd">
                                    <div className="afgdnhgefswef mt-5">
                                        <div className="bus-card">
                                            <div className="bus-info">
                                                <div className="bus-number">TN02CE6895</div>
                                                <div className="status">IS STARTING</div>
                                                <div className="route">
                                                    From: Hebbal → Hennur Cross → 14 other stops
                                                </div>
                                            </div>
                                            <div className="row align-items-center">
                                                {/* col-lg-4 */}
                                                <div className="col-lg-4">
                                                    <div className="bus-name">
                                                        V Bus Holidays <span>📍</span>
                                                    </div>
                                                    <div className="bus-type">
                                                        Bharat Benz A/C Sleeper (2+1)
                                                    </div>
                                                </div>
                                                {/* col-lg-5 */}
                                                <div className="col-lg-5">
                                                    <div className="bvfbhjsdfbsdf">
                                                        <div className="jdfjsdf78">
                                                            <div className="rating-box">★ 4.9</div>
                                                            <div className="rating-count">1075</div>
                                                        </div>
                                                        <div className="dbfhjsdfds7855">
                                                            <div className="time mt-2">22:30 — 05:20</div>
                                                            <div className="sub-info">
                                                                6h 50m · 10 Seats{" "}
                                                                <span style={{ color: "#d84e55" }}>(1 Single)</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* col-lg-3 */}
                                                <div className="col-lg-3 text-end">
                                                    <div className="offer">Exclusive 7.5% OFF</div>
                                                    <div className="old-price">₹1339</div>
                                                    <div className="new-price">₹1099</div>
                                                    <div className="onwards">Onwards</div>
                                                </div>
                                            </div>
                                            {/* line break */}
                                            <div className="dsfsdfsdf" />
                                            {/* bottom */}
                                            <div className="bottom">
                                                <div className="tag">Minimum 10% off on return ticket</div>
                                                <button className="view-btn">View seats</button>
                                            </div>
                                        </div>
                                        <div className="bus-card">
                                            <div className="bus-info">
                                                <div className="bus-number">TN02CE6895</div>
                                                <div className="status">IS STARTING</div>
                                                <div className="route">
                                                    From: Hebbal → Hennur Cross → 14 other stops
                                                </div>
                                            </div>
                                            <div className="row align-items-center">
                                                {/* col-lg-4 */}
                                                <div className="col-lg-4">
                                                    <div className="bus-name">
                                                        V Bus Holidays <span>📍</span>
                                                    </div>
                                                    <div className="bus-type">
                                                        Bharat Benz A/C Sleeper (2+1)
                                                    </div>
                                                </div>
                                                {/* col-lg-5 */}
                                                <div className="col-lg-5">
                                                    <div className="bvfbhjsdfbsdf">
                                                        <div className="jdfjsdf78">
                                                            <div className="rating-box">★ 4.9</div>
                                                            <div className="rating-count">1075</div>
                                                        </div>
                                                        <div className="dbfhjsdfds7855">
                                                            <div className="time mt-2">22:30 — 05:20</div>
                                                            <div className="sub-info">
                                                                6h 50m · 10 Seats{" "}
                                                                <span style={{ color: "#d84e55" }}>(1 Single)</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* col-lg-3 */}
                                                <div className="col-lg-3 text-end">
                                                    <div className="offer">Exclusive 7.5% OFF</div>
                                                    <div className="old-price">₹980</div>
                                                    <div className="new-price">₹729</div>
                                                    <div className="onwards">Onwards</div>
                                                </div>
                                            </div>
                                            {/* line break */}
                                            <div className="dsfsdfsdf" />
                                            {/* bottom */}
                                            <div className="bottom">
                                                <div className="tag">Minimum 10% off on return ticket</div>
                                                <button className="view-btn">View seats</button>
                                            </div>
                                        </div>
                                        <div className="bus-card">
                                            <div className="bus-info">
                                                <div className="bus-number">TN02CE6895</div>
                                                <div className="status">IS STARTING</div>
                                                <div className="route">
                                                    From: Hebbal → Hennur Cross → 14 other stops
                                                </div>
                                            </div>
                                            <div className="row align-items-center">
                                                {/* col-lg-4 */}
                                                <div className="col-lg-4">
                                                    <div className="bus-name">
                                                        V Bus Holidays <span>📍</span>
                                                    </div>
                                                    <div className="bus-type">
                                                        Bharat Benz A/C Sleeper (2+1)
                                                    </div>
                                                </div>
                                                {/* col-lg-5 */}
                                                <div className="col-lg-5">
                                                    <div className="bvfbhjsdfbsdf">
                                                        <div className="jdfjsdf78">
                                                            <div className="rating-box">★ 4.9</div>
                                                            <div className="rating-count">1075</div>
                                                        </div>
                                                        <div className="dbfhjsdfds7855">
                                                            <div className="time mt-2">22:30 — 05:20</div>
                                                            <div className="sub-info">
                                                                6h 50m · 10 Seats{" "}
                                                                <span style={{ color: "#d84e55" }}>(1 Single)</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* col-lg-3 */}
                                                <div className="col-lg-3 text-end">
                                                    <div className="offer">Exclusive 7.5% OFF</div>
                                                    <div className="old-price">₹1200</div>
                                                    <div className="new-price">₹950</div>
                                                    <div className="onwards">Onwards</div>
                                                </div>
                                            </div>
                                            {/* line break */}
                                            <div className="dsfsdfsdf" />
                                            {/* bottom */}
                                            <div className="bottom">
                                                <div className="tag">Minimum 10% off on return ticket</div>
                                                <button className="view-btn">View seats</button>
                                            </div>
                                        </div>
                                        <div className="bus-card">
                                            <div className="bus-info">
                                                <div className="bus-number">TN02CE6895</div>
                                                <div className="status">IS STARTING</div>
                                                <div className="route">
                                                    From: Hebbal → Hennur Cross → 14 other stops
                                                </div>
                                            </div>
                                            <div className="row align-items-center">
                                                {/* col-lg-4 */}
                                                <div className="col-lg-4">
                                                    <div className="bus-name">
                                                        V Bus Holidays <span>📍</span>
                                                    </div>
                                                    <div className="bus-type">
                                                        Bharat Benz A/C Sleeper (2+1)
                                                    </div>
                                                </div>
                                                {/* col-lg-5 */}
                                                <div className="col-lg-5">
                                                    <div className="bvfbhjsdfbsdf">
                                                        <div className="jdfjsdf78">
                                                            <div className="rating-box">★ 4.9</div>
                                                            <div className="rating-count">1075</div>
                                                        </div>
                                                        <div className="dbfhjsdfds7855">
                                                            <div className="time mt-2">22:30 — 05:20</div>
                                                            <div className="sub-info">
                                                                6h 50m · 10 Seats{" "}
                                                                <span style={{ color: "#d84e55" }}>(1 Single)</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* col-lg-3 */}
                                                <div className="col-lg-3 text-end">
                                                    <div className="offer">Exclusive 7.5% OFF</div>
                                                    <div className="old-price">₹1199</div>
                                                    <div className="new-price">₹999</div>
                                                    <div className="onwards">Onwards</div>
                                                </div>
                                            </div>
                                            {/* line break */}
                                            <div className="dsfsdfsdf" />
                                            {/* bottom */}
                                            <div className="bottom">
                                                <div className="tag">Minimum 10% off on return ticket</div>
                                                <button className="view-btn">View seats</button>
                                            </div>
                                        </div>
                                        <div className="bus-card">
                                            <div className="bus-info">
                                                <div className="bus-number">TN02CE6895</div>
                                                <div className="status">IS STARTING</div>
                                                <div className="route">
                                                    From: Hebbal → Hennur Cross → 14 other stops
                                                </div>
                                            </div>
                                            <div className="row align-items-center">
                                                {/* col-lg-4 */}
                                                <div className="col-lg-4">
                                                    <div className="bus-name">
                                                        V Bus Holidays <span>📍</span>
                                                    </div>
                                                    <div className="bus-type">
                                                        Bharat Benz A/C Sleeper (2+1)
                                                    </div>
                                                </div>
                                                {/* col-lg-5 */}
                                                <div className="col-lg-5">
                                                    <div className="bvfbhjsdfbsdf">
                                                        <div className="jdfjsdf78">
                                                            <div className="rating-box">★ 4.9</div>
                                                            <div className="rating-count">1075</div>
                                                        </div>
                                                        <div className="dbfhjsdfds7855">
                                                            <div className="time mt-2">22:30 — 05:20</div>
                                                            <div className="sub-info">
                                                                6h 50m · 10 Seats{" "}
                                                                <span style={{ color: "#d84e55" }}>(1 Single)</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* col-lg-3 */}
                                                <div className="col-lg-3 text-end">
                                                    <div className="offer">Exclusive 7.5% OFF</div>
                                                    <div className="old-price">₹1280</div>
                                                    <div className="new-price">₹999</div>
                                                    <div className="onwards">Onwards</div>
                                                </div>
                                            </div>
                                            {/* line break */}
                                            <div className="dsfsdfsdf" />
                                            {/* bottom */}
                                            <div className="bottom">
                                                <div className="tag">Minimum 10% off on return ticket</div>
                                                <button className="view-btn">View seats</button>
                                            </div>
                                        </div>
                                        <div className="bus-card">
                                            <div className="bus-info">
                                                <div className="bus-number">TN02CE6895</div>
                                                <div className="status">IS STARTING</div>
                                                <div className="route">
                                                    From: Hebbal → Hennur Cross → 14 other stops
                                                </div>
                                            </div>
                                            <div className="row align-items-center">
                                                {/* col-lg-4 */}
                                                <div className="col-lg-4">
                                                    <div className="bus-name">
                                                        V Bus Holidays <span>📍</span>
                                                    </div>
                                                    <div className="bus-type">
                                                        Bharat Benz A/C Sleeper (2+1)
                                                    </div>
                                                </div>
                                                {/* col-lg-5 */}
                                                <div className="col-lg-5">
                                                    <div className="bvfbhjsdfbsdf">
                                                        <div className="jdfjsdf78">
                                                            <div className="rating-box">★ 4.9</div>
                                                            <div className="rating-count">1075</div>
                                                        </div>
                                                        <div className="dbfhjsdfds7855">
                                                            <div className="time mt-2">22:30 — 05:20</div>
                                                            <div className="sub-info">
                                                                6h 50m · 10 Seats{" "}
                                                                <span style={{ color: "#d84e55" }}>(1 Single)</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* col-lg-3 */}
                                                <div className="col-lg-3 text-end">
                                                    <div className="offer">Exclusive 7.5% OFF</div>
                                                    <div className="old-price">₹680</div>
                                                    <div className="new-price">₹629</div>
                                                    <div className="onwards">Onwards</div>
                                                </div>
                                            </div>
                                            {/* line break */}
                                            <div className="dsfsdfsdf" />
                                            {/* bottom */}
                                            <div className="bottom">
                                                <div className="tag">Minimum 10% off on return ticket</div>
                                                <button className="view-btn">View seats</button>
                                            </div>
                                        </div>
                                        <div className="bus-card">
                                            <div className="bus-info">
                                                <div className="bus-number">TN02CE6895</div>
                                                <div className="status">IS STARTING</div>
                                                <div className="route">
                                                    From: Hebbal → Hennur Cross → 14 other stops
                                                </div>
                                            </div>
                                            <div className="row align-items-center">
                                                {/* col-lg-4 */}
                                                <div className="col-lg-4">
                                                    <div className="bus-name">
                                                        V Bus Holidays <span>📍</span>
                                                    </div>
                                                    <div className="bus-type">
                                                        Bharat Benz A/C Sleeper (2+1)
                                                    </div>
                                                </div>
                                                {/* col-lg-5 */}
                                                <div className="col-lg-5">
                                                    <div className="bvfbhjsdfbsdf">
                                                        <div className="jdfjsdf78">
                                                            <div className="rating-box">★ 4.9</div>
                                                            <div className="rating-count">1075</div>
                                                        </div>
                                                        <div className="dbfhjsdfds7855">
                                                            <div className="time mt-2">22:30 — 05:20</div>
                                                            <div className="sub-info">
                                                                6h 50m · 10 Seats{" "}
                                                                <span style={{ color: "#d84e55" }}>(1 Single)</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* col-lg-3 */}
                                                <div className="col-lg-3 text-end">
                                                    <div className="offer">Exclusive 7.5% OFF</div>
                                                    <div className="old-price">₹680</div>
                                                    <div className="new-price">₹629</div>
                                                    <div className="onwards">Onwards</div>
                                                </div>
                                            </div>
                                            {/* line break */}
                                            <div className="dsfsdfsdf" />
                                            {/* bottom */}
                                            <div className="bottom">
                                                <div className="tag">Minimum 10% off on return ticket</div>
                                                <button className="view-btn">View seats</button>
                                            </div>
                                        </div>
                                        <div className="bus-card">
                                            <div className="bus-info">
                                                <div className="bus-number">TN02CE6895</div>
                                                <div className="status">IS STARTING</div>
                                                <div className="route">
                                                    From: Hebbal → Hennur Cross → 14 other stops
                                                </div>
                                            </div>
                                            <div className="row align-items-center">
                                                {/* col-lg-4 */}
                                                <div className="col-lg-4">
                                                    <div className="bus-name">
                                                        V Bus Holidays <span>📍</span>
                                                    </div>
                                                    <div className="bus-type">
                                                        Bharat Benz A/C Sleeper (2+1)
                                                    </div>
                                                </div>
                                                {/* col-lg-5 */}
                                                <div className="col-lg-5">
                                                    <div className="bvfbhjsdfbsdf">
                                                        <div className="jdfjsdf78">
                                                            <div className="rating-box">★ 4.9</div>
                                                            <div className="rating-count">1075</div>
                                                        </div>
                                                        <div className="dbfhjsdfds7855">
                                                            <div className="time mt-2">22:30 — 05:20</div>
                                                            <div className="sub-info">
                                                                6h 50m · 10 Seats{" "}
                                                                <span style={{ color: "#d84e55" }}>(1 Single)</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* col-lg-3 */}
                                                <div className="col-lg-3 text-end">
                                                    <div className="offer">Exclusive 7.5% OFF</div>
                                                    <div className="old-price">₹680</div>
                                                    <div className="new-price">₹629</div>
                                                    <div className="onwards">Onwards</div>
                                                </div>
                                            </div>
                                            {/* line break */}
                                            <div className="dsfsdfsdf" />
                                            {/* bottom */}
                                            <div className="bottom">
                                                <div className="tag">Minimum 10% off on return ticket</div>
                                                <button className="view-btn">View seats</button>
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
