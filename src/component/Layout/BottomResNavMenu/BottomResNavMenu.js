import { Link } from "react-router-dom";

import "./BottomResNavMenu.css";



export const BottomResNavMenu = ({ isLoggedIn, setLoginRegModal }) => {  



  return (
    <div className="bottom-res-nav-menu d-flex align-items-center justify-content-center bg-white position-fixed bottom-0 start-0 end-0">
      <div className="res-nav-menus">
        <Link to="/">
          <i className="bi mb-1 bi-house-door-fill"></i>

          <span>Home</span>
        </Link>
      </div>

      <div className="res-nav-menus">
        <Link to="/user-booking">
          <i className="bi mb-1 bi-backpack2-fill"></i>

          <span>My Trips</span>
        </Link>        
      </div>

      <div className="res-nav-menus bg-white">
        <Link to="">
          <div className="dweiojrwerwer mx-auto position-relative rounded-circle">
            <i className="bi mb-1 bi-search-heart-fill top-50 start-50 position-absolute"></i>
          </div>
        </Link>

        <img src="./images/logomini.png" className="img-fluid" alt="" />
      </div>

      <div className="res-nav-menus">
        <Link to={isLoggedIn ? "/user-profile" : ""} onClick={() => !isLoggedIn && setLoginRegModal(prev => !prev)}>
          <i className="bi mb-1 bi-person-fill"></i>
        
          <span>Profile</span>
        </Link>
      </div>

      <div className="res-nav-menus">
        <Link to="/wishlist">
          <div className="diweurwer position-relative">
            <i className="bi mb-1 bi-bag-heart-fill"></i>

            <span className="position-absolute rounded-circle text-white">1</span>
          </div>

          <span>Wishlist</span>
        </Link>
      </div>
    </div>
  )
}