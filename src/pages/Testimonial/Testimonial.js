import { useEffect, useState } from "react";
import Loader from "../../component/Loader/Loader";
import http from "../../http";
import { Swiper, SwiperSlide } from 'swiper/react';

import "./Testimonial.css";
import 'swiper/css';

export const Testimonial = () => {

    
    const [loading, setLoading] = useState(false);
    const [testimonialDetails, setTestimonialDetails] = useState({});

    useEffect(() => {
        const fetchTestimonialData = async () => {
            setLoading(true);
            try {
                const getresponse = await http.get("/get-testimonial-content");
                setTestimonialDetails(getresponse.data);
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTestimonialData();
    }, []);

    return (
      <div>
        {loading && <Loader/>}
        <section className="testimonial my-5" style={{
                background: `url(${testimonialDetails.image_url}/${testimonialDetails.data?.image}) center / cover no-repeat`
            }}>
            <div className="container contentrgdfg">
                <div className="row align-items-center justify-content-between">
                    <div className="col-lg-5 text-start">
                        <div className="small-heading" style={{ color: "var(--main-yellow-color)" }}>{testimonialDetails.data?.heading}</div>
                        {/* <h2>Good Reviews By <span style={{ color: "#19a7a0"}}>Clients</span></h2> */}
                        <h2 className="secondary-heading sdgzdfsdF mt-3">{testimonialDetails.data?.title}</h2>
                        <div className="bncxfbfsdfc mt-3"
                            dangerouslySetInnerHTML={{
                            __html: testimonialDetails.data?.description && (testimonialDetails.data.description),
                            }}
                        />
                    </div>

                    <div className="col-lg-6">
                        <Swiper
                            spaceBetween={50}
                            slidesPerView={1}
                            onSlideChange={() => console.log('slide change')}
                            onSwiper={(swiper) => console.log(swiper)}
                            >
                            {testimonialDetails.data?.testimonalContent.map((testimonials, index) => (
                                <SwiperSlide key={index}>
                                    <div className="okhuifgyuhj">
                                        <div className="quote">
                                            <img src="./images/quote_icon.png" alt=""/>
                                            <i> {testimonials.description} </i>
                                        </div>
                                        <div className="client">
                                            <div className="img">
                                                <img src={`${testimonialDetails.image_url}/${testimonials.image}`} alt=""/>
                                            </div>
                                            <div className="text">
                                                {testimonials.name}<br/><small style={{ color: "#bbb"}}>{testimonials.designation}</small>
                                            </div>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
            </div>
        </section>
      </div>
    )
}
