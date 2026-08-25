import { Link } from "react-router-dom";


import "./Login.css";



export const Login = ({ loginRegModal, setLoginRegModal, regModal, setRegModal }) => {
    return (
        <div>
            <div onClick={() => setLoginRegModal(false)} className={loginRegModal ? "reg-login-wrapper-backdrop position-fixed w-100 h-100 start-0 top-0 bottom-0 end-0" : "reg-login-wrapper-backdrop reg-login-wrapper-backdrop-hide position-fixed w-100 h-100 start-0 top-0 bottom-0 end-0"}></div>

            <div className={loginRegModal ? "reg-login-wrapper rounded-4 overflow-hidden" : "reg-login-wrapper reg-login-wrapper-hide rounded-4 overflow-hidden"}>
                <div className="row h-100 align-items-center">                    
                    <div className="col-lg-6 d-none d-lg-block text-white">
                        <div className="right-content">
                            <h1>
                                THE GOAL OF LIFE IS
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

                    <div className="col-lg-6 col-md-6">
                        <div className="login-box">
                            <h4 className="mb-3 text-dark text-center">Login to Your Account</h4>
                            <form>
                                <div className="mb-2">
                                    <label className="form-label text-dark"><i class="bi me-1 bi-envelope"></i> Email</label>
                                    <input type="email" className="form-control custom-input" />
                                </div>
                                <div className="mb-2">
                                    <label className="form-label text-dark"><i class="bi me-1 bi-lock"></i> Password</label>
                                    <input type="password" className="form-control custom-input" />
                                </div>
                                <div className="form-check mb-2">
                                    <input className="form-check-input" type="checkbox" />
                                    <label className="form-check-label text-dark">
                                        Remember me?
                                    </label>
                                </div>
                                <button className="btn login-btn w-100">LOGIN</button>
                            </form>
                                
                            <div className="lomsodjfkdf d-flex justify-content-between align-items-center mt-2">
                                <div className="mt-2 d-flex align-items-center djewjrokwekrewr text-dark">
                                    <p className="mb-0 small me-1 text-dark">Don't have an account?</p>

                                    <Link
                                        onClick={() => {
                                            setRegModal(true);
                                            setLoginRegModal(false)
                                        }} to="/" className="text-dark d-block fhjkljytre small">
                                        Register
                                    </Link>
                                </div>

                                <div className="mt-2">
                                    <Link to="/" className="text-dark fhjkljytre small">
                                        Forgot password?
                                    </Link>
                                </div>
                            </div>                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}