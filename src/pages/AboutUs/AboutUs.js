import { useEffect, useState } from "react";
import "./AboutUs.css";
import http from "../../http";
import Loader from "../../component/Loader/Loader";
import { FollowUsInstagram } from "../../component/FollowUsInstagram/FollowUsInstagram";
import { Testimonial } from "../Testimonial/Testimonial";
import { Faq } from "../../component/Faq/Faq";
export const AboutUs = () => {
    const [loading, setLoading] = useState(false);
    const [aboutUsDetails, setAboutUsDetails] = useState({});

    useEffect(() => {
        const fetchAboutUsData = async () => {
            setLoading(true);
        try {
            const getresponse = await http.get("/get-about-us-content");
            setAboutUsDetails(getresponse.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
        };

        fetchAboutUsData();
    }, []);



    return (
      <div>
         {loading && <Loader/>}
        <section className="hero-sectionv" style={{
            background: `url(${aboutUsDetails.image_url}/${aboutUsDetails.data?.banner_image}) center center/cover no-repeat`
          }}>
        
            <div className="container text-center hero-content">
                <h1 className="hero-title">{aboutUsDetails.data?.banner_title}</h1>
                <div className="hero-description"
                    dangerouslySetInnerHTML={{
                    __html: aboutUsDetails.data?.first_section_description && (aboutUsDetails.data.first_section_description),
                    }}
                />
            </div>
        </section>

        <section className="section bg-white mt-5">
            <div className="container">
                <div className="row dhbxdfgsdfsdf align-items-center g-5">
                    <div className="col-lg-6 sbdbdzfsdf">
                        <div className="diamijfsdfsd position-relative">
                            <div className="about-img">
                                <img alt="" src={`${aboutUsDetails.image_url}/${aboutUsDetails.data?.image_one}`} className="img-fluid"/>
                            </div>
                            <div className="badge-discount">
                                <img src={`${aboutUsDetails.image_url}/${aboutUsDetails.data?.image_two}`}  alt=""/>
                            </div>
                            <div className="stat-box">
                                <span className="zero_plus" style={{ color: "var(--main-green-color)" }}>{aboutUsDetails.data?.second_stat_number}+</span>
                                <small>{aboutUsDetails.data?.second_section_stat_text}</small>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <small className="diewiiwejijiwe" style={{ color: "var(--main-green-color)", fontWeight: 600 }}>{aboutUsDetails.data?.second_section_heading}</small>
                        <h2 className="fw-bold diewiiwejijiwe mt-2" style={{ fontSize: "34px", lineHeight: "1.3" }}>{aboutUsDetails.data?.second_section_title}</h2>
                        <div className="text-muted"
                            dangerouslySetInnerHTML={{
                            __html: aboutUsDetails.data?.second_section_description && (aboutUsDetails.data.second_section_description),
                            }}
                        />
                        <div className="d-flex align-items-start mt-4">
                            <div className="feature-icon">
                                <img src={`${aboutUsDetails.image_url}/${aboutUsDetails.data?.seccod_section_logo_one}`} alt=""/>
                            </div>
                            <div>
                                <h6 className="fw-bold">{aboutUsDetails.data?.seccod_section_title_one}</h6>
                                <p className="text-muted small">{aboutUsDetails.data?.seccod_section_descrition_one}</p>
                            </div>
                        </div>
                        <div className="d-flex align-items-start mt-3">
                            <div className="feature-icon">
                                <img src={`${aboutUsDetails.image_url}/${aboutUsDetails.data?.seccod_section_logo_two}`} alt=""/>
                            </div>
                            <div>
                                <h6 className="fw-bold">{aboutUsDetails.data?.seccod_section_title_two}</h6>
                                <p className="text-muted small">{aboutUsDetails.data?.seccod_section_descrition_two}</p>
                            </div>
                        </div>
                        
                        <div className="uhdnhiuew">
                            <a href="/" className="btn btn-teal mt-4">More About Travel <div className="arrow_journey"> → </div> </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section className="section mt-5">
            <div className="container">
                <div className="promo row align-items-center">
                    <div className="col-lg-6 left">
                        {/* <h3>Grab up to <span style={{ color: "var(--main-green-color)" }}>35% off</span><br/>on your favorite
                            Destination</h3> */}
                        <h3>{aboutUsDetails.data?.third_section_heading}</h3>
                        <p className="text-muted">{aboutUsDetails.data?.third_section_title}</p>
                        <a href="/" className="btn btn-teal mt-3">Book Now</a>
                    </div>
                    <div className="col-lg-6">
                        <img alt="" src={`${aboutUsDetails.image_url}/${aboutUsDetails.data?.seccod_section_image}`} className="img-fluid grab_up_img"/>
                    </div>
                </div>
            </div>
        </section>
        <section className="popular mt-5">
            <div className="container">
                <div className="row">
                    <div className="col-lg-7 col-sm-7 col-12">
                        <div className="row">
                            <div className="col-lg-6 col-6 jcnsuihnuhsdd" style={{ height: "460px" }}>
                                <div className="grid-item cruises">
                                    <img alt="" src={`${aboutUsDetails.image_url}/${aboutUsDetails.data?.fourth_section_image_1}`}/>
                                    <div className="overlay"></div>
                                    <div className="label">{aboutUsDetails.data?.fourth_section_title_1}</div>
                                </div>
                                <div className="grid-item museum">
                                    <img alt="" src={`${aboutUsDetails.image_url}/${aboutUsDetails.data?.fourth_section_image_2}`}/>
                                    <div className="overlay"></div>
                                    <div className="label">{aboutUsDetails.data?.fourth_section_title_2}</div>
                                </div>

                            </div>

                            <div className="col-lg-6 col-6 jcnsuihnuhsdd iucfjsdijfsdf" style={{ height: "460px"}}>
                                <div className="grid-item beach">
                                    <img alt="" src={`${aboutUsDetails.image_url}/${aboutUsDetails.data?.fourth_section_image_3}`}/>
                                    <div className="overlay"></div>
                                    <div className="label">{aboutUsDetails.data?.fourth_section_title_3}</div>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="col-lg-5 col-sm-5 col-12 right-grid jcnsuihnuhsdd" style={{ height: "438px"}}>
                        <div className="grid-item city">
                            <img alt="" src={`${aboutUsDetails.image_url}/${aboutUsDetails.data?.fourth_section_image_4}`}/>
                            <div className="overlay"></div>
                            <div className="label">{aboutUsDetails.data?.fourth_section_title_4}</div>
                        </div>

                        <div className="row">
                            <div className="col-lg-6 col-6">
                                <div className="grid-item food">
                                    <img alt="" src={`${aboutUsDetails.image_url}/${aboutUsDetails.data?.fourth_section_image_5}`}/>
                                    <div className="overlay"></div>
                                    <div className="label">{aboutUsDetails.data?.fourth_section_title_5}</div>
                                </div>
                            </div>

                            <div className="col-lg-6 col-6">
                                <div className="grid-item hiking">
                                    <img alt="" src={`${aboutUsDetails.image_url}/${aboutUsDetails.data?.fourth_section_image_6}`}/>
                                    <div className="overlay"></div>
                                    <div className="label">{aboutUsDetails.data?.fourth_section_title_6}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section className="section-wrapper">
            <div className="container">
                <div className="row align-items-start">

                    <div className="col-lg-5">
                        <div className="left-heading mb-4">
                            {/* <h5>
                                Trusted Solution Of Your <br/>
                                <span>Tourism Services</span>
                            </h5> */}
                            {aboutUsDetails.data?.fifth_section_heading}
                        </div>

                        <div className="feature-card vip">
                            <div className="icon-box">
                                <i className="bi bi-bag-check"></i>
                            </div>
                            <div>
                                <h6>{aboutUsDetails.data?.fifth_section_title_one}</h6>
                                <p>{aboutUsDetails.data?.fifth_section_descrition_one}</p>
                            </div>
                        </div>

                        <div className="feature-card travel">
                            <div className="icon-box">
                                <i className="bi bi-airplane"></i>
                            </div>
                            <div>
                                <h6>{aboutUsDetails.data?.fifth_section_title_two}</h6>
                                <p>{aboutUsDetails.data?.fifth_section_descrition_two}</p>
                            </div>
                        </div>

                        <div className="feature-card price">
                            <div className="icon-box">
                                <i className="bi bi-geo-alt"></i>
                            </div>
                            <div>
                                <h6>{aboutUsDetails.data?.fifth_section_title_three}</h6>
                                <p>{aboutUsDetails.data?.fifth_section_descrition_three}</p>
                            </div>
                        </div>

                    </div> 

                    <div className="col-lg-7">
                        <span className="badge-custom">{aboutUsDetails.data?.faq_heading}</span>
                        <h3 className="right-title">{aboutUsDetails.data?.faq_title}</h3>

                        <Faq />
                    </div>
                </div>
            </div>
        </section>

        {/* <section className="testimonial mt-5" style={{
                background: "url('/images/testimonial_bg.png') center / cover no-repeat"
            }}>
            <div className="container contentrgdfg">
                <div className="row align-items-center">
                    <div className="col-lg-5 text-start">
                        <div className="subtitle">Our Testimonials</div>
                        <h2>Good Reviews By <span style={{ color: "#19a7a0"}}>Clients</span></h2>
                        <p className="mt-3" style={{ color: "#ccc"}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do
                            eiusmod tempor incididunt ut labore.</p>
                    </div>
                    <div className="col-lg-7">
                        <div className="quote">
                            <img src="./images/quote_icon.png" alt=""/>
                            <i> Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum a
                                simple lorem ipsum has been the industry's standard dummy text ever since. </i>
                        </div>
                        <div className="client">
                            <div className="img">
                                <img src="./images/Manager.png" alt=""/>
                            </div>
                            <div className="text">
                                Kelvin Mick<br/><small style={{ color: "#bbb"}}>Manager</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section> */}

        <Testimonial/>

        <section className="section text-center mt-5 mb-5">
            <div className="container">
                <h5 style={{ color: "#dda927"}}>Top Deals</h5>
                <h2 className="fw-bold mb-0">The Last <span style={{ color: "var(--main-green-color)" }}>Minute Deals</span></h2>
                <p className="mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do
                    eiusmod tempor incididunt ut labore.</p>
                <div className="row g-4">
                    <div className="col-lg-4 col-sm-6 col-12">
                        <div className="card deal-card">
                            <img alt="" src="./images/LMD_norway.png"/>
                            <div className="card-body text-start cardtext">
                                <h5> <span style={{ color: "#dda927", fontFamily: "'Playfair Display', sans-serif" }}> Norway
                                    </span></h5>
                                <h4> <span style={{ color: "#e6e6e6", fontFamily: "'Playfair Display', sans-serif" }}> Norway Lake
                                    </span></h4>
                                <div className="stars mt-2 mb-2"> ⭐⭐⭐⭐⭐ <span style={{ color: "#fff" }}>(16)</span></div>
                                <div className="price">$180.00 <span
                                        style={{ color: "#c0c0c0", fontSize: "medium", fontWeight: 400 }}>| per person </span>
                                    <span style={{ marginLeft: "30px", color: "#bbb" }}>6 Days Tours</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 col-sm-6 col-12">
                        <div className="card deal-card"><img alt="" src="./images/LMD_usa.png"/>
                            <div className="card-body text-start cardtext">
                                <h5> <span style={{ color: "#dda927", fontFamily: "'Playfair Display', sans-serif" }}>USA </span>
                                </h5>
                                <h4> <span style={{ color: "#e6e6e6", fontFamily: "'Playfair Display', sans-serif" }}>New York City
                                    </span></h4>
                                <div className="stars mt-2 mb-2"> ⭐⭐⭐⭐⭐ <span style={{ color: "#fff" }}>(12)</span></div>
                                <div className="price">$140.00 <span
                                        style={{ color: "#c0c0c0", fontSize: "medium", fontWeight: 400 }}>| per person </span>
                                    <span style={{ marginLeft: "30px", color: "#bbb" }}>5 Days Tours</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 col-sm-6 col-12">
                        <div className="card deal-card">
                            <img alt="" src="./images/LMD_maldives.png"/>
                            <div className="card-body text-start cardtext">
                                <h5><span
                                        style={{ color: "#dda927", fontFamily: "'Playfair Display', sans-serif" }}>Maldives</span>
                                </h5>
                                <h4><span style={{ color: "#e6e6e6", fontFamily: "'Playfair Display', sans-serif" }}>Malie
                                        City</span></h4>
                                <div className="stars mt-2 mb-2"> ⭐⭐⭐⭐⭐ <span style={{ color: "#fff" }}>(12)</span></div>
                                <div className="price">$140.00 <span
                                        style={{ color: "#c0c0c0", fontSize: "medium", fontWeight: 400 }}>| per person </span>
                                    <span style={{ marginLeft: "30px", color: "#bbb" }}>3 Days Tours</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <a href="/" className="btn btn-teal mt-5">View All Deals</a>
            </div>
        </section>

        <FollowUsInstagram />
      </div>
    )
}
