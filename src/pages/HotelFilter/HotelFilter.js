import { useEffect, useState } from "react";
// eslint-disable-next-line
import { Link, useLocation, useNavigate } from "react-router-dom";

import { Slider } from "@mui/material";

import http from "../../http";
import Loader from "../../component/Loader/Loader";
import { useHotelFilters } from "../../context/HotelFilterContext";
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
  // eslint-disable-next-line
  const [price, setPrice] = useState([0, 500000]);
  const {
    filters,
    hasActiveFilters,
    toggleSuggestedForYou,
    togglePricePerNight,
    setPriceRange,
    // eslint-disable-next-line
    togglePropertyType,
    toggleTopLocation,
    // eslint-disable-next-line
    toggleGuestsLove,
    // eslint-disable-next-line
    toggleBookingPreference,
    // eslint-disable-next-line
    toggleHouseRule,
    // eslint-disable-next-line
    toggleDealsOffers,
    resetFilters,
  } = useHotelFilters();

  // eslint-disable-next-line
  const handleChange = (event, newValue) => {
      setPrice(newValue);
  };

  const formatPrice = (value) => {
      return `₹ ${value.toLocaleString("en-IN")}`;
  };
  

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

  const PRICE_PER_NIGHT_RANGES = {
    "999-1999": [999, 1999],
    "1100-1999": [1100, 1999],
    "1500-2999": [1500, 2999],
    "2000-2999": [2000, 2999],
    "2000-3500": [2000, 3500],
    "3999-5999": [3999, 5999],
    "10000-plus": [10000, Infinity],
  };

  const availableHotels = hotels?.filter(
    (hotel) => hotel?.hotelFilter?.HotelResult?.length > 0
  );

  const filteredHotels = availableHotels?.filter((hotel) => {
    const room = hotel?.hotelFilter?.HotelResult?.[0]?.Rooms?.[0];

    // ---------------- PRICE ----------------
    const totalBasePrice =
      room?.DayRates?.reduce((sum, dayRate) => {
        return sum + (dayRate?.[0]?.BasePrice || 0);
      }, 0) || 0;

    const matchesPrice =
      totalBasePrice >= filters.priceRange[0] &&
      totalBasePrice <= filters.priceRange[1];

    
    // ---------------- PRICE PER NIGHT (bucket checkboxes) ----------------
    const matchesPricePerNight =
      filters.pricePerNight.length === 0 ||
      filters.pricePerNight.some((key) => {
        const range = PRICE_PER_NIGHT_RANGES[key];
        if (!range) return false;
        const [min, max] = range;
        return totalBasePrice >= min && totalBasePrice <= max;
      });


    // ---------------- STAR CATEGORY ----------------
    const hotelRating = String(hotel?.hotel_rating || 0);

    const matchesSuggestedForYou =
      filters.suggestedForYou.length === 0 ||
      filters.suggestedForYou.some((option) => {
        if (option === 'LAST_MINUTE_DEALS') {
          return hotelRating === "LAST_MINUTE_DEALS";
        } else if (option === "5_STAR") {
          return hotelRating === "5"
        } else if (option === "4_STAR") {
          return hotelRating === "4"
        } else if (option === "BREAKFAST_INCLUDED") {
          return hotelRating === "BREAKFAST_INCLUDED"
        } else if (option === "3_STAR") {
          return hotelRating === "3"
        }

        return true;
      });


    // ---------------- TOP LOCATIONS ----------------
    const cityName = hotel?.city_name?.toLowerCase() || "";
    const countryName = hotel?.country_name?.toLowerCase() || "";
    const address = hotel?.address?.toLowerCase() || "";

    const matchesTopLocation =
      filters.topLocations.length === 0 ||
      filters.topLocations.some((location) => {
        const locationName = location
          .replaceAll("_", " ")
          .toLowerCase();

        return (
          cityName.includes(locationName) ||
          countryName.includes(locationName) ||
          address.includes(locationName)
        );
      });


    return (
      matchesPrice &&
      matchesSuggestedForYou &&
      matchesTopLocation &&
      matchesPricePerNight
    );
  });

  const getSuggestedCount = (option) => {
    return (
      availableHotels?.filter((hotel) => {
        const hotelFilterValue = String(hotel?.hotel_rating || 0);

        if (option === "LAST_MINUTE_DEALS") {
          return hotelFilterValue === "LAST_MINUTE_DEALS";
        }

        if (option === "5_STAR") {
          return hotelFilterValue === "5";
        }

        if (option === "4_STAR") {
          return hotelFilterValue === "4";
        }

        if (option === "3_STAR") {
          return hotelFilterValue === "3";
        }

        if (option === "BREAKFAST_INCLUDED") {
          return hotelFilterValue === "BREAKFAST_INCLUDED";
        }

        return false;
      }).length || 0
    );
  };

  const handlePriceRangeChange = (_event, newValue) => {
    setPriceRange(newValue);
  };

  console.log(filteredHotels);



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
                    
                    <span onClick={resetFilters} className="reset-btn d-flex align-items-center"><i className="fa-solid fa-arrow-rotate-left"></i> <b>Reset</b></span>
                  </div>
                )}

                <div className={resHotelFilterToggle ? "sdbfhsd55 active" : "sdbfhsd55"}>
                  <div className="filter-box">
                    <div className="filter-header">
                      <h5 className="mb-0">Filter</h5>
                      <span
                        className={`reset-btn d-flex align-items-center ${hasActiveFilters ? '' : 'disabled'}`}
                        onClick={hasActiveFilters ? resetFilters : undefined}
                      >
                        <i className="bi me-1 bi-arrow-clockwise"></i> Reset
                      </span>
                    </div>

                    <div className="filter-section suggested-section">
                      <div className="flight-filter-header d-flex justify-content-between align-items-center flight-filter-toggle">
                        <div className="flight-filter-left">
                          <span className="flight-filter-title">Suggested For You</span>
                        </div>

                        <i className="fa-solid fa-caret-up flight-filter-icon"></i>
                      </div>

                      <div className="fijkfokweer mt-3">
                        <div className="suggested-item">
                          <div className="checkbox-wrapper-33">
                            <label className="checkbox">
                              <input
                                className="checkbox__trigger visuallyhidden"
                                type="checkbox"
                                checked={filters.suggestedForYou.includes('LAST_MINUTE_DEALS')}
                                onChange={() => toggleSuggestedForYou('LAST_MINUTE_DEALS')}
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

                          <span className="item-count">({getSuggestedCount("LAST_MINUTE_DEALS")})</span>
                        </div>

                        <div className="suggested-item">
                          <div className="checkbox-wrapper-33">
                            <label className="checkbox">
                              <input
                                className="checkbox__trigger visuallyhidden"
                                type="checkbox"
                                checked={filters.suggestedForYou.includes('5_STAR')}
                                onChange={() => toggleSuggestedForYou('5_STAR')}
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

                          <span className="item-count">({getSuggestedCount("5_STAR")})</span>
                        </div>

                        <div className="suggested-item">
                          <div className="checkbox-wrapper-33">
                            <label className="checkbox">
                              <input
                                className="checkbox__trigger visuallyhidden"
                                type="checkbox"
                                checked={filters.suggestedForYou.includes('4_STAR')}
                                onChange={() => toggleSuggestedForYou('4_STAR')}
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

                          <span className="item-count">({getSuggestedCount("4_STAR")})</span>
                        </div>

                        <div className="suggested-item">
                          <div className="checkbox-wrapper-33">
                            <label className="checkbox">
                              <input
                                className="checkbox__trigger visuallyhidden"
                                type="checkbox"
                                checked={filters.suggestedForYou.includes('BREAKFAST_INCLUDED')}
                                onChange={() => toggleSuggestedForYou('BREAKFAST_INCLUDED')}
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

                          <span className="item-count">({getSuggestedCount("BREAKFAST_INCLUDED")})</span>
                        </div>

                        <div className="suggested-item">
                          <div className="checkbox-wrapper-33">
                            <label className="checkbox">
                              <input
                                className="checkbox__trigger visuallyhidden"
                                type="checkbox"
                                checked={filters.suggestedForYou.includes('3_STAR')}
                                onChange={() => toggleSuggestedForYou('3_STAR')}
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

                          <span className="item-count">({getSuggestedCount("3_STAR")})</span>
                        </div>
                      </div>
                    </div>

                    <div className="filter-section">
                      <div className="flight-filter-header d-flex justify-content-between align-items-center flight-filter-toggle">
                        <div className="flight-filter-left">
                          <span className="flight-filter-title">Price Per Night</span>
                        </div>

                        <i className="fa-solid fa-caret-up flight-filter-icon"></i>
                      </div>

                      <div className="fijkfokweer mt-3">
                        <div className="suggested-item">
                          <div className="checkbox-wrapper-33">
                            <label className="checkbox">
                              <input
                                className="checkbox__trigger visuallyhidden"
                                type="checkbox"
                                checked={filters.pricePerNight.includes('999-1999')}
                                onChange={() => togglePricePerNight('999-1999')}
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
                        </div>

                        <div className="suggested-item">
                          <div className="checkbox-wrapper-33">
                            <label className="checkbox">
                              <input
                                className="checkbox__trigger visuallyhidden"
                                type="checkbox"
                                checked={filters.pricePerNight.includes('1100-1999')}
                                onChange={() => togglePricePerNight('1100-1999')}
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
                        </div>

                        <div className="suggested-item">
                          <div className="checkbox-wrapper-33">
                            <label className="checkbox">
                              <input
                                className="checkbox__trigger visuallyhidden"
                                type="checkbox"
                                checked={filters.pricePerNight.includes('1500-2999')}
                                onChange={() => togglePricePerNight('1500-2999')}
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
                        </div>

                        <div className="suggested-item">
                          <div className="checkbox-wrapper-33">
                            <label className="checkbox">
                              <input
                                className="checkbox__trigger visuallyhidden"
                                type="checkbox"
                                checked={filters.pricePerNight.includes('2000-2999')}
                                onChange={() => togglePricePerNight('2000-2999')}
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
                        </div>

                        <div className="suggested-item">
                          <div className="checkbox-wrapper-33">
                            <label className="checkbox">
                              <input
                                className="checkbox__trigger visuallyhidden"
                                type="checkbox"
                                checked={filters.pricePerNight.includes('2000-3500')}
                                onChange={() => togglePricePerNight('2000-3500')}
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
                        </div>

                        <div className="suggested-item">
                          <div className="checkbox-wrapper-33">
                            <label className="checkbox">
                              <input
                                className="checkbox__trigger visuallyhidden"
                                type="checkbox"
                                checked={filters.pricePerNight.includes('3999-5999')}
                                onChange={() => togglePricePerNight('3999-5999')}
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
                        </div>

                        <div className="suggested-item">
                          <div className="checkbox-wrapper-33">
                            <label className="checkbox">
                              <input
                                className="checkbox__trigger visuallyhidden"
                                type="checkbox"
                                checked={filters.pricePerNight.includes('10000-plus')}
                                onChange={() => togglePricePerNight('10000-plus')}
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
                        </div>
                      </div>
                    </div>

                    <div className="filter-section border-top-0">
                      <div className="flight-filter-header d-flex justify-content-between align-items-center flight-filter-toggle">
                        <div className="flight-filter-left">
                          <span className="flight-filter-title">Your Budget</span>
                        </div>

                        <i className="fa-solid fa-caret-up flight-filter-icon"></i>
                      </div>

                      <div className="flight-filter-content">
                        <div className="price-filter">
                          <Slider
                            value={filters.priceRange}
                            onChange={handlePriceRangeChange}
                            min={0}
                            max={500000}
                            step={1000}
                            disableSwap
                            sx={{
                              color: 'var(--blue-primary-color) !important',
                              height: 4,
                              '& .MuiSlider-thumb': {
                                width: 22,
                                height: 22,
                                backgroundColor: 'var(--blue-primary-color) !important',
                              },
                              '& .MuiSlider-track': {
                                border: 'none',
                              },
                              '& .MuiSlider-rail': {
                                backgroundColor: '#d9d9d9',
                              },
                            }}
                          />

                          <div className="flight-results-section mb-0">
                            <div className="price-values">
                              <span className="price-box">
                                {formatPrice(filters.priceRange[0])}
                              </span>

                              <span className="price-box">
                                {formatPrice(filters.priceRange[1])}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* <div className="filter-section suggested-section">
                      <div className="flight-filter-header d-flex justify-content-between align-items-center flight-filter-toggle">
                        <div className="flight-filter-left">
                          <span className="flight-filter-title">Star Category</span>
                        </div>
              
                        <i className="fa-solid fa-caret-up flight-filter-icon"></i>
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
                    </div> */}

                    {/* <div className="filter-section suggested-section">
                      <div className="flight-filter-header d-flex justify-content-between align-items-center flight-filter-toggle">
                        <div className="flight-filter-left">
                          <span className="flight-filter-title">Property Type</span>
                        </div>

                        <i className="fa-solid fa-caret-up flight-filter-icon"></i>
                      </div>

                      <div className="suggested-item mt-3">
                        <div className="checkbox-wrapper-33">
                          <label className="checkbox">
                            <input
                              className="checkbox__trigger visuallyhidden"
                              type="checkbox"
                              checked={filters.propertyType.includes('APARTMENT')}
                              onChange={() => togglePropertyType('APARTMENT')}
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
                              checked={filters.propertyType.includes('VILLA')}
                              onChange={() => togglePropertyType('VILLA')}
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
                              checked={filters.propertyType.includes('HOTEL')}
                              onChange={() => togglePropertyType('HOTEL')}
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
                              checked={filters.propertyType.includes('RESORT')}
                              onChange={() => togglePropertyType('RESORT')}
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
                              checked={filters.propertyType.includes('HOMESTAY')}
                              onChange={() => togglePropertyType('HOMESTAY')}
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
                    </div> */}

                    <div className="filter-section suggested-section">
                      <div className="flight-filter-header d-flex justify-content-between align-items-center flight-filter-toggle">
                        <div className="flight-filter-left">
                          <span className="flight-filter-title">Top locations</span>
                        </div>

                        <i className="fa-solid fa-caret-up flight-filter-icon"></i>
                      </div>

                      <div className="suggested-item mt-3">
                        <div className="checkbox-wrapper-33">
                          <label className="checkbox">
                            <input
                              className="checkbox__trigger visuallyhidden"
                              type="checkbox"
                              checked={filters.topLocations.includes('NORTH_GOA')}
                              onChange={() => toggleTopLocation('NORTH_GOA')}
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
                              checked={filters.topLocations.includes('HURGHADA')}
                              onChange={() => toggleTopLocation('HURGHADA')}
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

                            <p className="checkbox__textwrapper">Hurghada</p>
                          </label>
                        </div>
                      </div>

                      <div className="suggested-item">
                        <div className="checkbox-wrapper-33">
                          <label className="checkbox">
                            <input
                              className="checkbox__trigger visuallyhidden"
                              type="checkbox"
                              checked={filters.topLocations.includes('SOUTH_GOA')}
                              onChange={() => toggleTopLocation('SOUTH_GOA')}
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
                              checked={filters.topLocations.includes('BAGA_BEACH')}
                              onChange={() => toggleTopLocation('BAGA_BEACH')}
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
                              checked={filters.topLocations.includes('PANJIM')}
                              onChange={() => toggleTopLocation('PANJIM')}
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
                              checked={filters.topLocations.includes('CALANGUTE_BEACH')}
                              onChange={() => toggleTopLocation('CALANGUTE_BEACH')}
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
                              checked={filters.topLocations.includes('CANDOLIM_BEACH')}
                              onChange={() => toggleTopLocation('CANDOLIM_BEACH')}
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
                              checked={filters.topLocations.includes('VAGATOR')}
                              onChange={() => toggleTopLocation('VAGATOR')}
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
                              checked={filters.topLocations.includes('ANJUNA_BEACH')}
                              onChange={() => toggleTopLocation('ANJUNA_BEACH')}
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
                              checked={filters.topLocations.includes('PALOLEM_BEACH')}
                              onChange={() => toggleTopLocation('PALOLEM_BEACH')}
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
                              checked={filters.topLocations.includes('CANDOLIM')}
                              onChange={() => toggleTopLocation('CANDOLIM')}
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

                    {/* <div className="filter-section suggested-section">
                      <div className="flight-filter-header d-flex justify-content-between align-items-center flight-filter-toggle">
                        <div className="flight-filter-left">
                          <span className="flight-filter-title">Guests Love</span>
                        </div>

                        <i className="fa-solid fa-caret-up flight-filter-icon"></i>
                      </div>

                      <div className="suggested-item mt-3">
                        <div className="checkbox-wrapper-33">
                          <label className="checkbox">
                            <input
                              className="checkbox__trigger visuallyhidden"
                              type="checkbox"
                              checked={filters.guestsLove.includes('WIFI')}
                              onChange={() => toggleGuestsLove('WIFI')}
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
                              checked={filters.guestsLove.includes('SPA')}
                              onChange={() => toggleGuestsLove('SPA')}
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
                              checked={filters.guestsLove.includes('SWIMMING_POOL')}
                              onChange={() => toggleGuestsLove('SWIMMING_POOL')}
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
                    </div> */}

                    {/* <div className="filter-section suggested-section mt-4">
                      <div className="flight-filter-header d-flex justify-content-between align-items-center flight-filter-toggle">
                        <div className="flight-filter-left">
                          <span className="flight-filter-title">Booking Preference</span>
                        </div>

                        <i className="fa-solid fa-caret-up flight-filter-icon"></i>
                      </div>

                      <div className="suggested-item mt-3">
                        <div className="checkbox-wrapper-33">
                          <label className="checkbox">
                            <input
                              className="checkbox__trigger visuallyhidden"
                              type="checkbox"
                              checked={filters.bookingPreference.includes('ENTIRE_VILLAS_APARTMENTS')}
                              onChange={() => toggleBookingPreference('ENTIRE_VILLAS_APARTMENTS')}
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
                              checked={filters.bookingPreference.includes('CARETAKER')}
                              onChange={() => toggleBookingPreference('CARETAKER')}
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
                              checked={filters.bookingPreference.includes('INSTANT_BOOK')}
                              onChange={() => toggleBookingPreference('INSTANT_BOOK')}
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
                              checked={filters.bookingPreference.includes('HOMESTAYS')}
                              onChange={() => toggleBookingPreference('HOMESTAYS')}
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
                    </div> */}

                    {/* <div className="filter-section suggested-section mt-4">
                      <div className="flight-filter-header d-flex justify-content-between align-items-center flight-filter-toggle">
                        <div className="flight-filter-left">
                          <span className="flight-filter-title">House Rules</span>
                        </div>

                        <i className="fa-solid fa-caret-up flight-filter-icon"></i>
                      </div>

                      <div className="suggested-item mt-3">
                        <div className="checkbox-wrapper-33">
                          <label className="checkbox">
                            <input
                              className="checkbox__trigger visuallyhidden"
                              type="checkbox"
                              checked={filters.houseRules.includes('SELF_CHECK_IN')}
                              onChange={() => toggleHouseRule('SELF_CHECK_IN')}
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
                              checked={filters.houseRules.includes('SMOKING_ALLOWED')}
                              onChange={() => toggleHouseRule('SMOKING_ALLOWED')}
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
                              checked={filters.houseRules.includes('ALL_MALE_GROUPS_ALLOWED')}
                              onChange={() => toggleHouseRule('ALL_MALE_GROUPS_ALLOWED')}
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
                              checked={filters.houseRules.includes('UNMARRIED_COUPLES_ALLOWED')}
                              onChange={() => toggleHouseRule('UNMARRIED_COUPLES_ALLOWED')}
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
                              checked={filters.houseRules.includes('ALCOHOL_ALLOWED')}
                              onChange={() => toggleHouseRule('ALCOHOL_ALLOWED')}
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
                              checked={filters.houseRules.includes('PETS_ALLOWED')}
                              onChange={() => toggleHouseRule('PETS_ALLOWED')}
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
                    </div> */}

                    {/* <div className="filter-section suggested-section mt-4">
                      <div className="flight-filter-header d-flex justify-content-between align-items-center flight-filter-toggle">
                        <div className="flight-filter-left">
                          <span className="flight-filter-title">Deals & Offers</span>
                        </div>

                        <i className="fa-solid fa-caret-up flight-filter-icon"></i>
                      </div>

                      <div className="suggested-item mt-3">
                        <div className="checkbox-wrapper-33">
                          <label className="checkbox">
                            <input
                              className="checkbox__trigger visuallyhidden"
                              type="checkbox"
                              checked={filters.dealsOffers.includes('TRAVEL_KA_MUHURAT_SALE')}
                              onChange={() => toggleDealsOffers('TRAVEL_KA_MUHURAT_SALE')}
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
                              checked={filters.dealsOffers.includes('LIGHTNING_DROPS')}
                              onChange={() => toggleDealsOffers('LIGHTNING_DROPS')}
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
                    </div> */}
                  </div>
                </div>

                <div className={resHotelFilterToggle ? "filter-overlay active" : "filter-overlay"} onClick={() => setResHotelFilterToggle(false)}></div>
              </div>

              <div className="col-lg-9">
                <div className="ajhfbmuihehee mb-4">
                  <h5 className="fw-semibold mb-0">{filteredHotels?.length} Hotels Found on Your Search</h5>

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

                  {filteredHotels?.length > 0 ? (
                    filteredHotels.map((hotel, index) => {

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
                                          <p className="sgfsvdfgf mt-1 mb-3">
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

                                        <div className="ubjbsdknfusdf">
                                            <p className="mb-1">| {displayName}</p>
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
