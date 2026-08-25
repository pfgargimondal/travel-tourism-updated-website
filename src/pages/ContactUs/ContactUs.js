import { useEffect, useState } from "react";
import { FollowUsInstagram } from "../../component/FollowUsInstagram/FollowUsInstagram";
import http from "../../http";
import "./ContactUs.css";
import { ToastContainer, toast } from "react-toastify";
import Loader from "../../component/Loader/Loader";
export const ContactUs = () => {

    const [loading, setLoading] = useState(false);
    const [contactUsImage, setContactUsImage] = useState({});
    const [contactUsDetails, setContactUsDetails] = useState({});

    useEffect(() => {
        const fetchContactUsData = async () => {
            setLoading(true);
        try {
            const getresponse = await http.get("fetch-contact-us-details");
            setContactUsImage(getresponse.data.image_url);
            setContactUsDetails(getresponse.data.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
        };

        fetchContactUsData();
    }, []);

    const [inputs, setInputs] = useState({
        name: "",
        email: "",
        message: "",
    });
    const [errors, setErrors] = useState({});
    
    // 🔹 Handle input change
    const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
    };

    // 🔹 Validation logic
    const validateInputs = (inputs) => {
    const newErrors = {};

    if (!inputs.name.trim()) {
        newErrors.name = "Name is required";
    } else if (!/^[a-zA-Z\s]+$/.test(inputs.name)) {
        newErrors.name = "Name can only contain letters and spaces";
    }

    if (!inputs.email.trim()) {
        newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputs.email)) {
        newErrors.email = "Enter a valid email address";
    }

    if (!inputs.message.trim()) {
        newErrors.message = "Message is required";
    }

    return newErrors;
    };

    // 🔹 Form submission
    const submitForm = async (e) => {
        e.preventDefault();

        const validationErrors = validateInputs(inputs);

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});
        setLoading(true);

        try {
        const response = await http.post("/add-contuct-us-enquiry", inputs);

        if (response.data.success) {
            toast.success(response.data.message);

            setInputs({
                name: "",
                email: "",
                message: "",
            });
        }else{
            toast.error(response.data.message);
            setInputs({
                name: "",
                email: "",
                message: "",
            });
        }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

  
    return (
      <div>
        {loading && <Loader/>}
        
        <section
            className="hero-sectionz"
            style={{
                background: `url(${contactUsImage}/${contactUsDetails?.banner_image}) center center / cover no-repeat`
            }}
            >
            <div className="container text-center hero-content">
                <h1 className="hero-title">{contactUsDetails?.title}</h1>
                <div className="hero-description"
                    dangerouslySetInnerHTML={{
                    __html: contactUsDetails?.description && (contactUsDetails.description),
                    }}
                />
            </div>
        </section>


        <section className="contact-info-section py-5">
            <div className="container">
                <div className="row text-center">
                {/* Visit Us */}
                <div className="col-lg-4 mb-4">
                    <div className="contact-card">
                    <div className="icon-box">
                        <i className="fas fa-home" />
                    </div>
                    <h5>{contactUsDetails?.visit_title}</h5>
                    <p>{contactUsDetails?.visit_description}</p>
                    <span>{contactUsDetails?.visit_address}</span>
                    </div>
                </div>
                {/* Call Us */}
                <div className="col-lg-4 mb-4">
                    <div className="contact-card">
                    <div className="icon-box">
                        <i className="fas fa-phone-alt" />
                    </div>
                    <h5>{contactUsDetails?.call_title}</h5>
                    <p>{contactUsDetails?.call_description}</p>
                    <span>{contactUsDetails?.call_phone}</span>
                    </div>
                </div>
                {/* Contact Us */}
                <div className="col-lg-4 mb-4">
                    <div className="contact-card">
                    <div className="icon-box">
                        <i className="fas fa-envelope" />
                    </div>
                    <h5>Contact Us</h5>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <span>noreply@leland.com</span>
                    </div>
                </div>
                </div>
            </div>
            </section>



            <section className="contact-section py-5">
                <div className="container">
                    <div className="row align-items-center">

                        <div className="col-lg-6 text-center mb-4 mb-lg-0">
                            <div className="image-wrapper">
                                <img src={`${contactUsImage}/${contactUsDetails?.form_image}`} className="img-fluid main-img" alt="Traveler" />
                            </div>
                        </div>

                        <div className="col-lg-6">
                            <div className="contact-content">
                                <p className="contact-small">{contactUsDetails?.form_heading}</p>
                                <h2 className="contact-title">{contactUsDetails?.form_title}</h2>
                                <div className="contact-desc"
                                    dangerouslySetInnerHTML={{
                                    __html: contactUsDetails?.form_description && (contactUsDetails.form_description),
                                    }}
                                />

                                <form noValidate onSubmit={submitForm}>
                                    <div className="row mb-3">
                                        <div className="col-md-6 mb-3 mb-md-0">
                                            <label>Name :</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Enter Your name"
                                                name="name"
                                                value={inputs.name}
                                                onChange={handleChange}
                                            />
                                            <p style={{ color: "red" }}>{errors.name}</p>
                                        </div>
                                        <div className="col-md-6">
                                            <label>Email :</label>
                                            <input
                                                type="email"
                                                name="email"
                                                placeholder="E-Mail Address"
                                                value={inputs.email}
                                                onChange={handleChange}
                                                className="form-control"
                                            />
                                            <p style={{ color: "red" }}>{errors.email}</p>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <label>Message :</label>
                                        <textarea
                                            id=""
                                            placeholder="Write Message"
                                            cols={4}
                                            rows={4}
                                            className="form-control"
                                            defaultValue={""}
                                            name="message"
                                            value={inputs.message}
                                            onChange={handleChange}
                                        />
                                        <p style={{ color: "red" }}>{errors.message}</p>
                                    </div>

                                    <div className="iuejwoikoerwjer">
                                        <button type="submit" className="btn send-btn">
                                            <span>Send</span>
                                            <span className="btn-icon">
                                            <i className="fa-solid fa-arrow-right-long"></i>
                                            </span>
                                        </button>    
                                    </div>                                    
                                </form>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            <section className="map-section">
                <iframe 
                    title="Albany New York Location Map"
                    src={contactUsDetails?.map_link}
                    width="100%"
                    height="400"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    >
                </iframe>
            </section>

            <ToastContainer
                position="top-right"
                autoClose={3000}
                style={{ zIndex: 9999999999 }}
            />

            <FollowUsInstagram />
      </div>
    )
}
