import { useEffect, useState } from "react";
import { FollowUsInstagram } from "../../component/FollowUsInstagram/FollowUsInstagram";
import "./Blog.css";
import http from "../../http";
export const Blog = () => {

const [activeIndex, setActiveIndex] = useState(0);

    const [loading, setLoading] = useState(false);
    const [blogDetails, setBlogDetails] = useState([]);
    const [blogCategory, setBlogCategory] = useState([]);
    const [imageBaseUrl, setImageBaseUrl] = useState("");

    const [banner, setBanner] = useState({});
    const [bannerUrl, setBannerUrl] = useState("");

    const [activeTab, setActiveTab] = useState("popular");
    const [recentBlogs, setRecentBlogs] = useState([]);
    const [popularBlogs, setPopularBlogs] = useState([]);

    useEffect(() => {
    const fetchBlogData = async () => {
        setLoading(true);
        try {
            const res = await http.get("/get-blog-content");

            //console.log("API Response:", res.data); 

            setBlogDetails(res.data.data);
            setBlogCategory(res.data.category);
            setImageBaseUrl(res.data.image_url);

            setRecentBlogs(res.data.recent_blogs);
            setPopularBlogs(res.data.popular_blogs);
            
            } catch (error) {
                console.error("Error fetching blogs:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogData();
    }, []);

    useEffect(() => {
      const fetchBanner = async () => {
        try {
          const res = await http.get("/get-blog-banner");

          console.log("Banner API:", res.data);

          setBanner(res.data.data); 
          setBannerUrl(res.data.image_url);
        } catch (error) {
          console.error("Error fetching banner:", error);
        }
      };

      fetchBanner();
    }, []);


  return (
    <div>
      <section className="hero-sections" style={{
          background: `url(${bannerUrl}/${banner?.banner_image}) center center / cover no-repeat`
        }}>
        <div className="container text-center hero-content">
          <h1 className="hero-title">{banner?.title}</h1>

          <p
            className="hero-description"
            dangerouslySetInnerHTML={{
              __html: banner?.description || "",
            }}
          />
        </div>
      </section>

      <div className="container my-5">
        <div className="row">
          <div className="col-lg-8">
            <div className="row">
              {loading ? (
                <p>Loading...</p>
              ) : (
                blogDetails.map((blog, index) => (
                  <div className="col-md-6" key={index}>
                    <div className="blog-card">

                      <img
                        src={`${imageBaseUrl}/${blog.blog_image}`}
                        className="img-fluid"
                        alt={blog.title}
                      />

                      <div className="blog-content">
                        <div className="meta">

                          <span>
                            {new Date(blog.created_at).toDateString()}
                          </span>

                          <span className="badge bg-light text-success">
                            {blog.category_name}
                          </span>

                        </div>

                        <h5>{blog.title}</h5>

                        <p>{blog.short_description}</p>

                        <a href={`/blog/${blog.slug}`} className="read-btn">
                          Read More →
                        </a>

                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="col-lg-4">
            <div className="sidebar">

              <div className="sidebar-box">
                <h6 className="mb-3">Search Here</h6>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search Your Keyword Here"
                  />
                  <button className="btn btn-tour">Search Now</button>
                </div>
              </div>

              <div className="category-box mt-4 mb-2">
                <h6 className="mb-3">All Categories</h6>
                <ul className="list-group">
                  <li className="list-group-item active btn-tour">All</li>

                  {blogCategory.map((cat) => (
                    <li
                      key={cat.id}
                      className={`list-group-item btn-tour ${activeIndex === cat.id ? "active" : ""}`}
                      onClick={() => setActiveIndex(cat.id)}
                      style={{ cursor: "pointer" }}
                    >
                      {cat.blog_category}
                    </li>
                  ))}

                </ul>
              </div>
              
              <div className="sidebar-box1 mt-3">

                  {/* Toggle Buttons */}
                  <div className="d-flex mb-3">
                    <button
                      className={`btn ${activeTab === "popular" ? "btn-tour btn-active" : "btn"} me-2`}
                      onClick={() => setActiveTab("popular")}
                    >
                      Popular
                    </button>

                    <button
                      className={`btn ${activeTab === "recent" ? "btn-tour btn-active" : "btn"}`}
                      onClick={() => setActiveTab("recent")}
                    >
                      Recent
                    </button>
                  </div>

                  {/*  Blog List */}
                  {(activeTab === "popular" ? popularBlogs : recentBlogs).map((blog) => (
                    <div className="mini-post" key={blog.id}>
                      
                      <img
                        src={`${imageBaseUrl}/${blog.blog_image}`}
                        alt={blog.title}
                      />

                      <div>
                        <a href={`/blog/${blog.slug}`}>
                         <h6>{blog.title}</h6>
                        </a>
                        <small className="ggd55">
                          {new Date(blog.created_at).toDateString()}
                        </small>
                      </div>

                    </div>
                  ))}

                </div>
            </div>
          </div>
        </div>
      </div>

      {/* <section className="journey-section">
        <div className="container">
          <div className="section-heading">
            <span className="sub-title">About Travel Agency</span>
            <h2>
              Our Journey Memorable <br /> Adventures Worldwide
            </h2>
          </div>

          <div className="journey-grid">
            <div className="left-card">
              <img src="images/inspire1.png" alt="" />

              <div className="card-cont">
                <span className="tag">Inspiration</span>
                <h3>
                  Our Main Inspire Runner With Autism Graces Of Women's Running
                </h3>
                <p>
                  Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit, Sed
                  Do Eiusmod Excepteur Sint Occaecat Cupidatat Non Proident.
                </p>

                <div className="author-row">
                  <div className="author">
                    <img src="./images/author.png" alt="" />
                    <span>David Rocos</span>
                  </div>

                  <button className="btn-tour">Read More...</button>
                </div>
              </div>
            </div>

            <div className="right-cards">
              <div className="ins-card">
                <img src="images/inspire2.png" alt="" />
                <span className="tag">Inspiration</span>
                <h4>Our Main Inspire Runner With Autism Graces Of</h4>
              </div>

              <div className="ins-card">
                <img src="images/inspire3.png" alt="" />
                <span className="tag">Inspiration</span>
                <h4>Our Main Inspire Runner With Autism Graces Of</h4>
              </div>

              <div className="ins-card">
                <img src="images/inspire4.png" alt="" />
                <span className="tag">Inspiration</span>
                <h4>Our Main Inspire Runner With Autism Graces Of</h4>
              </div>

              <div className="ins-card">
                <img src="images/inspire5.png" alt="" />
                <span className="tag">Inspiration</span>
                <h4>Our Main Inspire Runner With Autism Graces Of</h4>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      <FollowUsInstagram />
    </div>
  );
};
