import { Link, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import http from "../../http";
import Loader from "../../component/Loader/Loader";
import { HotelSearch } from "../../component/HotelSearch/HotelSearch";
import "./HotelFilter.css";



export const HotelFilter = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  // Hotel Data
  const [hotels, setHotels] = useState([]);
  const [hotelFilterOptionsToggle, setHotelFilterOptionsToggle] = useState(false);
  const [resHotelFilterToggle, setResHotelFilterToggle] = useState(false);
  // eslint-disable-next-line
  const [searchParams, setSearchParams] = useState({
    city: "",
    checkin: "",
    checkout: "",
    rooms: "",
    adults: "",
    children: "",
    price: "",
  });
  

  const fetchCities = async () => {
    try {
      const response = await http.post("city-list");
      setCities(response?.data?.data || []);      
    } catch (error) {
      console.error("City API Error:", error);
    }
  };

  useEffect(() => {
    fetchCities();
  }, []);

  // Fetch Hotels
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const city = params.get("city");
    const checkin = params.get("checkin");
    const checkout = params.get("checkout");
    const rooms = params.get("rooms");
    const adults = params.get("adults");
    const children = params.get("children");
    const price = params.get("price");
    if (city || checkin || checkout || rooms) {
      fetchHotels(city, checkin, checkout, rooms, adults, children, price);
    }

    setSearchParams({
      city: city || "",
      checkin: checkin || "",
      checkout: checkout || "",
      rooms: rooms || "",
      adults: adults || "",
      children: children || "",
      price: price || "",
    });
  }, [location.search]);


  const dateFormatOptions = {
    day: "numeric",
    month: "long"
  };

  const formattedCheckinDate = new Date(searchParams?.checkin).toLocaleDateString("en-GB", dateFormatOptions);
  const formattedCheckoutDate = new Date(searchParams?.checkout).toLocaleDateString("en-GB", dateFormatOptions);

  

  const fetchHotels = async (
    city,
    checkin,
    checkout,
    rooms,
    adults,
    children,
    price
  ) => {
    setLoading(true);

    try {
      const response = await http.get(
        `/hotels-search?city=${city}
        &checkin=${checkin}
        &checkout=${checkout}
        &rooms=${rooms}
        &adults=${adults}
        &children=${children}
        &price=${price}`
      );

      setHotels(response.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // console.log(hotels, 'hotels');

  const availableHotels = hotels?.filter(
    (hotel) => hotel?.hotelFilter?.HotelResult?.length > 0
  ); 



  return (
    <div>
      {loading && <Loader />}
      <div className="bannerhotel" style={{ background: "url('/images/hotelbanner.png')" }}></div>

      <div className={hotelFilterOptionsToggle ? "hotel-filter-options-container" : "hotel-filter-options-container hotel-filter-options-container-element-hide"}>
        {window.innerWidth <= 600 && (
          <div className="disnikjfisdf my-3">
            <div className="container">
              <div className="duinushducsdc bg-white p-3">
                <div className="ianuishuww d-flex justify-content-between align-items-center">
                  <div className="fvgdfvd">
                    <div className="docmosdfsdf">
                      <h4 className="mb-1">{searchParams?.city}</h4>

                      <p className="mb-0">
                        <span style={{ color: "var(--light-black-text-color)" }}>{(searchParams?.checkin && searchParams?.checkout) && `${formattedCheckinDate} - ${formattedCheckoutDate} |`}</span>&nbsp;

                        <span style={{ color: "var(--light-black-text-color)" }}>{searchParams?.adults && `${searchParams?.adults} Adult${searchParams?.adults > 1 ? "s" : ""}`} * {searchParams.children && `${searchParams?.children} Child${searchParams?.children > 1 ? "ren" : ""} |`}</span>&nbsp;

                        <span style={{ color: "var(--light-black-text-color)" }}>{searchParams.rooms && `${searchParams?.rooms} Room${searchParams?.rooms > 1 ? "s" : ""}`}</span>  
                      </p>
                    </div>
                  </div>

                  <div className="bgujhgb">
                    <div className="docmosdfsdf">
                      <span
                        className="d-flex flex-column align-items-center gap-1"
                        onClick={() => setHotelFilterOptionsToggle(prev => !prev)}
                      ><i className="fa-solid fa-pencil"></i> Edit</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <HotelSearch setHotelFilterOptionsToggle={setHotelFilterOptionsToggle} cities={cities}/>
      </div>

      <div className="mainsection hhsdfh58558">
        <div className="container">
          <div className="dfdfgfg">
            <div className="row">
              <div className="col-lg-3">
                {window.innerWidth <= 991 && (
                  <div className="hotel-res-filter-btn mobile-filter-btn filter-header">
                    <h5 className="mb-0" onClick={() => setResHotelFilterToggle(prev => !prev)}>{window.innerWidth <= 991 && <i className="fa-solid me-1 fa-sliders"></i>} Filters</h5>
                    
                    <span className="reset-btn disabled d-flex align-items-center"><i className="fa-solid fa-arrow-rotate-left"></i> <b>Reset</b></span>
                  </div>
                )}

                <div className={resHotelFilterToggle ? "sdbfhsd55 active" : "sdbfhsd55"}>
                  <div className="filter-box">
                    <div className="filter-header">
                      <h5 className="mb-0">Filter</h5>
                      <span className="reset-btn disabled d-flex align-items-center"><i className="bi me-1 bi-arrow-clockwise"></i> Reset</span>
                    </div>

                    <div className="filter-search">
                      <input type="text" placeholder="Search by Hotel Names" />
                    </div>

                    <div className="filter-section suggested-section">
                      <h6 className="mb-3">Suggested For You</h6>

                      <div className="fijkfokweer">
                        <div className="suggested-item">
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

                              <p className="checkbox__textwrapper">Last Minute Deals</p>
                            </label>
                          </div>

                          <span className="item-count">(217)</span>
                        </div>

                        <div className="suggested-item">
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

                              <p className="checkbox__textwrapper">5 Star</p>
                            </label>
                          </div>

                          <span className="item-count">(217)</span>
                        </div>

                        <div className="suggested-item">
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

                              <p className="checkbox__textwrapper">4 Star</p>
                            </label>
                          </div>

                          <span className="item-count">(397)</span>
                        </div>

                        <div className="suggested-item">
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

                              <p className="checkbox__textwrapper">Breakfast Included</p>
                            </label>
                          </div>

                          <span className="item-count">(1190)</span>
                        </div>

                        <div className="suggested-item">
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

                              <p className="checkbox__textwrapper">3 Star</p>
                            </label>
                          </div>

                          <span className="item-count">(781)</span>
                        </div>
                      </div>
                    </div>

                    <div className="filter-section">
                      <h6 className="mb-3">Price Per Night</h6>

                      <div className="fijkfokweer">
                        <div className="suggested-item">
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

                              <p className="checkbox__textwrapper">₹999 - ₹1999</p>
                            </label>
                          </div>

                          <span className="item-count">(218)</span>
                        </div>

                        <div className="suggested-item">
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

                              <p className="checkbox__textwrapper">₹1100 - ₹1999</p>
                            </label>
                          </div>

                          <span className="item-count">(342)</span>
                        </div>

                        <div className="suggested-item">
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

                              <p className="checkbox__textwrapper">₹1500 - ₹2999</p>
                            </label>
                          </div>

                          <span className="item-count">(187)</span>
                        </div>

                        <div className="suggested-item">
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

                              <p className="checkbox__textwrapper">₹2000 - ₹2999</p>
                            </label>
                          </div>

                          <span className="item-count">(264)</span>
                        </div>

                        <div className="suggested-item">
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

                              <p className="checkbox__textwrapper">₹2000 - ₹3500</p>
                            </label>
                          </div>

                          <span className="item-count">(95)</span>
                        </div>

                        <div className="suggested-item">
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

                              <p className="checkbox__textwrapper">₹3999 - ₹5999</p>
                            </label>
                          </div>

                          <span className="item-count">(72)</span>
                        </div>

                        <div className="suggested-item">
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

                              <p className="checkbox__textwrapper">10000+</p>
                            </label>
                          </div>

                          <span className="item-count">(21)</span>
                        </div>
                      </div>
                    </div>

                    <div className="budget-filter">
                      <label className="budget-label">Your Budget</label>

                      <div className="budget-row d-flex align-items-center justify-content-between gap-2">
                        <div className="d-flex align-items-center gap-2">
                          <input
                            type="number"
                            className="budget-input"
                            placeholder="Min"
                          />

                          <span className="budget-sep">to</span>

                          <input
                            type="number"
                            className="budget-input"
                            placeholder="Max"
                          />
                        </div>

                        <button className="budget-btn">
                          <img
                            src="https://cdn-icons-png.flaticon.com/512/117/117472.png"
                            alt="Go"
                            className="arrow-img"
                          />
                        </button>
                      </div>
                    </div>

                    <div className="filter-section suggested-section">
                      <h6>Star Category</h6>

                      <div className="suggested-item">
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

                            <p className="checkbox__textwrapper">3 Star</p>
                          </label>
                        </div>

                        <span className="item-count">(781)</span>
                      </div>

                      <div className="suggested-item">
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

                            <p className="checkbox__textwrapper">4 Star</p>
                          </label>
                        </div>

                        <span className="item-count">(397)</span>
                      </div>

                      <div className="suggested-item">
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

                            <p className="checkbox__textwrapper">5 Star</p>
                          </label>
                        </div>

                        <span className="item-count">(217)</span>
                      </div>
                    </div>

                    <div className="filter-section suggested-section">
                      <h6>Property Type</h6>

                      <div className="suggested-item">
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

                            <p className="checkbox__textwrapper">Apartment</p>
                          </label>
                        </div>

                        <span className="item-count">(781)</span>
                      </div>

                      <div className="suggested-item">
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

                            <p className="checkbox__textwrapper">Villa</p>
                          </label>
                        </div>

                        <span className="item-count">(397)</span>
                      </div>

                      <div className="suggested-item">
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

                            <p className="checkbox__textwrapper">Hotel</p>
                          </label>
                        </div>

                        <span className="item-count">(217)</span>
                      </div>

                      <div className="suggested-item">
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

                            <p className="checkbox__textwrapper">Resort</p>
                          </label>
                        </div>

                        <span className="item-count">(125)</span>
                      </div>

                      <div className="suggested-item">
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

                            <p className="checkbox__textwrapper">Homestay</p>
                          </label>
                        </div>

                        <span className="item-count">(75)</span>
                      </div>
                    </div>

                    <div className="filter-section suggested-section">
                      <h6>Top locations</h6>

                      <div className="suggested-item">
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

                            <p className="checkbox__textwrapper">North Goa</p>
                          </label>
                        </div>
                      </div>

                      <div className="suggested-item">
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

                            <p className="checkbox__textwrapper">South Goa</p>
                          </label>
                        </div>
                      </div>

                      <div className="suggested-item">
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

                            <p className="checkbox__textwrapper">Baga Beach</p>
                          </label>
                        </div>
                      </div>

                      <div className="suggested-item">
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

                            <p className="checkbox__textwrapper">Panjim</p>
                          </label>
                        </div>
                      </div>

                      <div className="suggested-item">
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

                            <p className="checkbox__textwrapper">Calangute Beach</p>
                          </label>
                        </div>
                      </div>

                      <div className="suggested-item">
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

                            <p className="checkbox__textwrapper">Candolim Beach</p>
                          </label>
                        </div>
                      </div>

                      <div className="suggested-item">
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

                            <p className="checkbox__textwrapper">Vagator</p>
                          </label>
                        </div>
                      </div>

                      <div className="suggested-item">
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

                            <p className="checkbox__textwrapper">Anjuna Beach</p>
                          </label>
                        </div>
                      </div>

                      <div className="suggested-item">
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

                            <p className="checkbox__textwrapper">Palolem Beach</p>
                          </label>
                        </div>
                      </div>

                      <div className="suggested-item">
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

                            <p className="checkbox__textwrapper">Candolim</p>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="filter-section suggested-section">
                      <h6>Guests Love</h6>

                      <div className="suggested-item">
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

                            <p className="checkbox__textwrapper">Wi‑Fi</p>
                          </label>
                        </div>

                        <span className="item-count">(322)</span>
                      </div>

                      <div className="suggested-item">
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

                            <p className="checkbox__textwrapper">Spa</p>
                          </label>
                        </div>

                        <span className="item-count">(6)</span>
                      </div>

                      <div className="suggested-item">
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

                            <p className="checkbox__textwrapper">Swimming Pool</p>
                          </label>
                        </div>

                        <span className="item-count">(272)</span>
                      </div>

                      <div className="mt-1">
                        <Link to={'/'} className="show-more-link">
                          Show 13 more
                        </Link>
                      </div>
                    </div>

                    <div className="filter-section suggested-section mt-4">
                      <h6>Booking Preference</h6>

                      <div className="suggested-item">
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

                            <p className="checkbox__textwrapper">Entire Villas & Apartments</p>
                          </label>
                        </div>

                        <span className="item-count">(207)</span>
                      </div>

                      <div className="suggested-item">
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

                            <p className="checkbox__textwrapper">Caretaker</p>
                          </label>
                        </div>

                        <span className="item-count">(22)</span>
                      </div>

                      <div className="suggested-item">
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

                            <p className="checkbox__textwrapper">Instant Book</p>
                          </label>
                        </div>

                        <span className="item-count">(742)</span>
                      </div>

                      <div className="suggested-item">
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

                            <p className="checkbox__textwrapper">Homestays</p>
                          </label>
                        </div>

                        <span className="item-count">(829)</span>
                      </div>
                    </div>

                    <div className="filter-section suggested-section mt-4">
                      <h6>House Rules</h6>

                      <div className="suggested-item">
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

                            <p className="checkbox__textwrapper">Self Check-In Available</p>
                          </label>
                        </div>

                        <span className="item-count">(152)</span>
                      </div>

                      <div className="suggested-item">
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

                            <p className="checkbox__textwrapper">Smoking Allowed</p>
                          </label>
                        </div>

                        <span className="item-count">(529)</span>
                      </div>

                      <div className="suggested-item">
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

                            <p className="checkbox__textwrapper">All Male Groups Allowed</p>
                          </label>
                        </div>

                        <span className="item-count">(326)</span>
                      </div>

                      <div className="suggested-item">
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

                            <p className="checkbox__textwrapper"> Unmarried Couples Allowed</p>
                          </label>
                        </div>

                        <span className="item-count">(657)</span>
                      </div>

                      <div className="suggested-item">
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

                            <p className="checkbox__textwrapper"> Alcohol Allowed</p>
                          </label>
                        </div>

                        <span className="item-count">(353)</span>
                      </div>

                      <div className="suggested-item">
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

                            <p className="checkbox__textwrapper"> Pets Allowed</p>
                          </label>
                        </div>

                        <span className="item-count">(117)</span>
                      </div>
                    </div>

                    <div className="filter-section suggested-section mt-4">
                      <h6>Deals & Offers</h6>

                      <div className="suggested-item">
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

                            <p className="checkbox__textwrapper"> Travel ka Muhurat Sale</p>
                          </label>
                        </div>

                        <span className="item-count">(152)</span>
                      </div>

                      <div className="suggested-item">
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

                            <p className="checkbox__textwrapper"> Lightning Drops</p>
                          </label>
                        </div>

                        <span className="item-count">(529)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={resHotelFilterToggle ? "filter-overlay active" : "filter-overlay"} onClick={() => setResHotelFilterToggle(false)}></div>
              </div>

              <div className="col-lg-9">
                <div className="ajhfbmuihehee mb-4">
                  <h5 className="fw-semibold mb-0">{availableHotels?.length} Hotels Found on Your Search</h5>

                  {/* <div className="sort-area">
                    <p className="mb-0">Sort By :</p>
                    <select>
                      <option>Recommended</option>
                      <option>Lowest Price</option>
                      <option>Fastest</option>
                    </select>
                  </div> */}
                </div>
                
                <div className="sebfghsfsdf">

                  {availableHotels?.length > 0 ? (
                    availableHotels.map((hotel, index) => {

                      // Clean Description
                      const cleanDescription = hotel.description
                        ?.replace(/<[^>]*>/g, " ")
                        ?.replace(/\n/g, " ")
                        ?.replace(/\s+/g, " ")
                        ?.trim();
                      // Extract Headline
                      const headlineMatch = cleanDescription?.match(
                        /HeadLine\s*:\s*(.*?)(Location\s*:|$)/i
                      );
                      // Extract Location
                      const locationMatch = cleanDescription?.match(
                        /Location\s*:\s*(.*?)(Rooms\s*:|Dining\s*:|$)/i
                      );
                      const headline = headlineMatch?.[1]?.trim();
                      const hotelLocation = locationMatch?.[1]?.trim();
                      // Final Description
                      const shortDescription = hotelLocation || cleanDescription;
                      const params = new URLSearchParams(location.search);

                      const room = hotel?.hotelFilter?.HotelResult?.[0]?.Rooms?.[0];

                      const totalBasePrice =
                        room?.DayRates?.reduce((sum, dayRate) => {
                          return sum + (dayRate?.[0]?.BasePrice || 0);
                        }, 0) || 0;

                      const roomCount = room?.Name?.length || 1;
                      const roomName = room?.Name?.[0] || "";

                      const displayName = `${roomCount} x (${roomName})`;

                      return (
                        <div className="gfetyy89" key={index}>
                          <div className="sdhdss8899">
                            <div className="row">
                              <div className="col-lg-9">
                                <div className="fgfdfgd78">
                                  <div className="row">
                                    <div className="col-lg-4">
                                      <div className="fbvhjd position-relative">
                                        <img src={hotel.image} alt="" />

                                        <button className="xbzgsczxcrr rounded-pill position-absolute px-2 py-1"><i className="fa-regular me-1 fa-images"></i> 25 Photos</button>

                                        {/* <div className="wishlist-icon">
                                          <img
                                            src="https://cdn-icons-png.flaticon.com/512/833/833472.png"
                                            alt="heart"
                                          />
                                        </div> */}
                                      </div>
                                    </div>

                                    <div className="col-lg-8 ps-lg-0">
                                      <div className="dsbhjsdsf d-flex flex-column justify-content-between h-100">
                                        <div className="dueuiwejasd">
                                          <h4 className="mb-2">
                                            {hotel.hotel_name}
                                          </h4>

                                          <h6 className="mb-3">
                                            <i className="fa-solid fa-location-dot"></i> &nbsp;
                                            {hotel.address}
                                          </h6>

                                          {/* Headline */}
                                          {headline && (
                                            <p className="sgfsvdfgf my-1">
                                              HeadLine : {headline}
                                            </p>
                                          )}

                                          {/* Location */}
                                          <p className="sgfsvdfgf mt-1 mb-0">
                                            {headline
                                              ? shortDescription?.split(" ")?.slice(0, 18)?.join(" ")
                                              : shortDescription?.split(" ")?.slice(0, 25)?.join(" ")
                                            }

                                            {shortDescription?.split(" ")?.length >
                                              (headline ? 18 : 25) && (
                                                <>
                                                  ...{" "}
                                                  <span
                                                    onClick={() => {
                                                      navigate(`/hotel-details/${hotel.hotel_code}?${params.toString()}`);
                                                    }}
                                                    style={{
                                                      color: "var(--main-green-color)",
                                                      cursor: "pointer",
                                                      fontWeight: "600",
                                                    }}
                                                  >
                                                    Read More
                                                  </span>
                                                </>
                                              )}
                                          </p>
                                        </div>

                                        <div>
                                            <p>| {displayName}</p>
                                        </div>

                                        <div className="diehfsdf d-flex align-items-center gap-1 mt-2 mb-1">
                                          <div className="iudhewijjrrr p-2 me-1">
                                            <img src="./images/gift.png" alt="" />
                                          </div>

                                          <h6 className="mb-0">Long Stay Benefits</h6>
                                        </div>

                                        <div className="djiwehriwer d-flex align-items-center gap-1">
                                          <div className="diehrknjiwer d-flex align-items-center p-2 rounded-3">
                                            <img src="./images/leaves.png" className="me-1" alt="" />

                                            <div className="duewhrwer">
                                              <p className="mb-0">20% off on</p>

                                              <p className="mb-0">Spa Session</p>
                                            </div>
                                          </div>

                                          <div className="diehrknjiwer d-flex align-items-center p-2 rounded-3">
                                            <img src="./images/leaves.png" className="me-1" alt="" />

                                            <div className="duewhrwer">
                                              <p className="mb-0">20% off on</p>

                                              <p className="mb-0">Food & Beverage Services</p>
                                            </div>
                                          </div>

                                          <div className="diehrknjiwer d-flex align-items-center p-2 rounded-3">
                                            <img src="./images/leaves.png" className="me-1" alt="" />

                                            <div className="duewhrwer">
                                              <p className="mb-0">20% off on</p>

                                              <p className="mb-0">Laundry Service (upto 2 items)</p>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="col-lg-3">
                                <div className="njhbfsf d-flex flex-column justify-content-between h-100">
                                  <div className="dinweirowerwer">
                                    <div className="fdjvfd78 mb-2">
                                      <p className="mb-0 d-flex flex-column gap-1">
                                        From <span>₹{Math.round(totalBasePrice).toLocaleString("en-IN")}</span>
                                      </p>
                                    </div>

                                    <div className="vdfv785 mb-2">
                                      <p className="mb-0">+ ₹ {Math.round(room?.TotalTax || 0).toLocaleString("en-IN")} taxes & fees</p>
                                      <small>Per Night for {roomCount} Room{roomCount > 1 ? "s" : ""}</small>
                                    </div>
                                  </div>

                                  <div className="iduweoijrwer">
                                    <div className="sbfsdvfsf align-items-center mb-4">
                                      <div className="vfddf">
                                        {[...Array(Number(hotel.hotel_rating || 0))].map((_, i) => (
                                          <i key={i} className="fa-solid fa-star"></i>
                                        ))}
                                      </div>

                                      <div className="vbhsf">
                                        <span className="tour-badge">{hotel.hotel_rating}/5 Stars</span>
                                      </div>
                                    </div>

                                    <div className="sdbds86">
                                      <button className="btn-tour w-100 py-2"
                                        onClick={() => {
                                          navigate(`/hotel-details/${hotel.hotel_code}?${params.toString()}`);
                                        }}
                                      >View Details <i className="bi ms-1 bi-arrow-up-right-circle"></i></button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="tfty885r mt-4 d-flex align-items-center px-3 py-2 justify-content-between">
                              <div className="dsoijfcosdc">
                                <h6 className="mb-0">
                                  <img src="./images/vzdvs.png" className="me-3" alt="" />

                                  SBI Debit Card Offer &nbsp; &nbsp; | &nbsp; &nbsp; Get INR 5000 Off!</h6>
                              </div>

                              <button className="btn btn-light overflow-hidden position-relative py-1 d-flex align-items-center"><span>Know More</span> <i className="fa-solid fa-arrow-right"></i></button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <h5>No Hotels Found</h5>
                  )}



                  {/* <div className="gfetyy89">
                    <div className="sdhdss8899">
                      <div className="row">
                        <div className="col-lg-9">
                          <div className="fgfdfgd78">
                            <div className="row">
                              <div className="col-lg-6">
                                <div className="fbvhjd">
                                  <img src="./images/hotel1.png" alt="" />

                                  <div className="wishlist-icon">
                                    <img
                                      src="https://cdn-icons-png.flaticon.com/512/833/833472.png"
                                      alt="heart"
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="col-lg-6">
                                <div className="dsbhjsdsf">
                                  <h4>
                                    Fairfield by Marriott Mumbai Andheri West
                                  </h4>
                                  <h6>
                                    <i className="fa-solid fa-location-dot"></i>{" "}
                                    Bandra west ,Mumbai
                                  </h6>
                                  <p>
                                    Breakfast buffet features good variety,
                                    restaurant offers quality food, bakery and
                                    cafe includes a 24-hour coffee shop
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-3">
                          <div className="njhbfsf">
                            <div className="vbhsf">
                              <h4>Excellent </h4>
                              <p>4.5/5</p>
                            </div>
                            <div className="sdknhf55">
                              <p>(655 Rating)</p>
                            </div>
                            <div className="fdjvfd78">
                              <p>
                                From <span>₹2299 </span>
                              </p>
                            </div>
                            <div className="vdfv785">
                              <p>+ ₹ 3,543 taxes & fees per Night</p>
                            </div>
                            <div className="sbfsdvfsf">
                              <div className="vfddf">
                                <i className="fa-solid fa-star"></i>
                                <i className="fa-solid fa-star"></i>
                                <i className="fa-solid fa-star"></i>
                                <i className="fa-solid fa-star"></i>
                                <i className="fa-solid fa-star"></i>
                              </div>
                              <div className="fdfdf5">
                                <p>star</p>
                              </div>
                            </div>
                            <div className="sdbds86">
                              <button>View Details</button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="hddssd78">
                        <h6>Long Stay Benefits</h6>
                        <p>
                          20% off on session of Spa 20% off on Food & Beverage
                          services 20% Off on Laundry service for upto 2
                          clothing item(s)
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="gfetyy89">
                    <div className="sdhdss8899">
                      <div className="row">
                        <div className="col-lg-9">
                          <div className="fgfdfgd78">
                            <div className="row">
                              <div className="col-lg-6">
                                <div className="fbvhjd">
                                  <img src="./images/hotel4.jpg" alt="" />

                                  <div className="wishlist-icon">
                                    <img
                                      src="https://cdn-icons-png.flaticon.com/512/833/833472.png"
                                      alt="heart"
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="col-lg-6">
                                <div className="dsbhjsdsf">
                                  <h4>
                                    Fairfield by Marriott Mumbai Andheri West
                                  </h4>
                                  <h6>
                                    <i className="fa-solid fa-location-dot"></i>{" "}
                                    Bandra west ,Mumbai
                                  </h6>
                                  <p>
                                    Breakfast buffet features good variety,
                                    restaurant offers quality food, bakery and
                                    cafe includes a 24-hour coffee shop
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-3">
                          <div className="njhbfsf">
                            <div className="vbhsf">
                              <h4>Excellent </h4>
                              <p>4.5/5</p>
                            </div>
                            <div className="sdknhf55">
                              <p>(655 Rating)</p>
                            </div>
                            <div className="fdjvfd78">
                              <p>
                                From <span>₹2299 </span>
                              </p>
                            </div>
                            <div className="vdfv785">
                              <p>+ ₹ 3,543 taxes & fees per Night</p>
                            </div>
                            <div className="sbfsdvfsf">
                              <div className="vfddf">
                                <i className="fa-solid fa-star"></i>
                                <i className="fa-solid fa-star"></i>
                                <i className="fa-solid fa-star"></i>
                                <i className="fa-solid fa-star"></i>
                                <i className="fa-solid fa-star"></i>
                              </div>
                              <div className="fdfdf5">
                                <p>star</p>
                              </div>
                            </div>
                            <div className="sdbds86">
                              <button>View Details</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="gfetyy89">
                    <div className="sdhdss8899">
                      <div className="row">
                        <div className="col-lg-9">
                          <div className="fgfdfgd78">
                            <div className="row">
                              <div className="col-lg-6">
                                <div className="fbvhjd">
                                  <img src="./images/hotel2.png" alt="" />

                                  <div className="wishlist-icon">
                                    <img
                                      src="https://cdn-icons-png.flaticon.com/512/833/833472.png"
                                      alt="heart"
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="col-lg-6">
                                <div className="dsbhjsdsf">
                                  <h4>
                                    Fairfield by Marriott Mumbai Andheri West
                                  </h4>
                                  <h6>
                                    <i className="fa-solid fa-location-dot"></i>{" "}
                                    Bandra west ,Mumbai
                                  </h6>
                                  <p>
                                    Breakfast buffet features good variety,
                                    restaurant offers quality food, bakery and
                                    cafe includes a 24-hour coffee shop
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-3">
                          <div className="njhbfsf">
                            <div className="vbhsf">
                              <h4>Excellent</h4>
                              <p>4.5/5</p>
                            </div>
                            <div className="sdknhf55">
                              <p>(655 Rating)</p>
                            </div>
                            <div className="fdjvfd78">
                              <p>
                                From <span>₹2299 </span>
                              </p>
                            </div>
                            <div className="vdfv785">
                              <p>+ ₹ 3,543 taxes & fees per Night</p>
                            </div>
                            <div className="sbfsdvfsf">
                              <div className="vfddf">
                                <i className="fa-solid fa-star"></i>
                                <i className="fa-solid fa-star"></i>
                                <i className="fa-solid fa-star"></i>
                                <i className="fa-solid fa-star"></i>
                                <i className="fa-solid fa-star"></i>
                              </div>
                              <div className="fdfdf5">
                                <p>star</p>
                              </div>
                            </div>
                            <div className="sdbds86">
                              <button>View Details</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div> */}

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
