import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { Login, Register } from "../../pages";

import { ServiceCategories } from "../ServiceCategories/ServiceCategories";

import { BottomResNavMenu } from "../../component";

import Logo from "../../assets/images/COlgfJcjQfjCUywmAAiIwIAxQnnk1YYYP4j3NGUu.png";

import "./Header.css";
import "./HeaderResponsive.css";



export const Header = ({ headerNew, headerBlackText, headerStickyShow }) => {
    const [headerSticky, setHeaderSticky] = useState(false);
    const [loginRegModal, setLoginRegModal] = useState(false);
    const [regModal, setRegModal] = useState(false);
    const [resNavToggle, setResNavToggle] = useState(false);
    const [crrncyLangModal, setCrrncyLangModal] = useState(false);
    // eslint-disable-next-line
    const [resHomeFlightSearchToggle, setResHomeFlightSearchToggle] = useState(false);
    // eslint-disable-next-line
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const [userDropdownToggle, setUserDropdownToggle] = useState(false);


    useEffect(() => {
        const handleScroll = () => {
            setHeaderSticky(window.scrollY > 350);
        };

        window.addEventListener("scroll", handleScroll);
        handleScroll();

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);


    useEffect(() => {
        const handleClick = () => {
            setUserDropdownToggle(false);
        };

        document.addEventListener("click", handleClick);

        return () => {
            document.removeEventListener("click", handleClick);
        };
    }, []);



    return (
        <div>
            <header className={headerSticky ? 
                `bg-white w-100 header-sticky ${headerNew ? "new-header" : ""} ${headerBlackText ? "black-text-header" : ""} ${headerStickyShow ? "header-sticky-show" : ""}` : 
                `bg-transparent w-100 position-relative ${headerNew ? "new-header" : ""} ${headerBlackText ? "black-text-header" : ""} ${headerStickyShow ? "header-sticky-show" : ""}`
                }>
                <div className="top-header py-2">
                    <div className="container">
                        <div className="d-flex align-items-center justify-content-between">
                            <div className="gfhhgedfdbfgy d-none">
                                <div onClick={() => setResNavToggle(prev => !prev)} className="res-toggle-bar me-2">
                                    <i className="bi fa-2x bi-list"></i>
                                </div>
                            </div>

                            {/* Left Logo */}
                            <div className="oifkepomtkret d-flex align-items-center">
                                <Link to="/">
                                    <img
                                        src={Logo}
                                        alt="logo"
                                        style={{ height: "28px" }}
                                    />
                                </Link>
                            </div>

                            {/* Middle Menu */}
                            <div className="sifjdnosjkjhjmre d-flex align-items-center header-menu">
                                {!(headerSticky || headerStickyShow) && (
                                    <div className="asdoijodjokpkoie d-flex align-items-center gap-2">
                                        <span className="icon-circle">🏠</span>
                                        <div>
                                            <div className="fw-semibold dfgsfadeae small">List Your Property</div>
                                            <small className="text-white">Grow your business!</small>
                                        </div>
                                    </div>
                                )}                            

                                {/* <div className="asdoijodjokpkoie d-flex align-items-center gap-2">
                                    <img src="./images/sadserwq.png" width={55} alt="" />
                                    <div>
                                        <div className="fw-semibold small">Introducing myBiz</div>
                                        <small className="text-white">Business Travel Solution</small>
                                    </div>
                                </div> */}
                                
                                <div className="doijeoijwer d-none align-items-center">
                                    <ServiceCategories start={0} end={6} setResHomeFlightSearchToggle={setResHomeFlightSearchToggle} />

                                    <div className="diejijewmrijwereor position-relative">
                                        <div class="asddhedsfeedee flight-menu-item">
                                            <i class="bi bi-three-dots"></i>
                                            
                                            <span className="d-flex svdgddfseerhthty justify-content-center align-items-center">More <i class="bi ms-1 bi-chevron-down"></i></span>
                                        </div>

                                        <div className="hdr-sticky-drpdwn bg-white">
                                            <ServiceCategories start={6} />
                                        </div>
                                    </div>
                                </div>



                                <div className="asdoijodjokpkoie d-flex align-items-center gap-2">
                                    <div className="diwejojiwerer rounded-circle position-relative">
                                        <img src="./images/heart.png" className="position-absolute top-50 start-50 translate-middle" width={18} alt="" />
                                    </div>

                                    <div>
                                        <div className="fw-semibold dfgsfadeae small">Wishlist</div>
                                        <small className="text-white">Save favourites</small>
                                    </div>
                                </div>

                                {!(headerSticky || headerStickyShow) && (
                                    <div className="asdoijodjokpkoie d-flex align-items-center gap-2">
                                        <div className="diwejojiwerer rounded-circle position-relative">
                                            <img src="./images/sdeqw.png" className="position-absolute top-50 start-50 translate-middle" width={15} alt="" />
                                        </div>

                                        <div>
                                            <div className="fw-semibold dfgsfadeae small">My Trips</div>
                                            <small className="text-white">Manage your bookings</small>
                                        </div>
                                    </div>
                                )}                            

                                {/* Right Section */}
                                <div className="asdoijodjokpkoie d-flex align-items-center gap-2">
                                    <button onClick={() => !isLoggedIn && setLoginRegModal(prev => !prev)} className={`${isLoggedIn ? "loggedin-user-profile position-relative" : ""} fsdgsadehtrfdewe btn btn-tour px-3`}>
                                        {isLoggedIn ? (
                                            <span>
                                                <span className="dinniihfrtet d-flex align-items-center gap-1" onClick={(e) => {e.stopPropagation(); setUserDropdownToggle(prev => !prev)}}>
                                                    <i className="bi bi-person-fill"></i>
                                                    
                                                    <span className="d-inline-block">Virat Kohli</span>
                                                    
                                                    <i className="bi ms-1 bi-chevron-down"></i>
                                                </span>

                                                <div className={`${userDropdownToggle ? "loggedin-dropdown" : "loggedin-dropdown loggedin-dropdown-hide"} position-absolute bg-white p-2 text-start rounded-2`}>
                                                    <ul className="mb-0 ps-0">
                                                        <li>
                                                            <Link to="/user-profile"><i className="bi me-1 bi-person-lines-fill"></i> My Profile</Link>
                                                        </li>

                                                        <li>
                                                            <Link to=""><i className="bi me-1 bi-person-fill-gear"></i> Profile Settings</Link>
                                                        </li>

                                                        <li>
                                                            <Link to=""><i className="bi me-1 bi-person-fill-lock"></i> Password Change</Link>
                                                        </li>

                                                        <li><i className="bi me-1 bi-door-closed-fill"></i> Log Out</li>
                                                    </ul>
                                                </div>
                                            </span>
                                        )
                                         : (
                                            <span>Login or Create Account <i className="bi ms-1 bi-chevron-down"></i></span>
                                        )}
                                    </button>

                                    <div onClick={() => setCrrncyLangModal(prev => !prev)} className="sfsdghdcsdfrrerttr d-flex align-items-center gap-2 rounded-1 p-2 position-relative">
                                        <img src="./images/india.png" width={22} alt="" /> <span>INR</span>

                                        <span>|</span>

                                        <span>English <i class="bi ms-1 bi-chevron-down"></i></span>
                                    </div>
                                </div>
                            </div>

                            <div className="cjaoksdwrrr d-none">
                                <div className="asdoijodjokpkoie d-flex align-items-center">
                                    <div className="diwejojiwerer rounded-circle position-relative">
                                        <img src="./images/heart.png" className="position-absolute top-50 start-50 translate-middle" width={18} alt="" />
                                    </div>

                                    {isLoggedIn ? (
                                        <div className="loggedin-dropdown-wrapper position-relative">
                                            <button onClick={() => setResNavToggle(prev => !prev)} className="fsdgsadehtrfdewe px-1 btn text-white">
                                                <i className="bi bi-person-fill"></i>

                                                <span>Virat Kohli</span>

                                                <i className="bi ms-1 bi-chevron-down"></i>
                                            </button>                                            
                                        </div>
                                    ) : (
                                        <button onClick={() => setLoginRegModal(prev => !prev)} className="fsdgsadehtrfdewe res-loggedout-dropdown-icon px-1 btn gap-0 text-white">
                                            <i className="bi bi-person"></i> <i className="bi bi-chevron-down"></i>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>


            <div onClick={() => setResNavToggle(false)} className={resNavToggle ? "res-nav-menu-backdrop d-none position-fixed w-100 h-100 start-0 end-0 bottom-0 top-0" : "res-nav-menu-backdrop res-nav-menu-backdrop-hide d-none position-fixed w-100 h-100 start-0 end-0 bottom-0 top-0"}></div>

            <div className={resNavToggle ? "res-nav-menu d-none bg-white position-fixed h-100 top-0 bottom-0 p-3" : "res-nav-menu res-nav-menu-hide d-none bg-white position-fixed h-100 top-0 bottom-0 p-4"}>
                <div className="diuewjoirwerwer">
                    {/* <div className="text-end">
                        <i onClick={() => setResNavToggle(false)} className="bi bi-x-lg"></i>
                    </div> */}

                    {isLoggedIn ? (
                        <div className="res-nav-user d-flex align-items-center justify-content-between mb-3 pb-2">
                            <p className="mb-0"><b>Hi, Virat Kohli</b></p>

                            <p className="mb-0">Logout</p>
                        </div>
                    ) : (
                        <button onClick={() => setLoginRegModal(prev => !prev)} className="w-100 fsdgsadehtrfdewe btn btn-tour px-3 mb-3">
                            Login or Create Account <i class="bi ms-1 bi-chevron-down"></i>
                        </button>
                    )}
                    

                    <div className="asdoijodjokpkoie d-flex align-items-center justify-content-between gap-2 mb-3 px-3 py-2">
                        <div className="d-flex align-items-center">
                            <div className="diwejojiwerer rounded-circle position-relative">
                                <img src="./images/heart.png" className="position-absolute top-50 start-50 translate-middle" width={18} alt="" />
                            </div>

                            <div>
                                <div className="fw-semibold dfgsfadeae small">Wishlist</div>
                                <small className="">Save favourites</small>
                            </div>
                        </div>

                        <i class="bi bi-chevron-right"></i>
                    </div>

                    <div className="gfhhgedfdbfgy d-flex align-items-center justify-content-between p-3">
                        <div className="sfsdghdcsdfrrerttr d-flex align-items-center gap-2 rounded-1">
                            <img src="./images/india.png" width={22} alt="" /> <span>INR</span>

                            <span>|</span>

                            <span>English</span>
                        </div>

                        <i class="bi bi-chevron-right"></i>
                    </div>
                </div>

                <ul className="fhgdgserbtytrr mb-0 ps-0 mt-3">
                    <li>
                        <Link to="">Popular Domestic Destinations</Link>
                    </li>

                    <li>
                        <Link to="">International Destinations</Link>
                    </li>
                </ul>
            </div>


            {/* currncy lang dropdown start */}

            <div onClick={() => setCrrncyLangModal(false)} className={crrncyLangModal ? "currncy-lang-drpdwn-backdrop d-none position-fixed w-100 h-100 start-0 end-0 bottom-0 top-0" : "currncy-lang-drpdwn currncy-lang-drpdwn-backdrop-hide d-none position-fixed w-100 h-100 start-0 end-0 bottom-0 top-0"}></div>

            <div className={crrncyLangModal ? "currncy-lang-drpdwn position-fixed top-50 start-50 translate-middle bg-white p-3 rounded-2 mt-2" : "currncy-lang-drpdwn currncy-lang-drpdwn-hide position-fixed top-50 start-50 translate-middle bg-white p-3 rounded-2 mt-2"}>
                <div onClick={() => setCrrncyLangModal(false)} className="dowenjrnhwerwer rounded-circle bg-white position-absolute">
                    <i className="bi position-absolute start-50 top-50 translate-middle bi-x"></i>
                </div>
                
                <div className="mb-3">
                    <label className="form-label">Country</label>
                
                    <select name="" className="form-select" id="">
                        <option value="India">India</option>
                    </select>
                </div>

                <div className="mb-3">
                    <label className="form-label">Currency</label>
                
                    <select name="" className="form-select" id="">
                        <option value="India">INR | Indian Rupee</option>
                    </select>
                </div>

                <div className="mb-3">
                    <label className="form-label">Language</label>
                
                    <select name="" className="form-select" id="">
                        <option value="India">ENG | English</option>
                    </select>
                </div>

                <button className="btn btn-tour w-100">APPLY</button>
            </div>

            {/* currncy lang dropdown end */}



            <Login loginRegModal={loginRegModal} setLoginRegModal={setLoginRegModal} regModal={regModal} setRegModal={setRegModal} />

            <Register loginRegModal={loginRegModal} setLoginRegModal={setLoginRegModal} regModal={regModal} setRegModal={setRegModal} />



            {(window.innerWidth <= 991) && (
                <BottomResNavMenu isLoggedIn={isLoggedIn} setLoginRegModal={setLoginRegModal} />
            )}
        </div>
    )
}

