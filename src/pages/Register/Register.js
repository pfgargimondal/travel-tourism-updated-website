import { Link } from "react-router-dom";


import "./Register.css";



export const Register = ({ loginRegModal, setLoginRegModal, regModal, setRegModal }) => {
  return (
    <div>
        <div onClick={() => setRegModal(false)} className={regModal ? "reg-login-wrapper-backdrop position-fixed w-100 h-100 start-0 top-0 bottom-0 end-0" : "reg-login-wrapper-backdrop reg-login-wrapper-backdrop-hide position-fixed w-100 h-100 start-0 top-0 bottom-0 end-0"}></div>

        <div className={regModal ? "reg-login-wrapper rounded-4 overflow-hidden" : "reg-login-wrapper rounded-4 overflow-hidden reg-login-wrapper-hide"}>
            <div className="row h-100 align-items-center">     
                <div className="col-lg-6 col-md-6">
                    <div className="login-box">
                        <h4 className="mb-3 text-dark text-center">Register New Account</h4>
                        <form>
                            <div className="mb-2">
                                <label className="form-label text-dark"><i class="bi me-1 bi-person"></i> Full Name</label>
                                <input type="email" className="form-control custom-input" />
                            </div>

                            <div className="mb-2">
                                <label className="form-label text-dark"><i class="bi me-1 bi-envelope"></i> Email Address</label>
                                <input type="email" className="form-control custom-input" />
                            </div>

                            <div className="mb-2">
                                <label className="form-label text-dark"><i class="bi me-1 bi-telephone"></i> Phone Number</label>
                                <input type="number" className="form-control custom-input" />
                            </div>

                            <div className="mb-2">
                                <label className="form-label text-dark"><i class="bi me-1 bi-lock"></i> Password</label>
                                <input type="password" className="form-control custom-input" />
                            </div>
                            
                            <div className="mb-2">
                                <label className="form-label text-dark"><i class="bi me-1 bi-lock"></i> Confirm Password</label>
                                <input type="password" className="form-control custom-input" />
                            </div>

                            <div className="form-check mb-2">
                                <input className="form-check-input" type="checkbox" />
                                <label className="form-check-label text-dark">
                                    Remember me?
                                </label>
                            </div>
                            <button className="btn login-btn w-100">Register</button>
                            
                            <div className="lomsodjfkdf d-flex justify-content-between align-items-center mt-2">
                                <div className="mt-2 d-flex align-items-center djewjrokwekrewr text-dark">
                                    <p className="mb-0 small me-1 text-dark">Already have an account?</p>

                                    <Link
                                        onClick={() => {
                                            setRegModal(false);
                                            setLoginRegModal(true)
                                        }} to="/" className="text-dark fhjkljytre small">
                                        Login
                                    </Link>
                                </div>

                                <div className="mt-2">
                                    <Link to="/" className="text-dark fhjkljytre small">
                                        Forgot Password?
                                    </Link>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="col-lg-6 d-none d-lg-block text-white">
                    <div className="right-content">
                        <h1>
                            THE GOAL OF LIFE IS
                            <br /> LIVING IN AGREEMENT
                            <br /> WITH NATURE.
                        </h1>
                        <div className="dfnjhdf" />
                        <div className="social-icons mt-4">
                            <i className="fab fa-facebook-f" />
                            <i className="fab fa-instagram" />
                            <i className="fab fa-linkedin-in" />
                            <i className="fab fa-twitter" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}
