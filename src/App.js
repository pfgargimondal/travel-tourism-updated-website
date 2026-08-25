import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';


import { Footer, Header } from './component';


import Allroutes from './routes/Allroutes';
import AOS from "aos";

import "aos/dist/aos.css";


import './App.css';



function App() {
  const [headerNew, setHeaderNew] = useState(false);
  const [headerBlackText, setHeaderBlackText] = useState(false);
  const [headerStickyShow, setHeaderStickyShow] = useState(false);
  
  const pathName = useLocation().pathname;  

  useEffect(() => {
    const isHeaderNewIncluded = ["/thank-you", "/user-profile", "/account-information", "/user-booking", "/change-password", "/wishlist"].some(path => pathName.includes(path));
    const isHeaderBlackTextIncluded = ["/hotel-booking", "/hotel-payment", "/hotel-details", "/flight-details", "/flight-payment"].some(path => pathName.includes(path));
    const isHeaderStickyIncluded = ["/flight-filter", "/hotel-filter"].some(path => pathName.includes(path));

    isHeaderNewIncluded ? setHeaderNew(true) : setHeaderNew(false);
    isHeaderBlackTextIncluded ? setHeaderBlackText(true) : setHeaderBlackText(false);
    isHeaderStickyIncluded ? setHeaderStickyShow(true) : setHeaderStickyShow(false);
  }, [pathName]);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);



  return (
    <div className="App">
      <Header headerNew={headerNew} headerBlackText={headerBlackText} headerStickyShow={headerStickyShow} />  
        {/* <div className="middle-wrapper"> */}
        
        <main className={ headerNew ? `mt-0 ${headerStickyShow ? "header-sticky-show-filter-wrapper" : ""}` : `${headerStickyShow ? "header-sticky-show-filter-wrapper" : ""}` }>
          <Allroutes/>
        </main>

        {/* </div>       */}
        <Footer/>
    </div>
  );
}

export default App;
