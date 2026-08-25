import { Link } from "react-router-dom";


import "./PageNotFound.css";



export const PageNotFound = () => {
    return (
        <section className="not-found-page">
            <div className="container">
                <div className="content">
                    <h1 className="glitch" data-text="404">
                        404
                    </h1>

                    <h2>Oops! Page Not Found</h2>

                    <p>
                        The page you are looking for might have been removed, renamed, or
                        is temporarily unavailable.
                    </p>

                    <div className="buttons aidhasjfojer">
                        <Link to="/">
                            <button className="btn btn-tour">Back To Home</button>
                        </Link>

                        <button
                            className="go-back-btn"
                            onClick={() => window.history.back()}
                        >
                            Go Back
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}