import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./Home.css";
import http from "../../http";
import { FollowUsInstagram } from "../../component/FollowUsInstagram/FollowUsInstagram";
import { Testimonial } from "../Testimonial/Testimonial";
import { ServiceCategories } from "../../component/ServiceCategories/ServiceCategories";
import Loader from "../../component/Loader/Loader";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";



export const Home = () => {

const navigate = useNavigate();
const [homeContent, setHomeContent] = useState(null);
const [homeBanners, setHomeBanners] = useState([]);
const [imageUrl, setImageUrl] = useState("");
const [loading, setLoading] = useState(false);
const [index, setIndex] = useState(0);
const [flightDrpdwn, setFlightDrpdwn] = useState(false);

const [airportList, setAirportList] = useState([]);
const [selectedOrigin, setSelectedOrigin] = useState("");
const [selectedDestination, setSelectedDestination] = useState("");
   // eslint-disable-next-line
const [availableDates, setAvailableDates] = useState([]);
   // eslint-disable-next-line
const [selectedDate, setSelectedDate] = useState("");
   // eslint-disable-next-line
const [departureDate, setDepartureDate] = useState(new Date());
const [resHomeFlightSearchToggle, setResHomeFlightSearchToggle] = useState(false);



   // eslint-disable-next-line
const [returnDate, setReturnDate] = useState(() => {
  const rtrn = new Date(departureDate);  
  rtrn.setDate(rtrn.getDate() + 1);

  return rtrn;
});

const [tripType, setTripType] = useState(0);
const [cabinClass, setCabinClass] = useState("0");
// eslint-disable-next-line
const [travelType, setTravelType] = useState(0);
// const MAX_GUESTS_PER_ROOM = 8;


// const [roomCount, setRoomCount] = useState(1);
const [adultCount, setAdultCount] = useState(1);
const [childrenCount, setChildrenCount] = useState(0);

const [childrenAges, setChildrenAges] = useState([]);

const [infantCount, setInfantCount] = useState(0);
const [infantAges, setInfantAges] = useState([]);

// const totalGuests = adultCount + childrenCount + infantCount;

/*room count*/

  // const roomIncrease = () => {
  //     setRoomCount(prev => prev + 1);
  // };

  // const roomDecrease = () => {
  //     setRoomCount(prev => prev > 1 ? prev - 1 : 1);
  // };


  /*adult count*/

  const adultIncrease = () => {
      // setAdultCount(prev => prev + 1);
      // if (totalGuests < roomCount * MAX_GUESTS_PER_ROOM) {
          setAdultCount(prev => prev + 1);
      // }
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

  const handleInfantCount = (type) => {
      if (type === "increase") {
          if (infantCount === 2) return;
          
          const newCount = infantCount + 1;

          setInfantCount(newCount);

          setInfantAges([...infantAges, "1"]);
      }

      if (type === "decrease" && infantCount > 0) {
          const newCount = infantCount - 1;

          setInfantCount(newCount);

          setInfantAges(infantAges.slice(0, -1));
      }
  };



  useEffect(() => {
    const fetchHomeData = async () => {
        setLoading(true);

        try {
            const response = await http.get("/get-home-content");

            if (response.data.success) {
                setHomeContent(response.data.data.content);
                setHomeBanners(response.data.data.banners);
                setImageUrl(response.data.data.image_url);
            } else {
                console.error(response.data.message);
            }

        } catch (error) {
            console.error("Error fetching home data:", error);
        } finally {
            setLoading(false);
        }
    };

      fetchHomeData();
  }, []);

  const title = homeContent?.second_section_title || "";
  const words = title.split(" ");

  const titleOne = homeContent?.fourth_section_title || "";
  const wordsOne = titleOne.split(" ");
  const half = Math.ceil(wordsOne.length / 2);

  const firstLine = wordsOne.slice(0, half).join(" ");
  const secondLine = wordsOne.slice(half).join(" ");

  useEffect(() => {
      if (homeBanners.length === 0) return;

      const slider = setInterval(() => {
        setIndex((prev) => (prev + 1) % homeBanners.length);
      }, 5000);

      return () => clearInterval(slider);
    }, [homeBanners]);

  const slide = homeBanners[index];


  useEffect(() => {
    const fetchAirportList = async () => {
      setLoading(true);

      try {
        const response = await http.get("/get-airport-list");

        if (response.data.status) {
          setAirportList(response.data.airportList || []);
        }
      } catch (error) {
        console.error("Error fetching airport list:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAirportList();
  }, []);

  // Unique origins
  const origins = [
    ...new Map(
      airportList.map((item) => [
        item.origin,
        {
          code: item.origin,
          details: item.origin_details,
        },
      ])
    ).values(),
  ];

  // Destinations based on selected origin
  const destinations = [
    ...new Map(
      airportList
        .filter((item) => item.origin === selectedOrigin)
        .map((item) => [
          item.destination,
          {
            code: item.destination,
            details: item.destination_details,
          },
        ])
    ).values(),
  ];

  // Update available dates when origin & destination selected

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!selectedOrigin || !selectedDestination) {
      setAvailableDates([]);
      return;
    }

    const route = airportList.find(
      item =>
        item.origin === selectedOrigin &&
        item.destination === selectedDestination
    );

    if (!route?.AvailableDates) {
      setAvailableDates([]);
      return;
    }

    const dates = route.AvailableDates.split("|").map((date) => {
      const [month, day, year] = date.split("/");
      return new Date(year, month - 1, day);
    });

    setAvailableDates(dates);

    // Set first available date only when route changes
    // eslint-disable-next-line
    const futureDates = dates.filter(d => d >= today);

  }, [selectedOrigin, selectedDestination, airportList]);

  const handleSwap = () => {
    if (!selectedOrigin || !selectedDestination) return;

    const origin = selectedOrigin;
    const destination = selectedDestination;

    setSelectedOrigin(destination);
    setSelectedDestination(origin);
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };
  const handleFlightSearch = () => {

      const searchData = {
          origin: selectedOrigin,
          destination: selectedDestination,

          departureDate: departureDate
              ? formatDate(departureDate)
              : "",

          returnDate: returnDate
              ? formatDate(returnDate)
              : "",

          adults: adultCount,
          children: childrenCount,
          infants: infantCount,
          travelType: travelType,
          tripType: tripType,
          cabinClass: cabinClass
      };
      const params = new URLSearchParams(searchData);
      navigate(`/flight-filter?${params.toString()}`);
  };

  useEffect(() => {
    if (tripType === 0) {
      setReturnDate(null);
    }
  }, [tripType]);

  if (loading) return <Loader />;
  if (!slide) return null;

 

  return (
    <div>
       {loading && <Loader />}
      <section
        className="hero-section position-relative"
        style={{
          background: `url(${imageUrl}/${slide.banner_image}) center center / cover no-repeat`,
          height: "400px",
          transition: "all 0.5s ease"
        }}
      >
        <div className="container text-center hero-content">

          <p className="offer-text">
            {slide.top_heading}
          </p>

          <h1 className="hero-title">
            {slide.main_heading}
          </h1>

          <p className="hero-description">
            {slide.title_one}
          </p>

          <p className="price-text">
            {slide.title_two}
          </p>

          <div className="nbgfgf55">
            <button className="btn btn-tour mt-3">
              Take a Tour →
            </button>
          </div>

        </div>
      </section>

      <section className="menu-section">
        <div className="container my-5">
          <ServiceCategories setResHomeFlightSearchToggle={setResHomeFlightSearchToggle} />

          {window.innerWidth <= 991 && (
            <div className={`${(window.innerWidth <= 991 && resHomeFlightSearchToggle) ? "flight-filter-options-wrapper-backdrop" : "flight-filter-options-wrapper-backdrop flight-filter-options-wrapper-backdrop-hide"} position-fixed top-0 start-0 end-0 bottom-0 w-100 h-100`}></div>
          )}

          <div className={`flight-main-card unsduhfsdiujfsdf flight-filter-options-wrapper ${(window.innerWidth <= 991 && resHomeFlightSearchToggle) ? "flight-filter-options-res-wrapper" : "flight-filter-options-res-wrapper flight-filter-options-res-wrapper-hide"}`}>
            {window.innerWidth <= 991 && (
              <div className="flight-filter-options-header d-flex align-items-center justify-content-between">
                <h4 className="mb-0">Flight Search</h4>

                <i onClick={() => setResHomeFlightSearchToggle(false)} className="fa-solid fa-xmark"></i>
              </div>
            )}

            <div className="flight-content-area mt-3">
              <div className="flight-trip-type d-flex align-items-center mb-3">
                <div className="checkbox-wrapper-15">
                  <input
                    className="inp-cbx"
                    id="cbx-15"
                    name="flight"
                    type="radio"
                    style={{ display: "none" }}
                    checked={tripType === 0}
                    onChange={() => {setTripType(0); setReturnDate(null); }}
                  />

                  <label className="cbx" htmlFor="cbx-15">
                    <span>
                      <svg width="12px" height="9px" viewBox="0 0 12 9">
                        <polyline points="1 5 4 8 11 1" />
                      </svg>
                    </span>
                    <span>One Way</span>
                  </label>
                </div> 

                <div className="checkbox-wrapper-15">
                  <input
                    className="inp-cbx"
                    id="cbx-16"
                    name="flight"
                    type="radio"
                    style={{ display: "none" }}
                    checked={tripType === 1}
                    // onChange={() => setTripType(1)}
                    onChange={() => {
                      setTripType(1);

                      if (departureDate) {
                        const nextDay = new Date(departureDate);
                        nextDay.setDate(nextDay.getDate() + 1);
                        setReturnDate(nextDay);
                      }
                    }}
                  />

                  <label className="cbx" htmlFor="cbx-16">
                    <span>
                      <svg width="12px" height="9px" viewBox="0 0 12 9">
                        <polyline points="1 5 4 8 11 1" />
                      </svg>
                    </span>
                    <span>Round Trip</span>
                  </label>
                </div>

                <div className="checkbox-wrapper-15">
                  <input
                    className="inp-cbx"
                    id="cbx-17"
                    name="flight"
                    type="radio"
                    style={{ display: "none" }}
                    checked={tripType === 2}
                    onChange={() => setTripType(2)}
                  />

                  <label className="cbx" htmlFor="cbx-17">
                    <span>
                      <svg width="12px" height="9px" viewBox="0 0 12 9">
                        <polyline points="1 5 4 8 11 1" />
                      </svg>
                    </span>
                    <span>Multi City</span>
                  </label>
                </div>
              </div>

              <div className="form row g-4">
                <div className="col-lg-5">
                  <div className="jndijfksdf row align-items-center">
                    <div className="col-md-5 col-5 res-deprtr-gng-frm">
                      <label className="form-label">Departure From</label>

                      {/* <input type="text" className="form-control" placeholder="New Delhi DEL, Indira Gandhi International" /> */}
                      <select
                        className="form-control"
                        value={selectedOrigin}
                        onChange={(e) => {
                          setSelectedOrigin(e.target.value);
                          setSelectedDestination("");
                        }}
                      >
                        <option value="">Select Origin</option>

                        {origins.map((origin, index) => (
                          <option key={index} value={origin.code}>
                            {origin.details
                              ? `${origin.code} - ${origin.details?.city}, ${origin.details?.country} - ${origin.details?.airport_name}`
                              : origin.code}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-2 col-2 res-btwn-crcl text-center">
                      <div className="circle" onClick={handleSwap}
                        style={{
                          cursor: "pointer",
                          marginTop: "25px"
                        }}>
                        <i className="fa-solid fa-right-left"></i>
                      </div>
                    </div>

                    <div className="col-md-5 col-5 res-deprtr-gng-frm">
                      <div className="uinenrhr">
                        <label className="form-label">Going To</label>
                        {/* <input type="text" className="form-control" placeholder="New Delhi DEL, Indira Gandhi International" /> */}
                        <select
                            className="form-control"
                            value={selectedDestination}
                            onChange={(e) => setSelectedDestination(e.target.value)}
                            disabled={!selectedOrigin}
                          >
                            <option value="">Select Destination</option>

                            {destinations.map((destination, index) => (
                              <option key={index} value={destination.code}>
                                {destination.details
                                  ? `${destination.code} - ${destination.details?.city}, ${destination.details?.country} - ${destination.details?.airport_name}`
                                  : destination.code}
                              </option>
                            ))}
                          </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-lg-7">
                  <div className="row dnfggfshgjhfghdff">
                    <div className="col-md-4 col-md-4 col-sm-6 col-6">
                      <label className="form-label">Departure Date</label>
                         
                      {/* <input type="date" className="form-control" placeholder="New Delhi DEL, Indira Gandhi International" /> */}
                      <DatePicker
                        selected={departureDate}
                        // includeDates={
                        //   availableDates.length > 0
                        //     ? availableDates
                        //     : undefined
                        // }
                        // onChange={(date) => {
                        //   setDepartureDate(date);
                        // }}
                        onChange={(date) => {
                          setDepartureDate(date);

                          if (tripType === 1 && date) {
                            const nextDay = new Date(date);
                            nextDay.setDate(nextDay.getDate() + 1);
                            setReturnDate(nextDay);
                          }
                        }}
                        minDate={new Date()}
                        dateFormat="dd MMM yyyy"
                        className="form-control"
                      />
                    </div>

                    <div className="col-md-4 col-md-4 col-sm-6 col-6">
                      <label className="form-label">Return Date</label>
                      
                      {/* <input type="date" className="form-control" placeholder="New Delhi DEL, Indira Gandhi International" /> */}
                      <DatePicker
                        selected={returnDate}
                        onChange={(date) => setReturnDate(date)}
                        minDate={departureDate || new Date()}
                        dateFormat="dd MMM yyyy"
                        className="form-control"
                        disabled={tripType === 0}
                      />
                    </div>

                    <div className="col-md-4 col-md-4 col-sm-6 col-6 position-relative">
                      <label className="form-label">Travellers & Class</label>

                      <div className="form-control hotel-input vdxbfcsffff"
                          onClick={() => setFlightDrpdwn(prev => !prev)}
                      >
                          {adultCount} Adult{adultCount > 1 ? "s" : ""} •{" "}
                          {childrenCount} Child{childrenCount > 0 ? "ren" : ""} •{" "}
                          {infantCount} Infant{infantCount > 0 ? "s" : ""}
                      </div>
                      
                      {flightDrpdwn && (
                        <div className="rg-drpdwn dfghdgfsfee position-absolute p-4 rounded-2 bg-white">
                            <div className="d-flex align-items-center justify-content-between mb-3">
                                <div className="diweirkwer d-flex flex-column">
                                    <p className="mb-0 dnfreqer">Adults</p>

                                    <span>12+ Years</span>
                                </div>

                                <div className="defgeghwewr d-flex align-items-center px-2 py-1">
                                    <button onClick={adultDecrease} className="btn-transparent"><i class="bi bi-dash-lg"></i></button>

                                    <input type="number" value={adultCount} placeholder="1" className="form-control" />

                                    <button onClick={adultIncrease} className="btn-transparent"><i class="bi bi-plus-lg"></i></button>
                                </div>
                            </div>

                            <div className="d-flex align-items-center justify-content-between mb-3">
                                <div className="diweirkwer d-flex flex-column">
                                    <p className="mb-0 dnfreqer">Children</p>

                                    <span>2 - 12 Years</span>
                                </div>

                                <div className="defgeghwewr d-flex align-items-center px-2 py-1">
                                    <button onClick={() => handleChildrenCount("decrease")} className="btn-transparent"><i class="bi bi-dash-lg"></i></button>

                                    <input type="number" value={childrenCount} className="form-control" />

                                    <button onClick={() => handleChildrenCount("increase")} className="btn-transparent"><i class="bi bi-plus-lg"></i></button>
                                </div>
                            </div>

                            <div className="d-flex align-items-center justify-content-between mb-3">
                                <div className="diweirkwer d-flex flex-column">
                                    <p className="mb-0 dnfreqer">Infant</p>

                                    <span>0 - 2 Years</span>
                                </div>

                                <div className="defgeghwewr d-flex align-items-center px-2 py-1">
                                    <button onClick={() => handleInfantCount("decrease")} className="btn-transparent"><i class="bi bi-dash-lg"></i></button>

                                    <input type="number" value={infantCount} placeholder="1" className="form-control" />

                                    <button onClick={() => handleInfantCount("increase")} className="btn-transparent"><i class="bi bi-plus-lg"></i></button>
                                </div>
                            </div>

                            <div className="doeiwjrpwere">
                              <div className="checkbox-wrapper-15">
                                <input
                                  className="inp-cbx"
                                  id="cbx-16c"
                                  name="flightad"
                                  type="radio"
                                  style={{ display: "none" }}
                                  checked={cabinClass === "0"}
                                  onChange={() => setCabinClass("0")}
                                />

                                <label className="cbx" htmlFor="cbx-16c">
                                  <span>
                                    <svg width="12px" height="9px" viewBox="0 0 12 9">
                                      <polyline points="1 5 4 8 11 1" />
                                    </svg>
                                  </span>
                                  <span>Economy</span>
                                </label>
                              </div>

                              <div className="checkbox-wrapper-15">
                                <input
                                  className="inp-cbx"
                                  id="cbx-16n"
                                  name="flightad"
                                  type="radio"
                                  style={{ display: "none" }}
                                  checked={cabinClass === "3"}
                                  onChange={() => setCabinClass("3")}
                                />

                                <label className="cbx" htmlFor="cbx-16n">
                                  <span>
                                    <svg width="12px" height="9px" viewBox="0 0 12 9">
                                      <polyline points="1 5 4 8 11 1" />
                                    </svg>
                                  </span>
                                  <span>Premium Economy</span>
                                </label>
                              </div>

                              <div className="checkbox-wrapper-15">
                                <input
                                  className="inp-cbx"
                                  id="cbx-16j"
                                  name="flightad"
                                  type="radio"
                                  style={{ display: "none" }}
                                  checked={cabinClass === "1"}
                                  onChange={() => setCabinClass("1")}
                                />

                                <label className="cbx" htmlFor="cbx-16j">
                                  <span>
                                    <svg width="12px" height="9px" viewBox="0 0 12 9">
                                      <polyline points="1 5 4 8 11 1" />
                                    </svg>
                                  </span>
                                  <span>Business</span>
                                </label>
                              </div>

                              <div className="checkbox-wrapper-15">
                                <input
                                  className="inp-cbx"
                                  id="cbx-16i"
                                  name="flightad"
                                  type="radio"
                                  style={{ display: "none" }}
                                  checked={cabinClass === "2"}
                                  onChange={() => setCabinClass("2")}
                                />

                                <label className="cbx" htmlFor="cbx-16i">
                                  <span>
                                    <svg width="12px" height="9px" viewBox="0 0 12 9">
                                      <polyline points="1 5 4 8 11 1" />
                                    </svg>
                                  </span>
                                  <span>First Class</span>
                                </label>
                              </div>
                            </div>

                            <div className="text-end">
                                <button onClick={() => setFlightDrpdwn(false)}
                                  className="btn btn-tour mt-3">APPLY</button>
                            </div>
                        </div>
                    )}  
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <h6 className="mb-3"><b>SPECIAL FARES</b></h6>
                <div className="d-flex gap-2 flex-wrap dfkmkdf">
                  <div className="asdfhgjhhghgf">
                    <input
                      className="inp-cbx"
                      id="cbx-lh"
                      name="aghfhrr"
                      type="radio"
                      style={{ display: "none" }}
                    />

                    <label className="cbx" htmlFor="cbx-lh">                      
                      <span>Regular</span>
                    </label>
                  </div>

                  <div className="asdfhgjhhghgf">
                    <input
                      className="inp-cbx"
                      id="cbx-ku"
                      name="aghfhrr"
                      type="radio"
                      style={{ display: "none" }}
                    />

                    <label className="cbx" htmlFor="cbx-ku">                      
                      <span>Student</span>
                    </label>
                  </div>

                  <div className="asdfhgjhhghgf">
                    <input
                      className="inp-cbx"
                      id="cbx-kh"
                      name="aghfhrr"
                      type="radio"
                      style={{ display: "none" }}
                    />

                    <label className="cbx" htmlFor="cbx-kh">                      
                      <span>Armed Forces</span>
                    </label>
                  </div>

                  <div className="asdfhgjhhghgf">
                    <input
                      className="inp-cbx"
                      id="cbx-gd"
                      name="aghfhrr"
                      type="radio"
                      style={{ display: "none" }}
                    />

                    <label className="cbx" htmlFor="cbx-gd">                      
                      <span>Senior Citizen</span>
                    </label>
                  </div>

                  <div className="asdfhgjhhghgf">
                    <input
                      className="inp-cbx"
                      id="cbx-asd"
                      name="aghfhrr"
                      type="radio"
                      style={{ display: "none" }}
                    />

                    <label className="cbx" htmlFor="cbx-asd">                      
                      <span>Doctor & Nurses</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {window.innerWidth <= 991 && (
              <div className="text-center mt-4 ">
                <button className="flight-search-btn" onClick={handleFlightSearch}>Search</button>
              </div>
            )}
          </div>
        </div>
      </section>

      {window.innerWidth > 991 && (
        <div className="ghaadasd">
          <div className="text-center mt-4 ">
            <button className="flight-search-btn" onClick={handleFlightSearch}>Search</button>
          </div>
        </div>
      )}

      <section className="top-destinations py-5">
        <div className="container">
          <div className="text-center mb-4">
            <h2 className="main-title mb-2" data-aos="fade-down">
              {words[0]}{" "}
              <span>{words.slice(1).join(" ")}</span>
            </h2>

            <div className="section-desc"
              dangerouslySetInnerHTML={{
                __html: homeContent?.second_section_description
              }}
            ></div>
          </div>

          <div className="row aihcishdf g-4">
            <div className="col-lg-8 ifnishdfds">
              <div className="col-lg-12 isiudhfjfdf mb-4">
                <div className="destiny-card large-card">
                  <img src="./images/desleftup.jpg" alt="" />
                  <div className="card-content">
                    <div>
                      <p className="country">Italy</p>
                      <h4>Caspian Valley</h4>
                    </div>
                    <span className="tour-badge">18 Tours</span>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 fgdfgfdg">
                  <div className="destiny-card small-card">
                    <img src="./images/desleftdolef.jpg" alt="" />
                    <div className="card-content">
                      <div>
                        <p className="country">Moscow</p>
                        <h4>Russia</h4>
                      </div>
                      <span className="tour-badge">15 Tours</span>
                    </div>
                  </div>
                </div>

                <div className="col-md-6 fgdfgfdg">
                  <div className="destiny-card small-card">
                    <img src="./images/desleftdorit.jpg" alt="" />
                    <div className="card-content">
                      <div>
                        <p className="country">Florida</p>
                        <h4>America</h4>
                      </div>
                      <span className="tour-badge">32 Tours</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4 ifnishdfds">
              <div className="destiny-card tall-card">
                <img src="./images/destiright.jpg" alt="" />
                <div className="card-content">
                  <div>
                    <p className="country">England</p>
                    <h4>London</h4>
                  </div>
                  <span className="tour-badge">15 Tours</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="popular-destinations py-5">
        <div className="container">
          <div className="dieworwerwer mb-5">
            <div className="row align-items-center mb-4">
              <div className="col-lg-5">
                <h2 className="secondary-heading mb-0">
                  {homeContent?.third_section_heading}
                </h2>
              </div>

              <div className="col-lg-7">
                <div className="dasbnzfxdgdxdfd text-end">
                  <Link to="/">
                    <button className="btn btn-tour">See all the locations ↗</button>
                  </Link>
                </div>
              </div>
            </div>

            <div className="row g-4 domestic-row">
              <div className="col-6 col-md-4 col-lg custom-col">
                <div className="destination-card">
                  <img src="./images/mumbai.png" alt="" />
                  <div className="overlay">
                    <h5>Mumbai</h5>
                    
                    <div className="diewrwerew">
                      <p>Starting from</p>
                      <h6>₹9,107</h6>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-6 col-md-4 col-lg custom-col">
                <div className="destination-card">
                  <img src="./images/bangalore.png" alt="" />
                  <div className="overlay">
                    <h5>Bangalore</h5>

                    <div className="diewrwerew">
                      <p>Starting from</p>
                      <h6>₹11,398</h6>
                    </div>                  
                  </div>
                </div>
              </div>

              <div className="col-6 col-md-4 col-lg custom-col">
                <div className="destination-card">
                  <img src="./images/pune.png" alt="" />
                  <div className="overlay">
                    <h5>Pune</h5>

                    <div className="diewrwerew">
                      <p>Starting from</p>
                      <h6>₹9,438</h6>  
                    </div>                  
                  </div>
                </div>
              </div>

              <div className="col-6 col-md-4 col-lg custom-col">
                <div className="destination-card">
                  <img src="./images/kolkata.png" alt="" />
                  <div className="overlay">
                    <h5>Kolkata</h5>

                    <div className="diewrwerew">
                      <p>Starting from</p>
                      <h6>₹8,181</h6>  
                    </div>                  
                  </div>
                </div>
              </div>

              <div className="col-6 col-md-4 col-lg custom-col">
                <div className="destination-card">
                  <img src="./images/hydrabad.png" alt="" />
                  <div className="overlay">
                    <h5>Hyderabad</h5>

                    <div className="diewrwerew">
                      <p>Starting from</p>
                      <h6>₹9,508</h6>  
                    </div>                  
                  </div>
                </div>
              </div>

              <div className="col-6 col-md-4 col-lg custom-col">
                <div className="destination-card">
                  <img src="./images/goa.png" alt="" />
                  <div className="overlay">
                    <h5>Goa</h5>

                    <div className="diewrwerew">
                      <p>Starting from</p>
                      <h6>₹9,736</h6>  
                    </div>                  
                  </div>
                </div>
              </div>

              <div className="col-6 col-md-4 col-lg custom-col">
                <div className="destination-card">
                  <img src="./images/chennai.png" alt="" />
                  <div className="overlay">
                    <h5>Chennai</h5>

                    <div className="diewrwerew">
                      <p>Starting from</p>
                      <h6>₹10,745</h6>
                    </div>                  
                  </div>
                </div>
              </div>

              <div className="col-6 col-md-4 col-lg custom-col">
                <div className="destination-card">
                  <img src="./images/amhedabad.png" alt="" />
                  <div className="overlay">
                    <h5>Ahmedabad</h5>

                    <div className="diewrwerew">
                      <p>Starting from</p>
                      <h6>₹7,071</h6>  
                    </div>                  
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="dieworwerwer pt-5">
            <div className="row align-items-center mb-4">
              <div className="col-lg-6">
                <h2 className="secondary-heading mb-0">
                  {homeContent?.mid_section_heading}
                </h2>
              </div>

              <div className="col-lg-6">
                <div className="dasbnzfxdgdxdfd text-end">
                  <Link to="/">
                    <button className="btn btn-tour">See all the locations ↗</button>
                  </Link>
                </div>
              </div>
            </div>

            <div className="row g-4">
              <div className="col-lg-2 col-md-4 col-6">
                <div className="destination-card">
                  <img src="./images/topdesti.png" alt="" />
                  <div className="overlay">
                    <h5>Top Destination</h5>

                    <div className="diewrwerew">
                      <p>Starting from</p>
                      <h6>₹11,809</h6>
                    </div>                  
                  </div>
                </div>
              </div>

              <div className="col-lg-2 col-md-4 col-6">
                <div className="destination-card">
                  <img src="./images/asia.png" alt="" />
                  <div className="overlay">
                    <h5>Asia</h5>

                    <div className="diewrwerew">
                      <p>Starting from</p>
                      <h6>₹11,809</h6>
                    </div>                  
                  </div>
                </div>
              </div>

              <div className="col-lg-2 col-md-4 col-6">
                <div className="destination-card">
                  <img src="./images/mid-east.png" alt="" />
                  <div className="overlay">
                    <h5>Middle East</h5>

                    <div className="diewrwerew">
                      <p>Starting from</p>
                      <h6>₹20,021</h6>  
                    </div>                  
                  </div>
                </div>
              </div>

              <div className="col-lg-2 col-md-4 col-6">
                <div className="destination-card">
                  <img src="./images/affrica.png" alt="" />
                  <div className="overlay">
                    <h5>Africa</h5>

                    <div className="diewrwerew">
                      <p>Starting from</p>
                      <h6>₹32,126</h6>  
                    </div>                  
                  </div>
                </div>
              </div>

              <div className="col-lg-2 col-md-4 col-6">
                <div className="destination-card">
                  <img src="./images/europe.png" alt="" />
                  <div className="overlay">
                    <h5>Europe</h5>

                    <div className="diewrwerew">
                      <p>Starting from</p>
                      <h6>₹38,039</h6>  
                    </div>                  
                  </div>
                </div>
              </div>

              <div className="col-lg-2 col-md-4 col-6">
                <div className="destination-card">
                  <img src="./images/northamerica.png" alt="" />
                  <div className="overlay">
                    <h5>North America</h5>

                    <div className="diewrwerew">
                      <p>Starting from</p>
                      <h6>₹56,545</h6>  
                    </div>                  
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="travel-section py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="travleft col-lg-6">
              <span className="small-heading" data-aos="fade-in">{homeContent?.fourth_section_heading}</span>

              <h2 className="secondary-heading sdgzdfsdF mt-3" data-aos="fade-right">
                {firstLine} <br />
                {secondLine}
              </h2>

              <div className="description mt-3"
              dangerouslySetInnerHTML={{
                __html: homeContent?.fourth_section_description
              }}
            ></div>


              <div className="feature-box d-flex mt-4">
                <div className="icon-box">
                  <img 
                      src={`${imageUrl}/${homeContent?.fourth_section_logo_one}`} 
                      alt="" 
                    />
                </div>

                <div>
                  <h5 className="mb-2">{homeContent?.fourth_section_title_one}</h5>

                  <div
                dangerouslySetInnerHTML={{
                  __html: homeContent?.fourth_section_description_one
                }}
            ></div>
                </div>
              </div>

              <div className="feature-box d-flex mt-4">
                <div className="icon-box">
                  <img src={`${imageUrl}/${homeContent?.fourth_section_logo_two}`}  alt="" />
                </div>

                <div>
                  <h5 className="mb-2">{homeContent?.fourth_section_title_two}</h5>

                  <div
                dangerouslySetInnerHTML={{
                  __html: homeContent?.fourth_section_description_two
                }}
            ></div>
                </div>
              </div>

              <div className="doiejwrwer">
                <a href="/" className="btn btn-tour mt-4">
                  Book Your Trip →
                </a>
              </div>
            </div>

            <div className="travright col-lg-6 position-relative mt-5 mt-lg-0">
              <img src={`${imageUrl}/${homeContent?.fourth_section_logo}`} 
                className="watermark-icon"
                data-aos="zoom-in"
                alt="Compass Icon"/>

              <img data-aos="fade-in"
                src={`${imageUrl}/${homeContent?.fourth_section_back_image}`} 
                className="img-fluid big-image"
                alt="Boats"
              />

              <div className="sm-card" data-aos="fade-right">
                <img
                  src={`${imageUrl}/${homeContent?.fourth_section_front_image}`} 
                  className="img-fluid"
                  alt="Couple"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="recommended-hotels py-5">
        <div className="container">
          <h2 className="secondary-heading mb-5 text-center">Recommended Hotels</h2>

          <div className="row g-4">
            <div className="col-lg-4 col-md-6 col-sm-6">
              <div className="hotel-card">
                <img
                  src="./images/hotel1.png"
                  className="img-fluid hotel-img"
                  alt="Hotel"
                />

                <div className="hotel-content">
                  <div className="oisdmifkopkdsf d-flex justify-content-between align-items-center">
                    <h5 className="hotel-title">Planet Hollywood Bea...</h5>
                    <span className="rating">5.0</span>
                  </div>

                  <p className="location">Mumbai</p>

                  <div className="oifmojoifjdsgg d-flex justify-content-between align-items-center mt-3">
                    <a href="/" className="btn btn-tour">
                      Book Now ↗
                    </a>
                    <h4 className="price">₹42,120</h4>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6 col-sm-6">
              <div className="hotel-card">
                <img
                  src="./images/hotel2.png"
                  className="img-fluid hotel-img"
                  alt="Hotel"
                />

                <div className="hotel-content">
                  <div className="oisdmifkopkdsf d-flex justify-content-between align-items-center">
                    <h5 className="hotel-title">Planet Hollywood Bea...</h5>
                    <span className="rating">5.0</span>
                  </div>

                  <p className="location">Goa</p>

                  <div className="oifmojoifjdsgg d-flex justify-content-between align-items-center mt-3">
                    <a href="/" className="btn btn-tour">
                      Book Now ↗
                    </a>
                    <h4 className="price">₹40,120</h4>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6 col-sm-6">
              <div className="hotel-card">
                <img
                  src="./images/hotel3.png"
                  className="img-fluid hotel-img"
                  alt="Hotel"
                />

                <div className="hotel-content">
                  <div className="oisdmifkopkdsf d-flex justify-content-between align-items-center">
                    <h5 className="hotel-title">The Suryaa New Delhi</h5>
                    <span className="rating">5.0</span>
                  </div>

                  <p className="location">New Delhi</p>

                  <div className="oifmojoifjdsgg d-flex justify-content-between align-items-center mt-3">
                    <a href="/" className="btn btn-tour">
                      Book Now ↗
                    </a>
                    <h4 className="price">₹61,950</h4>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6 col-sm-6">
              <div className="hotel-card">
                <img
                  src="./images/hotel4.jpg"
                  className="img-fluid hotel-img"
                  alt="Hotel"
                />

                <div className="hotel-content">
                  <div className="oisdmifkopkdsf d-flex justify-content-between align-items-center">
                    <h5 className="hotel-title">Planet Hollywood Bea...</h5>
                    <span className="rating">5.0</span>
                  </div>

                  <p className="location">Kolkata</p>

                  <div className="oifmojoifjdsgg d-flex justify-content-between align-items-center mt-3">
                    <a href="/" className="btn btn-tour">
                      Book Now ↗
                    </a>
                    <h4 className="price">₹45,120</h4>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6 col-sm-6">
              <div className="hotel-card">
                <img
                  src="./images/hotel5.jpg"
                  className="img-fluid hotel-img"
                  alt="Hotel"
                />

                <div className="hotel-content">
                  <div className="oisdmifkopkdsf d-flex justify-content-between align-items-center">
                    <h5 className="hotel-title">Planet Hollywood Bea...</h5>
                    <span className="rating">5.0</span>
                  </div>

                  <p className="location">Kochi</p>

                  <div className="oifmojoifjdsgg d-flex justify-content-between align-items-center mt-3">
                    <a href="/" className="btn btn-tour">
                      Book Now ↗
                    </a>
                    <h4 className="price">₹50,120</h4>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6 col-sm-6">
              <div className="hotel-card">
                <img
                  src="./images/hotel6.png"
                  className="img-fluid hotel-img"
                  alt="Hotel"
                />

                <div className="hotel-content">
                  <div className="oisdmifkopkdsf d-flex justify-content-between align-items-center">
                    <h5 className="hotel-title">The Suryaa New Delhi</h5>
                    <span className="rating">5.0</span>
                  </div>

                  <p className="location">Chennai</p>

                  <div className="oifmojoifjdsgg d-flex justify-content-between align-items-center mt-3">
                    <a href="/" className="btn btn-tour">
                      Book Now ↗
                    </a>
                    <h4 className="price">₹51,950</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Testimonial />

      <section className="top-deals py-5">
        <div className="container text-center">
          <div className="cdzbgdffcd">
            <h2 className="deals-title mb-2" data-aos="fade-down">
              The Last <span>Minute Deals</span>
            </h2>
            
            <p className="deals-desc mb-0">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </div>

          <div className="row g-4 mt-4">
            <div className="col-lg-4 col-md-6 col-sm-6">
              <div className="deal-card">
                <img src="./images/deal1.png" className="img-fluid" alt="" />
                <div className="deal-overlay">
                  <p className="country">Norway</p>
                  <h5>Norway Lake</h5>
                  <div className="ratings">
                    ★★★★★ <span>(16)</span>
                  </div>
                  <div className="price-row">
                    <strong>$180.00</strong> | 6 Days Tours
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6 col-sm-6">
              <div className="deal-card">
                <img src="./images/deal2.png" className="img-fluid" alt="" />
                <div className="deal-overlay">
                  <p className="country">USA</p>
                  <h5>New York City</h5>
                  <div className="ratings">
                    ★★★★★ <span>(12)</span>
                  </div>
                  <div className="price-row">
                    <strong>$140.00</strong> | 3 Days Tours
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6 col-sm-6">
              <div className="deal-card">
                <img src="./images/deal3.png" className="img-fluid" alt="" />
                <div className="deal-overlay">
                  <p className="country">Maldives</p>
                  <h5>Male City</h5>
                  <div className="ratings">
                    ★★★★★ <span>(12)</span>
                  </div>
                  <div className="price-row">
                    <strong>$140.00</strong> | 3 Days Tours
                  </div>
                </div>
              </div>
            </div>
          </div>

          <a href="/" className="btn btn-tour mt-4">
            View All Deals
          </a>
        </div>
      </section>

      <FollowUsInstagram />
    </div>
  );
};
