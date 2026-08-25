import { Routes, Route } from "react-router-dom";

import {
  Home,
  ContactUs,
  AboutUs,
  Blog,
  BlogDetails,
  Hotel,
  HotelFilter,
  HotelDetails,
  FlightFilter,
  FlightDetails,
  FlightPayment,
  PrivacyPolicy,
  TermsCondition,
  CustomerService,
  ReturnPolicy,
  ThankYou,
  UserProfile,
  UserAccountSettings,
  PasswordChange,
  UserBooking,
  UserWishlist,
  HotelBooking,
  HotelPayment,
  BusFilter,
  Visa
} from "../pages";

// function PageRenderer() {
//   const location = useLocation();

//   return <ServiceFilterPage key={location.pathname} />;
// }

function Allroutes() {

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about-us" element={<AboutUs />} />
      <Route path="/contact-us" element={<ContactUs />} />
      <Route path="/blogs" element={<Blog />} />
      <Route path="/blog/:slug" element={<BlogDetails />} />

      <Route path="/hotels" element={<Hotel />} />
      <Route path="/hotel-filter" element={<HotelFilter />} />      
      <Route path="/hotel-details/:slug" element={<HotelDetails />} />
      <Route path="/hotel-booking" element={<HotelBooking />} />
      <Route path="/hotel-payment" element={<HotelPayment />} />

      <Route path="/flight-filter" element={<FlightFilter />} />
      <Route path="/flight-details/:flightId" element={<FlightDetails />} />
      <Route path="/flight-payment/:fareId" element={<FlightPayment />}/>

      <Route path="/bus-filter" element={<BusFilter />} />

      <Route path="/visa" element={<Visa />} />

      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms-&-conditions" element={<TermsCondition />} />
      <Route path="/customer-service" element={<CustomerService />} />
      <Route path="/return-policy" element={<ReturnPolicy />} />

      <Route path="/thank-you" element={<ThankYou />} />

      <Route path="/user-profile" element={<UserProfile />} />
      <Route path="/account-information" element={<UserAccountSettings />} />
      <Route path="/user-booking" element={<UserBooking />} />
      <Route path="/wishlist" element={<UserWishlist />} />
      <Route path="/change-password" element={<PasswordChange />} />
 
      {/* <Route
        path="/:slug"
        element={<PageRenderer />}
      /> */}
    </Routes>
  );
}

export default Allroutes;