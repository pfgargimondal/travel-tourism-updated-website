import { useState } from "react";
import { ServiceCategories } from '../ServiceCategories/ServiceCategories';
import Loader from "../Loader/Loader";
import { useLocation, useNavigate } from "react-router-dom";



export const HotelSearch = ({ cities = [], setHotelFilterOptionsToggle }) => {
    // eslint-disable-next-line
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    // const [filteredCities, setFilteredCities] = useState([]);
    // eslint-disable-next-line
    const [selectedCity, setSelectedCity] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const MAX_GUESTS_PER_ROOM = 8;
    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");
    // const [rooms, setRooms] = useState("1 Room 2 Adults");
    // const [price, setPrice] = useState("₹0 - ₹2500");
    const [hotelGstsRmmsDrpdwn, setHotelGstsRmmsDrpdwn] = useState(false);
    const [roomCount, setRoomCount] = useState(1);
    const [adultCount, setAdultCount] = useState(1);
    const [childrenCount, setChildrenCount] = useState(0);
    const [childrenAges, setChildrenAges] = useState([]);
    const [inputFieldsBorder, setInputFieldsBorder] = useState(false);
    const totalGuests = adultCount + childrenCount;
    // eslint-disable-next-line
    const [resHotelSearchToggle, setResHotelSearchToggle] = useState(false);
    /*room count*/

    const roomIncrease = () => {
        setRoomCount(prev => prev + 1);
    };

    const roomDecrease = () => {
        setRoomCount(prev => prev > 1 ? prev - 1 : 1);
    };


    /*adult count*/

    const adultIncrease = () => {
        // setAdultCount(prev => prev + 1);
        if (totalGuests < roomCount * MAX_GUESTS_PER_ROOM) {
            setAdultCount(prev => prev + 1);
        }
    };

    const adultDecrease = () => {
        setAdultCount(prev => prev > 1 ? prev - 1 : 1);
    };


    /*children count*/

    const handleChildrenCount = (type) => {
        if (type === "increase") {
            if (childrenCount === 2) return;

            const newCount = childrenCount + 1;

            setChildrenCount(newCount);

            setChildrenAges([...childrenAges, "1"]);
        }

        if (type === "decrease" && childrenCount > 0) {
            const newCount = childrenCount - 1;

            setChildrenCount(newCount);

            setChildrenAges(childrenAges.slice(0, -1));
        }
    };

    const handleAgeChange = (index, value) => {
        const updatedAges = [...childrenAges];

        updatedAges[index] = value;

        setChildrenAges(updatedAges);
    };


    // useEffect(() => {
    //     if (!search.trim()) {
    //         setFilteredCities([]);
    //         return;
    //     }

    //     const filtered = cities.filter((city) =>
    //         city.city_name.toLowerCase().includes(search.toLowerCase())
    //     );

    //     setFilteredCities(filtered.slice(0, 10));
    // }, [search, cities]);

    const filteredCities = search.trim()
        ? cities
            .filter((city) =>
                city.city_name.toLowerCase().includes(search.toLowerCase())
            )
            .slice(0, 10)
        : [];

    const handleSelectCity = (city) => {
        setSelectedCity(city);
        setSearch(city.city_name);
        setShowDropdown(false);
    };


    // set existing query params in fields
    // useEffect(() => {
    //     const params = new URLSearchParams(location.search);

    //     setSearch(params.get("city") || "");
    //     setCheckIn(params.get("checkin") || "");
    //     setCheckOut(params.get("checkout") || "");

    //     setRoomCount(Number(params.get("rooms")) || 1);
    //     setAdultCount(Number(params.get("adults")) || 1);
    //     setChildrenCount(Number(params.get("children")) || 0);

    //     setPrice(params.get("price") || "₹0 - ₹2500");

    // }, [location.search]);

    const handleSearch = () => {
        const params = new URLSearchParams({
            city: search,
            checkin: checkIn,
            checkout: checkOut,
            rooms: roomCount,
            adults: adultCount,
            children: childrenCount,
            // price: price
        });

        navigate(`/hotel-filter?${params.toString()}`);
    };

    return (
        <div>
            {loading && <Loader />}
            <div className="jfdbvjfbv788">
                <section className="menu-section">
                    <div className="container my-5">
                        <ServiceCategories setResHotelSearchToggle={setResHotelSearchToggle} />

                        {window.innerWidth <= 991 && (
                            <div className={`${(window.innerWidth <= 991 && resHotelSearchToggle) ? "hotel-filter-options-wrapper-backdrop" : "hotel-filter-options-wrapper-backdrop hotel-filter-options-wrapper-backdrop-hide"} position-fixed top-0 start-0 end-0 bottom-0 w-100 h-100`}></div>
                        )}

                        <div className={`flight-main-card hotel-search-options-wrapper ${(window.innerWidth <= 991 && resHotelSearchToggle) ? "hotel-filter-options-res-wrapper" : "hotel-filter-options-res-wrapper hotel-filter-options-res-wrapper-hide"}`}>
                            {window.innerWidth <= 991 && (
                                <div className="flight-filter-options-header d-flex align-items-center justify-content-between">
                                    <h4 className="mb-0">Hotel Search</h4>

                                    <i onClick={() => setResHotelSearchToggle(false)} className="fa-solid fa-xmark"></i>
                                </div>
                            )}

                            {(window.innerWidth <= 600 && location.pathname.startsWith("/hotel-filter")) && (
                                <div className="hotel-filter-options-header d-flex align-items-center justify-content-between">
                                    <h4 className="mb-0">Modify Hotel Search</h4>

                                    <i onClick={() => setHotelFilterOptionsToggle(false)} className="fa-solid fa-xmark"></i>
                                </div>
                            )}
                            
                            <div className="iuneiuirjerewr d-flex align-items-center gap-3 my-3">
                                <div className="checkbox-wrapper-15">
                                    <input
                                        className="inp-cbx"
                                        id="cbx-sadw"
                                        name="htl"
                                        type="checkbox"
                                        style={{ display: "none" }}
                                    />

                                    <label className="cbx mb-0" htmlFor="cbx-sadw">
                                        <span>
                                            <svg width="12px" height="9px" viewBox="0 0 12 9">
                                                <polyline points="1 5 4 8 11 1" />
                                            </svg>
                                        </span>
                                        <span>Upto 4 Rooms</span>
                                    </label>
                                </div>

                                <div className="checkbox-wrapper-15">
                                    <input
                                        className="inp-cbx"
                                        id="cbx-fdf"
                                        name="htl"
                                        type="checkbox"
                                        style={{ display: "none" }}
                                    />

                                    <label className="cbx mb-0" htmlFor="cbx-fdf">
                                        <span>
                                            <svg width="12px" height="9px" viewBox="0 0 12 9">
                                                <polyline points="1 5 4 8 11 1" />
                                            </svg>
                                        </span>
                                        <span>Group Deals</span>
                                    </label>
                                </div>
                            </div>

                            <div className="uisndfihsdjff row align-items-center g-4">
                                <div className="col-md-3 position-relative">
                                    <label className="form-label">City, Property Name Or Location</label>
                                    
                                    <div className="idjweiuhwerkowerewr position-relative">
                                        <input
                                            type="text"
                                            className="form-control hotel-input"
                                            placeholder="Enter City (e.g Goa)"
                                            value={search}
                                            onChange={(e) => {
                                                setSearch(e.target.value);
                                                setShowDropdown(true);
                                            }}
                                        />

                                        <i className="bi position-absolute bi-geo-alt-fill"></i>
                                    </div>

                                    {showDropdown && filteredCities.length > 0 && (
                                        <div className="city-dropdown">
                                            {filteredCities.map((city) => (
                                                <div
                                                    key={city.city_code}
                                                    className="city-item"
                                                    onClick={() => handleSelectCity(city)}
                                                >
                                                    {city.city_name}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="col-md-3">
                                    <div className="ixjamdfoief fxnsdfccs">
                                        <label className="form-label">Check-In</label>

                                        <input
                                            type="date"
                                            id="checkin"
                                            className="form-control hotel-input"
                                            value={checkIn}
                                            min={new Date().toISOString().split("T")[0]}
                                            onChange={(e) => setCheckIn(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="col-md-3">
                                    <div className="ixjamdfoief fxnsdfccs">
                                        <label className="form-label">Check-Out</label>

                                        <input
                                            type="date"
                                            id="checkout"
                                            className="form-control hotel-input"
                                            value={checkOut}
                                            min={checkIn}
                                            onChange={(e) => setCheckOut(e.target.value)}
                                        />
                                    </div>                                    
                                </div>

                                <div className="col-md-3 position-relative">
                                    <div className="ixjamdfoief xbdzfnfxbdv">
                                        <label className="form-label">Rooms & Guests</label>

                                        {/* <select className="form-control hotel-input"
                                            value={rooms}
                                            onChange={(e) => setRooms(e.target.value)}
                                        >
                                            <option>1 Room 2 Adults</option>
                                            <option>1 Room 1 Adult</option>
                                            <option>2 Rooms 4 Adults</option>
                                        </select> */}

                                        <div className={`form-control ${inputFieldsBorder ? "nkfnjihijmkfcsd" : ""} lmflojlkerr hotel-input vdxbfcsffff position-relative`}
                                            onClick={() => {
                                                setHotelGstsRmmsDrpdwn(prev => !prev);
                                                setInputFieldsBorder(prev => !prev);
                                            }}
                                        >
                                            <i className="bi position-absolute vbzvsbzdb  bi-person-fill"></i>

                                            {roomCount} Room{roomCount > 1 ? "s" : ""} •{" "}
                                            {adultCount} Adult{adultCount > 1 ? "s" : ""} •{" "}
                                            {childrenCount} Child{childrenCount > 0 ? "ren" : ""}                                            
                                        </div>

                                        {hotelGstsRmmsDrpdwn && (
                                            <div className="rg-drpdwn position-absolute p-4 rounded-2 bg-white">
                                                <div className="d-flex align-items-center justify-content-between mb-3">
                                                    <p className="mb-0 dnfreqer">Room</p>

                                                    <div className="defgeghwewr d-flex align-items-center px-2 py-1">
                                                        <button onClick={roomDecrease} className="btn-transparent"><i class="bi bi-dash-lg"></i></button>

                                                        <input type="number" value={roomCount} placeholder="1" className="form-control" />

                                                        <button onClick={roomIncrease} className="btn-transparent"><i class="bi bi-plus-lg"></i></button>
                                                    </div>
                                                </div>

                                                <div className="d-flex align-items-center justify-content-between mb-3">
                                                    <p className="mb-0 dnfreqer">Adults</p>

                                                    <div className="defgeghwewr d-flex align-items-center px-2 py-1">
                                                        <button onClick={adultDecrease} className="btn-transparent"><i class="bi bi-dash-lg"></i></button>

                                                        <input type="number" value={adultCount} className="form-control" />

                                                        <button onClick={adultIncrease} className="btn-transparent"><i class="bi bi-plus-lg"></i></button>
                                                    </div>
                                                    
                                                </div>
                                                <span>
                                                    {totalGuests >= roomCount * MAX_GUESTS_PER_ROOM && (
                                                        <p className="text-danger mt-1 mb-1">
                                                            Maximum {MAX_GUESTS_PER_ROOM} guests allowed per room
                                                        </p>
                                                    )}
                                                </span>
                                                <div className="d-flex align-items-center justify-content-between mb-3">
                                                    <div className="diweirkwer d-flex flex-column">
                                                        <p className="mb-0 dnfreqer">Children</p>

                                                        <span>0 - 17 Years Old</span>
                                                    </div>

                                                    <div className="defgeghwewr d-flex align-items-center px-2 py-1">
                                                        <button onClick={() => handleChildrenCount("decrease")} className="btn-transparent"><i class="bi bi-dash-lg"></i></button>

                                                        <input type="number" value={childrenCount} placeholder="1" className="form-control" />

                                                        <button onClick={() => handleChildrenCount("increase")} className="btn-transparent"><i class="bi bi-plus-lg"></i></button>
                                                    </div>
                                                </div>

                                                {childrenCount > 0 && (
                                                    <div className="diwerjwerwer mb-3">
                                                        <h6 className="mb-2">Age(s) of Children</h6>

                                                        <div className="dihuewreow d-inline-flex align-items-center">
                                                            {Array.from({ length: childrenCount }).map((_, index) => (
                                                                <select
                                                                    className="form-select me-3"
                                                                    key={index}
                                                                    value={childrenAges[index]}
                                                                    onChange={(e) =>
                                                                        handleAgeChange(index, e.target.value)
                                                                    }
                                                                >
                                                                    <option value="1">1</option>
                                                                    <option value="2">2</option>
                                                                    <option value="3">3</option>
                                                                    <option value="4">4</option>
                                                                    <option value="5">5</option>
                                                                    <option value="6">6</option>
                                                                    <option value="7">7</option>
                                                                    <option value="8">8</option>
                                                                    <option value="9">9</option>
                                                                    <option value="10">10</option>
                                                                    <option value="11">11</option>
                                                                    <option value="12">12</option>
                                                                    <option value="13">13</option>
                                                                    <option value="14">14</option>
                                                                    <option value="15">15</option>
                                                                    <option value="16">16</option>
                                                                    <option value="17">17</option>
                                                                </select>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                <h6 className="klkifyter mb-0">Please provide right number of children along with their right age for best options and prices.</h6>

                                                <div className="text-end">
                                                    <button onClick={() => setHotelGstsRmmsDrpdwn(false)}
                                                        className="btn btn-tour mt-3">APPLY</button>
                                                </div>
                                            </div>
                                        )}
                                    </div>                                    
                                </div>
                                {/* <div className="col-md-2">
                                <label>Price Per Night</label>
                                <select className="form-select hotel-input" 
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                >
                                    <option>₹0 - ₹2500</option>
                                    <option>₹2500 - ₹5000</option>
                                    <option>₹5000+</option>
                                </select>
                                </div> */}
                            </div>

                            {window.innerWidth <= 991 && (
                                <div className="text-center mt-4 ">
                                    <button className="flight-search-btn" onClick={handleSearch}>SEARCH</button>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {window.innerWidth > 991 && (
                    <div className="ghaadasd">
                        <div className="text-center mt-4 ">
                            <button className="flight-search-btn" onClick={handleSearch}>SEARCH</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
