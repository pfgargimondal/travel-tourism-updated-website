import { useEffect, useState } from "react";
import http from "../../http";
import "./ServiceCategories.css";
import Loader from "../Loader/Loader";
import { useLocation } from "react-router-dom";

export const ServiceCategories = ({ start, end, setResHomeFlightSearchToggle, setResHotelSearchToggle }) => {
  const [serviceimageUrl, setserviceImageUrl] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  

  useEffect(() => {
    const fetchHomeData = async () => {
      setLoading(true);

      try {
        const response = await http.get("/get-service-category");

        if (response.data.success) {
          setserviceImageUrl(response.data.data.service_image_url);
          setCategories(response.data.data.categories);
        } else {
          console.error(response.data.message);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  if (loading) {
    return <Loader />;
  }


  const displayCategories =
    start !== undefined || end !== undefined
    ? categories.slice(start ?? 0, end ?? categories.length)
    : categories;


  const resHomeFlightSearchHandler = (category) => {
    if (category === "Flights") {
      setResHomeFlightSearchToggle(prev => !prev);
    }
  };

  const resResHotelSearchHandler = (category) => {
    if (category === "Hotels") {
      setResHotelSearchToggle(prev => !prev);
    }
  };


  const resFilterOptionsCallHandler = (item) =>{
    if (location.pathname === "/") {
      resHomeFlightSearchHandler(item.category);

      if (item.category === "Hotels" && window.innerWidth <= 991) {
        window.location.href = "/hotels";
      }
    } else if (location.pathname === "/hotels") {
      resResHotelSearchHandler(item.category);

      if (item.category === "Flights" && window.innerWidth <= 991) {
        window.location.href = "/"
      }
    }
  }

    

  return (
    <div className="flight-menu-wrapper gjhkdfgdf service-categories-wrapper">
      <div className="flight-menu-bar">
        {displayCategories.map((item, index) => (
          <div
            key={index}
            className={`flight-menu-item ${
              location.pathname === "/"
                ? item.slug === "flights"
                  ? "active"
                  : ""
                : location.pathname.startsWith(`/${item.slug}`)
                ? "active"
                : ""
            }`}
            // onClick={() => navigate(`/${item.slug}`)}
            onClick={() => {
              if (item.slug === "hotels") {
                if (window.innerWidth > 991) {
                  window.location.href = "/hotels";
                }
              } else if (item.slug === "flights") {
                if (window.innerWidth > 991) {
                  window.location.href = "/";
                }
              } else {
                window.location.href = `/${item.slug}`;
              }

              resFilterOptionsCallHandler(item);
            }}
          >
            <img
              src={`${serviceimageUrl}/${item.category_image}`}
              alt={item.category}
            />
            <span>{item.category}</span>
          </div>
        ))}
      </div>
    </div>
  );
};