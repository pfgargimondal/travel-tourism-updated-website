import { useEffect, useState } from "react";
// eslint-disable-next-line
import { Link, useParams, useSearchParams } from "react-router-dom";
import http from "../../http";
import Loader from "../../component/Loader/Loader";
import "./HotelDetails.css";

export const HotelDetails = () => {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const [hotelDetails, setHotelDetails] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAllFacilities, setShowAllFacilities] = useState(false);
  const [expandedRooms, setExpandedRooms] = useState({});
  const [activeTab, setActiveTab] = useState("rooms");
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const [showModal, setShowModal] = useState(false);
  // eslint-disable-next-line
  const [selectedRoom, setSelectedRoom] = useState(null);

  useEffect(() => {
    const fetchHotelDetails = async () => {
      setLoading(true);
      try {
        const checkin = searchParams.get("checkin");
        const checkout = searchParams.get("checkout");
        const rooms = searchParams.get("rooms");
        const adults = searchParams.get("adults");
        const children = searchParams.get("children");

        const response = await http.get(
          `/get-hotel-code-details/${slug}?checkin=${checkin}&checkout=${checkout}&rooms=${rooms}&adults=${adults}&children=${children}`,
        );

        setHotelDetails(response.data.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchHotelDetails();
  }, [slug, searchParams]);

  const remainingImages = hotelDetails?.hotel_images?.length - 4;

  const sectionsToRemove = [
    "Accommodations:",
    "Amenities:",
    "Dining Options:",
    "Nearby Location & Transportation:",
    "Nearby Attractions:",
    "Wellness And Activities:",
    "Policies & Check-In Instructions:",
  ];

  let cleanDescription = hotelDetails?.description || "";

  const totalFare = Math.round(
    hotelDetails?.hotelPriceDetails?.[0]?.Rooms?.[0]?.TotalFare || 0,
  );

  const promotion =
    hotelDetails?.hotelPriceDetails?.[0]?.Rooms?.[0]?.RoomPromotion?.[0] || "";

  const discountPercent = Number(promotion.match(/\d+/)?.[0] || 0);

  const discountedPrice = (
    totalFare -
    (totalFare * discountPercent) / 100
  ).toFixed(0);

  const room = hotelDetails?.hotelPriceDetails?.[0]?.Rooms?.[0];
  const roomCount = room?.Name?.length || 1;
  const roomName = room?.Name?.[0] || "";
  const displayName = `${roomCount} x (${roomName})`;

  sectionsToRemove.forEach((section) => {
    cleanDescription = cleanDescription.replace(
      new RegExp(
        `<p><strong>${section.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}<\\/strong>.*?(?=<p><strong>|$)`,
        "is",
      ),
      "",
    );
  });

  const getFacilityImage = (facility = "") => {
    const name = facility.toLowerCase();

    if (name.includes("wifi"))
      return "https://img.icons8.com/fluency/48/wifi.png";

    if (name.includes("pool"))
      return "https://img.icons8.com/fluency/48/swimming-pool.png";

    if (name.includes("spa"))
      return "https://img.icons8.com/fluency/48/spa-flower.png";

    if (
      name.includes("fitness") ||
      name.includes("gym") ||
      name.includes("health club")
    )
      return "https://img.icons8.com/fluency/48/dumbbell.png";

    if (name.includes("beach"))
      return "https://img.icons8.com/fluency/48/beach.png";

    if (name.includes("tennis"))
      return "https://cdn-icons-png.flaticon.com/512/857/857455.png";

    if (name.includes("parking"))
      return "https://img.icons8.com/fluency/48/parking.png";

    if (name.includes("breakfast") || name.includes("restaurant"))
      return "https://img.icons8.com/fluency/48/restaurant.png";

    if (name.includes("bar"))
      return "https://img.icons8.com/fluency/48/cocktail.png";

    if (name.includes("conference") || name.includes("meeting"))
      return "https://img.icons8.com/fluency/48/conference-call.png";

    if (name.includes("laundry"))
      return "https://img.icons8.com/fluency/48/washing-machine.png";

    if (name.includes("children") || name.includes("playground"))
      return "https://img.icons8.com/fluency/48/playground.png";

    if (name.includes("snorkeling"))
      return "https://img.icons8.com/fluency/48/snorkel.png";

    if (name.includes("volleyball"))
      return "https://img.icons8.com/fluency/48/volleyball-player.png";

    if (name.includes("library") || name.includes("books"))
      return "https://img.icons8.com/fluency/48/books.png";

    if (name.includes("atm"))
      return "https://img.icons8.com/fluency/48/atm.png";

    if (name.includes("concierge"))
      return "https://img.icons8.com/fluency/48/concierge.png";

    if (name.includes("garden"))
      return "https://img.icons8.com/fluency/48/garden.png";

    if (name.includes("library"))
      return "https://img.icons8.com/fluency/48/books.png";

    if (name.includes("steam"))
      return "https://img.icons8.com/fluency/48/steam-room.png";

    if (name.includes("sauna"))
      return "https://img.icons8.com/fluency/48/sauna.png";

    if (name.includes("luggage"))
      return "https://img.icons8.com/fluency/48/luggage.png";

    if (
      name.includes("hair salon") ||
      name.includes("salon") ||
      name.includes("hairdresser") ||
      name.includes("barber")
    ) {
      return "https://cdn-icons-png.flaticon.com/512/3050/3050525.png";
    }
    if (
      name.includes("scuba") ||
      name.includes("Scuba diving") ||
      name.includes("diving")
    ) {
      return "https://img.icons8.com/fluency/48/scuba-diving.png";
    }

    if (name.includes("coffee") || name.includes("tea")) {
      return "https://cdn-icons-png.flaticon.com/512/924/924514.png";
    }
    if (name.includes("television") || name.includes("tv"))
      return "https://cdn-icons-png.flaticon.com/512/2503/2503508.png";

    return "https://img.icons8.com/fluency/48/services.png";
  };

  // const handleViewAll = () => {
  //   setActiveTab("rooms");

  //   document.getElementById("rooms")?.scrollIntoView({
  //     behavior: "smooth",
  //     block: "start",
  //   });
  // };

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const selectRoom = (room) => {
    setSelectedRoom(room);
    handleClose();
  };


  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      <div className="sdfsdf655">
        <div className="container">
          <div className="asfdgsqwe">
            <ul className="ps-0 d-flex align-items-center gap-3">
              <li className="active">Hotels</li>

              <li>
                <i className="bi bi-arrow-right"></i>
              </li>

              <li>{hotelDetails?.hotel_name}</li>
            </ul>
          </div>

          <div className="sgbdrsfweqeqe">
            <div className="row">
              <div className="col-lg-9">
                <div className="sdfsdfsdf78 hotel-detls-wrppr">
                  <div className="hotel-card">
                    <div className="sdbhjsdfds d-flex justify-content-between mb-4">
                      <div className="duiewnjdmsdx">
                        <h4 className="fw-bold mb-2">
                          {hotelDetails?.hotel_name}
                        </h4>

                        <h6 className="jkvnxlkjvkxccv mb-2">
                          <i className="fa-solid me-1 fa-location-dot"></i>{" "}
                          {hotelDetails?.address}
                        </h6>

                        <div className="sbfsdvfsf d-flex align-items-center">
                          <div className="vfddf me-1">
                            {[...Array(5)].map((_, index) => (
                              <i
                                key={index}
                                className={`fa-star ${
                                  index <
                                  Number(hotelDetails?.hotel_rating || 0)
                                    ? "fa-solid"
                                    : "fa-regular"
                                }`}
                              ></i>
                            ))}
                          </div>

                          <div className="xfhgxdvxcv">
                            <p className="mb-0 py-1 px-2">Hotel</p>
                          </div>
                        </div>
                      </div>

                      <div className="bcbsdbszsd d-flex gap-2">
                        <div className="sdhgxifoijjd text-end">
                          <h6 className="mb-0">
                            Excellent
                            {/* <span className="small text-muted">(412 Ratings)</span> */}
                          </h6>

                          {/* <Link to="/" className="review-link">
                            <b>All Reviews</b>
                          </Link> */}
                        </div>

                        <span className="rating-box mb-0">
                          {hotelDetails?.hotel_rating || 0}
                        </span>
                      </div>
                    </div>

                    <div className="fbhjsfsdf88">
                      <div className="row">
                        <div className="col-lg-8">
                          <div className="bhjddsfs">
                            <img src={hotelDetails?.image} alt="" />
                          </div>
                        </div>
                        <div className="col-lg-4">
                          <div className="dfsdf542">
                            {hotelDetails?.hotel_images
                              ?.slice(0, 1)
                              .map((hotelImage, index, arr) => (
                                <div className="hgcghghvfhg" key={index}>
                                  <img src={hotelImage.image_url} alt="" />
                                </div>
                              ))}
                            {hotelDetails?.hotel_images?.length > 1 && (
                              <div className="col position-relative hgcghghvfhg">
                                <img
                                  src={hotelDetails.hotel_images[1].image_url}
                                  className="gallery-img overlay-img"
                                  alt="Hotel"
                                />

                                <div className="overlay-text">
                                  +{hotelDetails.hotel_images.length - 1} All
                                  Photos
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="dsvbjhdvsdc mt-4">
                      <h5 className="mb-3">About Property</h5>

                      <div
                        dangerouslySetInnerHTML={{
                          __html: cleanDescription,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-3">
                <div className="vfvfdvfd55 sticky-top">
                  <div className="hotel-card pt-0">
                    <div className="duiswijfjsdf d-flex justify-content-center text-center mb-3">
                      <h6 className="mb-0 text-white p-2 px-4">ROOM DETAILS</h6>
                    </div>

                    <div className="sidebar-card">
                      <div className="dcsincknsdcz d-flex align-items-center gap-2 pb-3">
                        <div className="dskncknslkcm text-center rounded-circle p-3">
                          <i class="fa-solid fa-bed"></i>
                        </div>

                        <h5 className="room-title mb-0">
                          {/* {hotelDetails?.hotelPriceDetails?.[0]?.Rooms?.[0]?.Name?.[0]} */}
                          {displayName}
                        </h5>
                      </div>

                      <div className="dlozaclznokxcnzxc py-3">
                        <p className="small text-muted mb-2">
                          <i className="fa-solid me-1 fa-shield-halved"></i>
                          {hotelDetails?.hotelPriceDetails?.[0]?.Rooms?.[0]
                            ?.IsRefundable === false
                            ? "Non-Refundable"
                            : "Refundable"}
                        </p>

                        <p className="small text-muted mb-0">
                          <i class="fa-solid me-1 fa-moon"></i> Per Night
                        </p>
                      </div>

                      <div className="cdincjczxc vfsdfzbgxv py-3">
                        <div className="doisjdfsdf">
                          <div className="dokcknzsicnisd d-flex align-items-center flex-wrap gap-2">
                            <span>₹{discountedPrice}</span>

                            <span>₹{totalFare}</span>
                          </div>
                        </div>

                        <div className="vdfv785">
                          <p className="mb-0">
                            +&nbsp;₹&nbsp;
                            {Math.round(
                              hotelDetails?.hotelPriceDetails?.[0]?.Rooms?.[0]
                                ?.TotalTax,
                            )}
                            &nbsp;taxes &amp; fees Per Night for {roomCount}{" "}
                            Room{roomCount > 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>

                      <button className="btn-tour w-100">Book This Now</button>

                      <div className="xvbzxbcfndddd mt-2">
                        <button
                          className="btn-tour view-btn w-100 mb-3"
                          onClick={handleShow}
                        >
                          View All (
                          {hotelDetails?.hotelPriceDetails?.[0]?.Rooms
                            ?.length || 0}
                          )
                        </button>

                        <p className="mb-0 d-block text-center">
                          <i className="bi me-1 bi-shield-shaded"></i>
                          {hotelDetails?.hotelPriceDetails?.[0]?.Rooms?.[0]
                            ?.IsRefundable === false
                            ? "Non-Refundable"
                            : "Refundable"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="duiahndlsd">
                    <div className="hotel-card border-0 px-0">
                      <div className="sidebar-card">
                        <div className="d-flex align-items-center mb-2">
                          <img
                            src="https://cdn-icons-png.flaticon.com/512/684/684908.png"
                            className="map-icon"
                            alt=""
                          />
                          <div className="xcnxbsdczd ms-2">
                            <p className="mb-0">Apporo</p>

                            <span className="small text-muted">
                              3.7 km drive to Anjuna Beach
                            </span>
                          </div>
                        </div>

                        <div className="map-img">
                          <iframe
                            src="https://www.google.com/maps?q=Anjuna+Beach&output=embed"
                            allowfullscreen=""
                            loading="lazy"
                            title="map"
                          ></iframe>
                        </div>

                        <div
                          className="deal-box mt-2"
                          style={{ padding: "20px" }}
                        >
                          <div className="deal-badge position-relative d-flex flex-column gap-2 align-items-center">
                            <span className="d-block bg-white rounded-circle position-relative">
                              <i className="bi position-absolute bi-tag-fill"></i>
                            </span>

                            {/* <span className="d-flex bg-white align-items-center justify-content-center rounded-circle text-center">5 Minutes Deal</span> */}
                          </div>

                          <p className="small mb-0">
                            Congratulations! You're getting{" "}
                            <span>{promotion.replace("Save:", "")}</span>{" "}
                            discount.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-12">
                <div className="duijewkijuler-tabs p-0">
                  <ul className="mkooijokerr bg-white nav nav-tabs px-2 mb-0 sticky-top mb-3 gap-3">
                    <li className="nav-item" role="presentation">
                      <a href="#rooms" onClick={() => setActiveTab("rooms")}>
                        <button
                          className={`nav-link ${activeTab === "rooms" ? "active" : ""}`}
                          type="button"
                        >
                          <img src="./images/prop1 (1).png" alt="" /> Rooms
                        </button>
                      </a>
                    </li>

                    <li className="nav-item" role="presentation">
                      <a
                        href="#amenities"
                        onClick={() => setActiveTab("amenities")}
                      >
                        <button
                          className={`nav-link ${activeTab === "amenities" ? "active" : ""}`}
                          type="button"
                        >
                          <img src="./images/prop1 (2).png" alt="" /> Amenities
                        </button>
                      </a>
                    </li>

                    <li className="nav-item" role="presentation">
                      <a
                        href="#attrctns"
                        onClick={() => setActiveTab("attrctns")}
                      >
                        <button
                          className={`nav-link ${activeTab === "attrctns" ? "active" : ""}`}
                          type="button"
                        >
                          <img src="./images/prop1 (2).png" alt="" />{" "}
                          Attractions
                        </button>
                      </a>
                    </li>

                    <li className="nav-item" role="presentation">
                      <a
                        href="#property-rules"
                        onClick={() => setActiveTab("property-rules")}
                      >
                        <button
                          className={`nav-link ${activeTab === "property-rules" ? "active" : ""}`}
                          type="button"
                        >
                          <img src="./images/prop1 (2).png" alt="" /> Property
                          Rules
                        </button>
                      </a>
                    </li>

                    <li className="nav-item" role="presentation">
                      <a href="#bp" onClick={() => setActiveTab("bp")}>
                        <button
                          className={`nav-link ${activeTab === "bp" ? "active" : ""}`}
                          type="button"
                        >
                          <img src="./images/prop1 (2).png" alt="" /> Booking
                          Policy
                        </button>
                      </a>
                    </li>

                    <li className="nav-item" role="presentation">
                      <a
                        href="#reviews"
                        onClick={() => setActiveTab("reviews")}
                      >
                        <button
                          className={`nav-link ${activeTab === "reviews" ? "active" : ""}`}
                          type="button"
                        >
                          <img src="./images/prop1 (2).png" alt="" /> Ratings &
                          Reviews
                        </button>
                      </a>
                    </li>
                  </ul>

                  <div className="czxvbbcsdfdcfc-tab-content">
                    <div className="jkcnjsdnmdf dijiejrwewer" id="rooms">
                      <div className="hotel-card">
                        <div className="dbvhjdxcxbvdxsvsdfs">
                          {hotelDetails?.hotel_rooms?.map(
                            (hotelRoom, index) => {
                              const amenities =
                                hotelRoom.RoomDescription?.replace(/&/g, "")
                                  .split(",")
                                  .flatMap((item) =>
                                    item
                                      .split(/\s-\s/)
                                      .map((part) =>
                                        part
                                          .trim()
                                          .replace(/^(and|a|an)\s+/i, ""),
                                      ),
                                  )
                                  .filter((item) => item.length > 0);
                              const isExpanded = expandedRooms[index] || false;
                              return (
                                <div className="idjkbnasjknfsd">
                                  <div className="row">
                                    <div className="col-lg-3">
                                      <div className="sikncjknsldcf bzdvzxczxc position-relative">
                                        <div className="fbvhjd mb-3">
                                          <img
                                            src={
                                              hotelRoom.imageURL
                                                ? JSON.parse(
                                                    hotelRoom.imageURL,
                                                  )?.[0]
                                                : ""
                                            }
                                            alt="Hotel Room"
                                          />

                                          <div className="wishlist-icon">
                                            <img
                                              src="https://cdn-icons-png.flaticon.com/512/833/833472.png"
                                              alt="heart"
                                            />
                                          </div>
                                        </div>

                                        <div className="diszjcfjsocjzc d-flex gap-2 flex-wrap">
                                          <div className="feature-row tour-badge">
                                            <i className="bi bi-pin-map"></i>

                                            <span>{hotelRoom.RoomSize}</span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="col-lg-9">
                                      <div className="doisjdosdf py-1">
                                        <div className="row">
                                          <div className="col-lg-8">
                                            <div className="ifjscoifksdc pe-2">
                                              <div className="sdbhjdsd">
                                                <h4 className="mb-2">
                                                  {hotelRoom.RoomName}
                                                </h4>
                                              </div>

                                              <div className="dsbhjsdsf">
                                                <p className="mb-3">
                                                  Room with Breakfast +
                                                  Lunch/Dinner
                                                </p>
                                              </div>

                                              <div className="amenities_wrap_box mb-3">
                                                <ul className="amenities_list ps-0 mb-3">
                                                  {(isExpanded
                                                    ? amenities
                                                    : amenities.slice(0, 6)
                                                  ).map((item, i) => (
                                                    <li
                                                      className="d-flex"
                                                      key={i}
                                                    >
                                                      <i className="bi me-2 bi-check-circle-fill"></i>{" "}
                                                      {item}
                                                    </li>
                                                  ))}
                                                </ul>

                                                {amenities.length > 6 && (
                                                  <span
                                                    className="dijskjfsdf-btn px-2 py-1"
                                                    onClick={() =>
                                                      setExpandedRooms(
                                                        (prev) => ({
                                                          ...prev,
                                                          [index]: !prev[index],
                                                        }),
                                                      )
                                                    }
                                                  >
                                                    {isExpanded
                                                      ? "Show Less"
                                                      : "More Details"}{" "}
                                                    <i
                                                      className={`bi ${isExpanded ? "bi-arrow-up-circle" : "bi-arrow-down-circle"}`}
                                                    ></i>
                                                  </span>
                                                )}
                                              </div>

                                              <div className="sdhbfdsfsfd">
                                                <h6>Experiences Included</h6>
                                                <p>
                                                  Enjoy Happy Hours with 1+1
                                                  offer on Alcoholic Drinks,
                                                  Soft Beverages
                                                </p>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            },
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="jcknnsdndsff dijiejrwewer" id="amenities">
                      <div className="hotel-card">
                        <div className="diuejfmjsdf">
                          <h5 className="mb-3">Amenities</h5>

                          <div className="idnidejegsdsc">
                            <div className="amenities-list d-flex flex-wrap gap-3">
                              {hotelDetails?.hotel_facilities
                                ?.slice(
                                  0,
                                  showAllFacilities
                                    ? hotelDetails.hotel_facilities.length
                                    : 5,
                                )
                                .map((hotelFacility, index) => (
                                  <div className="amenity-item" key={index}>
                                    <img
                                      src={getFacilityImage(
                                        hotelFacility.facility,
                                      )}
                                      alt={hotelFacility.facility}
                                      width="32"
                                      height="32"
                                    />
                                    <span>{hotelFacility.facility}</span>
                                  </div>
                                ))}
                            </div>

                            <div className="text-end">
                              {hotelDetails?.hotel_facilities?.length > 4 && (
                                <span
                                  className="dijskjfsdf-btn px-2 py-1"
                                  onClick={() =>
                                    setShowAllFacilities(!showAllFacilities)
                                  }
                                >
                                  {showAllFacilities ? "Show Less" : "View All"}{" "}
                                  <i
                                    className={`bi ${showAllFacilities ? "bi-arrow-up-circle" : "bi-arrow-down-circle"}`}
                                  ></i>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="xcvbnyuhdusjdd dijiejrwewer" id="attrctns">
                      <div className="hotel-card">
                        <h5 className="mb-3">Attractions</h5>
                        <ul className="attraction-list">
                          {hotelDetails?.hotel_attractions?.map(
                            (hotelAttraction, index) => (
                              <li className="amenity-item" key={index}>
                                {hotelAttraction.title}{" "}
                                {hotelAttraction.attraction}
                              </li>
                            ),
                          )}
                        </ul>
                      </div>
                    </div>

                    <div
                      className="xcvbnyuhdusjdd dijiejrwewer"
                      id="property-rules"
                    >
                      <div className="hotel-card">
                        <div className="dhjdsds788">
                          <section className="property-rules-section">
                            <div className="diuejfmjsdf mb-3">
                              <h5 className="mb-3">Property Rules</h5>
                              <p className="mb-0">
                                <strong>Check-in:</strong> 2 PM &nbsp;&nbsp;
                                <strong>Check-out:</strong> 12 PM
                              </p>
                            </div>

                            <hr />

                            <div className="row mt-3">
                              <div className="col-lg-6">
                                <div className="rules-tag mb-3">
                                  ❤️ Couple/Bachelor Rules
                                </div>

                                <div className="rules-highlight mb-3">
                                  Unmarried couples allowed. Local ids are
                                  allowed
                                </div>

                                <ul className="rules-list">
                                  <li>
                                    Primary Guest should be atleast 18 years of
                                    age.
                                  </li>
                                  <li>
                                    Groups with only male guests are allowed at
                                    the property
                                  </li>
                                </ul>
                              </div>

                              <div className="col-lg-6">
                                <ul className="rules-list">
                                  <li>
                                    Passport, Aadhaar and Driving License are
                                    accepted as ID proof(s)
                                  </li>
                                  <li>Pets are not allowed</li>
                                  <li>
                                    Mandatory: This rate and cancellation policy
                                    is only applicable for booking upto 7 rooms.
                                    Bookings with more than 7 rooms are
                                    considered group bookings & the right to
                                    admission is reserved by hotel.
                                  </li>
                                </ul>
                              </div>
                            </div>

                            <div className="mt-3 d-flex gap-2 flex-wrap">
                              <button className="rule-btn">
                                Must Read Rules
                              </button>
                              <button className="rule-btn">
                                Guest Profile
                              </button>
                              <button className="rule-btn">
                                Guest Profile (Hourly)
                              </button>
                              <a href="/" className="read-all">
                                Read All Property Rules
                              </a>
                            </div>
                          </section>
                        </div>
                      </div>
                    </div>

                    <div className="xcvbnyuhdusjdd dijiejrwewer" id="bp">
                      <div className="hotel-card">
                        <p className="mb-0">
                          Lorem ipsum dolor, sit amet consectetur adipisicing
                          elit. Animi in ex molestiae commodi vero quaerat ullam
                          porro. Quo, ratione deserunt.
                        </p>
                      </div>

                      <div className="dbydfff854">
                        <section className="guest-gallery-section mt-4">
                          <div className="diuejfmjsdf gallery-box p-3">
                            <h5 className="mb-3">Hotel Photos</h5>

                            <div className="row g-3">
                              {hotelDetails?.hotel_images
                                ?.slice(3, 8)
                                .map((hotelImage, index) => (
                                  <div className="col" key={index}>
                                    <img
                                      src={hotelImage.image_url}
                                      className="gallery-img"
                                      alt={`Hotel ${index + 1}`}
                                      onClick={() => {
                                        setSelectedImage(hotelImage.image_url);
                                        setGalleryOpen(true);
                                      }}
                                      style={{ cursor: "pointer" }}
                                    />
                                  </div>
                                ))}

                              {hotelDetails?.hotel_images?.length > 3 && (
                                <div
                                  className="col position-relative"
                                  style={{
                                    cursor: "pointer",
                                    zIndex: 10,
                                  }}
                                  onClick={() => {

                                    const lastImage =
                                      hotelDetails.hotel_images[
                                        hotelDetails.hotel_images.length - 1
                                      ]?.image_url;

                                    if (lastImage) {
                                      setSelectedImage(lastImage);
                                      setGalleryOpen(true);
                                    }
                                  }}
                                >
                                  <img
                                    src={
                                      hotelDetails.hotel_images[
                                        hotelDetails.hotel_images.length - 1
                                      ]?.image_url
                                    }
                                    className="gallery-img"
                                    alt="Hotel"
                                    style={{
                                      width: "100%",
                                      cursor: "pointer",
                                      pointerEvents: "none",
                                    }}
                                  />

                                  <div
                                    className="overlay-text"
                                    style={{
                                      pointerEvents: "none",
                                    }}
                                  >
                                    +{remainingImages} Guest Photos
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </section>
                        {/* Gallery Modal */}
                        {galleryOpen && (
                          <div
                            id="galleryModal"
                            className="gallery-modal"
                            onClick={(e) => {
                              if (e.target.id === "galleryModal") {
                                setGalleryOpen(false);
                              }
                            }}
                          >
                            {/* Close button */}
                            <button
                              type="button"
                              className="close-btn"
                              onClick={() => setGalleryOpen(false)}
                            >
                              &times;
                            </button>

                            {/* Main image */}
                            <div className="modal-content-custom">
                              <img
                                src={selectedImage}
                                id="modalImage"
                                alt="Hotel"
                              />
                            </div>

                            {/* Thumbnails */}
                            <div className="gallery-thumbs">
                              {hotelDetails?.hotel_images?.map((hotelImage, index) => (
                                <img
                                  key={index}
                                  src={hotelImage.image_url}
                                  alt={`Hotel thumbnail ${index + 1}`}
                                  onClick={() => setSelectedImage(hotelImage.image_url)}
                                  className={
                                    selectedImage === hotelImage.image_url
                                      ? "active-thumb"
                                      : ""
                                  }
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="jnduiejjrr dijiejrwewer" id="reviews">
                      <div className="hotel-card">
                        <div className="hjdbjhfd885">
                          <div className="diuejfmjsdf d-flex justify-content-between align-items-center mb-3">
                            <h5 className="mb-3">User Rating & Reviews</h5>
                            <span className="verified">✔ Verified Reviews</span>
                          </div>

                          <div className="review-tabs mb-3">
                            <span className="active">Everyone</span>
                            <span>Group</span>
                            <span>Couple</span>
                            <span>Solo</span>
                            <span>Business</span>
                            <span>Family</span>
                          </div>

                          <div className="row">
                            <div className="col-lg-4">
                              <div className="rating_sidebar_box">
                                <div className="rating_top">
                                  <div className="rating_score">4.3</div>
                                  <div>
                                    <h4>Excellent</h4>
                                    <p>2540 Ratings, 1352 Reviews</p>
                                  </div>
                                </div>

                                <div className="rating_bar_wrap">
                                  <div className="rating_row">
                                    <span>Excellent</span>
                                    <div className="bar">
                                      <div style={{ width: "60%" }}></div>
                                    </div>
                                    <span>60%</span>
                                  </div>

                                  <div className="rating_row">
                                    <span>Very Good</span>
                                    <div className="bar">
                                      <div style={{ width: "24%" }}></div>
                                    </div>
                                    <span>24%</span>
                                  </div>

                                  <div className="rating_row">
                                    <span>Average</span>
                                    <div className="bar">
                                      <div style={{ width: "9%" }}></div>
                                    </div>
                                    <span>9%</span>
                                  </div>

                                  <div className="rating_row">
                                    <span>Poor</span>
                                    <div className="bar">
                                      <div style={{ width: "4%" }}></div>
                                    </div>
                                    <span>4%</span>
                                  </div>

                                  <div className="rating_row">
                                    <span>Bad</span>
                                    <div className="bar">
                                      <div style={{ width: "3%" }}></div>
                                    </div>
                                    <span>3%</span>
                                  </div>
                                </div>

                                <hr />

                                <div className="last_ratings">
                                  <h5>
                                    Last 10 Customer Ratings{" "}
                                    <span>(Latest First)</span>
                                  </h5>

                                  <div className="rating_boxes">
                                    <span>4</span>
                                    <span>5</span>
                                    <span>5</span>
                                    <span>5</span>
                                    <span>4</span>
                                    <span>5</span>
                                    <span>4</span>
                                    <span>5</span>
                                    <span>5</span>
                                    <span>5</span>
                                  </div>
                                </div>

                                <hr />

                                <div className="rating_categories">
                                  <h5>Rating Categories</h5>

                                  <div className="cat_row">
                                    <span>Facilities</span>
                                    <div className="cat_score">4.4</div>
                                  </div>

                                  <div className="cat_row">
                                    <span>Food</span>
                                    <div className="cat_score">4.2</div>
                                  </div>

                                  <div className="cat_row">
                                    <span>Cleanliness</span>
                                    <div className="cat_score">4.5</div>
                                  </div>

                                  <div className="cat_row">
                                    <span>Value For Money</span>
                                    <div className="cat_score">4.4</div>
                                  </div>

                                  <div className="cat_row">
                                    <span>Child Friendliness</span>
                                    <div className="cat_score">4.3</div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="col-lg-8">
                              <div className="review-summary-box">
                                <div className="d-flex align-items-center gap-2 mb-2">
                                  <img
                                    src="https://cdn-icons-png.flaticon.com/512/1828/1828884.png"
                                    alt=""
                                    width="18"
                                  />
                                  <div>
                                    <h6 className="mb-0 fw-bold">
                                      Review Summary
                                    </h6>
                                    <small className="text-muted">
                                      Powered by Myra.AI
                                    </small>
                                  </div>
                                </div>

                                <ul className="summary-list">
                                  <li>Friendly and Helpful Staff</li>
                                  <li>Clean and Spacious Rooms</li>
                                  <li>
                                    Excellent Location Near Candolim Beach
                                  </li>
                                  <li>
                                    Delicious and Diverse Breakfast Options
                                  </li>
                                </ul>

                                <a href="/" className="read-more">
                                  Read more
                                </a>
                              </div>

                              <hr />

                              <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-3">
                                <div>
                                  <h6 className="mb-2 fw-bold">Filter By:</h6>

                                  <div className="filter-chips">
                                    <span className="chip active">
                                      All Reviews
                                    </span>
                                    <span className="chip">Friendly staff</span>
                                    <span className="chip">Staff Courtesy</span>
                                    <span className="chip">Food</span>
                                    <span className="chip">Delicious food</span>
                                    <span className="chip">Good location</span>
                                    <span className="chip">
                                      Comfortable stay
                                    </span>
                                    <span className="chip">
                                      Room Cleanliness
                                    </span>
                                    <span className="chip">Breakfast</span>
                                    <span className="chip">
                                      Service Quality
                                    </span>
                                    <span className="chip">Location</span>
                                  </div>
                                </div>

                                <div className="sort-box">
                                  <label className="fw-bold">Sort by:</label>
                                  <select>
                                    <option>Latest first</option>
                                    <option>Oldest first</option>
                                  </select>
                                </div>
                              </div>

                              <div className="review-card-new">
                                <div className="d-flex align-items-center gap-2 mb-1">
                                  <span className="rating-badge">5.0</span>
                                  <h6 className="mb-0 fw-bold">
                                    Excellent Stay
                                  </h6>
                                </div>

                                <small className="text-muted">
                                  Gowri K • Family With 1 Kid
                                </small>

                                <p className="review-text mt-2">
                                  It’s very good hotel for family stay and
                                  beaches are in walkable distance. We stayed
                                  2nd time in this hotel and it’s worthy
                                </p>

                                <p className="mb-1">
                                  <strong>Travel Month:</strong> Mar 2026
                                </p>
                                <p>
                                  <strong>Room:</strong> Luxe Twin Room
                                </p>

                                <div className="review-imgs">
                                  <img
                                    src="https://images.unsplash.com/photo-1566073771259-6a8506099945"
                                    alt=""
                                  />
                                  <img
                                    src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b"
                                    alt=""
                                  />
                                  <img
                                    src="https://images.unsplash.com/photo-1590490360182-c33d57733427"
                                    alt=""
                                  />
                                </div>

                                <div className="helpful">Helpful 👍</div>
                              </div>

                              <div className="review_master_wrap">
                                <div className="review_single_box">
                                  <div className="review_header">
                                    <div className="rating-badge ">5.0</div>
                                    <div className="review_title_wrap">
                                      <h4>value for money!</h4>
                                      <p>Manish G. • Couple</p>
                                    </div>
                                  </div>

                                  <p className="review_desc">
                                    I accidentally booked twin bedroom and Puja
                                    helped me to change room. The hotel was
                                    clean and well taken care of! It just needs
                                    change in breakfast. Same breakfast every
                                    day doesn’t add to palate.
                                  </p>

                                  <p>
                                    <strong>Travel Month:</strong> Mar 2026
                                    (5-Night Stay)
                                  </p>
                                  <p>
                                    <strong>Room:</strong> Luxe Twin
                                    Room-Tropical View
                                  </p>

                                  <div className="review_images">
                                    <img
                                      src="https://picsum.photos/80?1"
                                      alt=""
                                    />
                                    <img
                                      src="https://picsum.photos/80?2"
                                      alt=""
                                    />
                                    <img
                                      src="https://picsum.photos/80?3"
                                      alt=""
                                    />
                                  </div>

                                  <p className="helpful_btn">Helpful 👍</p>
                                </div>

                                <div className="review_single_box">
                                  <div className="review_header">
                                    <div className="rating-badge">5.0</div>
                                    <div className="review_title_wrap">
                                      <h4>Thanks really enjoy the stay</h4>
                                      <p>Tanushree S. • Couple</p>
                                    </div>
                                  </div>

                                  <p className="review_desc">
                                    Suresh, Jocelyn, David and Chaitanya are
                                    really polite and supportive. Thanks, I
                                    really enjoyed the stay. Thank you for the
                                    wonderful stay.
                                  </p>

                                  <p>
                                    <strong>Travel Month:</strong> Mar 2026
                                  </p>
                                  <p>
                                    <strong>Room:</strong> Luxe Queen Room-Pool
                                    View
                                  </p>

                                  <div className="review_images">
                                    <img
                                      src="https://picsum.photos/80?4"
                                      alt=""
                                    />
                                    <img
                                      src="https://picsum.photos/80?5"
                                      alt=""
                                    />
                                    <img
                                      src="https://picsum.photos/80?6"
                                      alt=""
                                    />
                                  </div>

                                  <p className="helpful_btn">Helpful 👍</p>

                                  <div className="hotel_reply_box">
                                    <p className="reply_title">
                                      Ginger Goa, Candolim{" "}
                                      <span>
                                        has replied on Tue Mar 24 09:46:09 IST
                                        2026
                                      </span>
                                    </p>
                                    <p>
                                      Dear Guest, Thank you so much for your
                                      kind words! I’m delighted to hear that you
                                      had a wonderful stay with us. Suresh,
                                      Jocelyn, David, and Chaitanya will be
                                      thrilled to know that their polite and
                                      supportive service made your visit
                                      enjoyable.
                                    </p>
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
              </div>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <>
          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Available Room Options</h5>

                  <button className="btn-close" onClick={handleClose}></button>
                </div>

                <div className="modal-body">
                  {hotelDetails?.hotelPriceDetails?.[0]?.Rooms?.map(
                    (room, index) => {
                      const roomCount = room?.Name?.length || 1;
                      const roomName = room?.Name?.[0]?.split(",")[0];
                      const bedType = room?.Name?.[0]?.split(",")[1];

                      const totalBasePrice =
                        room?.DayRates?.reduce((sum, rate) => {
                          return sum + (rate?.[0]?.BasePrice || 0);
                        }, 0) || 0;
                      return (
                        <div
                          className="card mb-4 border-0 shadow-sm"
                          key={index}
                        >
                          <div className="card-body">
                            <div className="row">
                              <div className="col-md-8">
                                <h4 className="fw-bold">{roomName}</h4>
                                <p className="text-muted mb-2">
                                  {roomCount} x ({bedType})
                                </p>
                                <div className="mb-2">
                                  <span className="badge bg-success me-2">
                                    {room.MealType}
                                  </span>
                                  {room.IsRefundable ? (
                                    <span className="badge bg-success">
                                      Refundable
                                    </span>
                                  ) : (
                                    <span className="badge bg-danger">
                                      Non Refundable
                                    </span>
                                  )}
                                </div>
                                <p className="mb-2">
                                  <strong>Inclusions</strong>
                                  <br />
                                  {room.Inclusion}
                                </p>
                                {room.RoomPromotion?.length > 0 && (
                                  <>
                                    <strong>Offers</strong>
                                    <ul className="mb-3">
                                      {room.RoomPromotion.map((offer, i) => (
                                        <li key={i}>{offer}</li>
                                      ))}
                                    </ul>
                                  </>
                                )}
                                <strong>Cancellation Policy</strong>
                                <table className="table table-bordered mt-2">
                                  <thead>
                                    <tr>
                                      <th>From Date</th>
                                      <th>Charge Type</th>
                                      <th>Charge</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {room.CancelPolicies?.map((policy, i) => (
                                      <tr key={i}>
                                        <td>{policy.FromDate}</td>
                                        <td>{policy.ChargeType}</td>
                                        <td>
                                          {policy.ChargeType === "Percentage"
                                            ? `${policy.CancellationCharge}%`
                                            : `₹${policy.CancellationCharge}`}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                              <div className="col-md-4 text-end">
                                <h3 className="text-success">
                                  ₹
                                  {Math.round(room.TotalFare).toLocaleString(
                                    "en-IN",
                                  )}
                                </h3>
                                <p className="mb-1">
                                  <small>
                                    Base Price : ₹
                                    {Math.round(totalBasePrice).toLocaleString(
                                      "en-IN",
                                    )}
                                  </small>
                                </p>
                                <p>
                                  <small>
                                    Taxes : ₹
                                    {Math.round(room.TotalTax).toLocaleString(
                                      "en-IN",
                                    )}
                                  </small>
                                </p>
                                <p>
                                  <strong>
                                    {roomCount} Room
                                    {roomCount > 1 ? "s" : ""}
                                  </strong>
                                </p>
                                <p>
                                  {room.WithTransfers
                                    ? "Transfer Included"
                                    : "No Transfer"}
                                </p>
                                <button
                                  className="btn btn-primary mt-3"
                                  onClick={() => selectRoom(room)}
                                >
                                  Book Now
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    },
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="modal-backdrop fade show" onClick={handleClose}></div>
        </>
      )}
    </div>
  );
};
