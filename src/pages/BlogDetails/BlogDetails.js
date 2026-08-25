import { FollowUsInstagram } from "../../component/FollowUsInstagram/FollowUsInstagram";
import "./BlogDetails.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import http from "../../http";

export const BlogDetails = () => {

    const { slug } = useParams();
    const [blog, setBlog] = useState(null);
    const [relatedBlogs, setRelatedBlogs] = useState([]);
    const [imageBaseUrl, setImageBaseUrl] = useState("");

    // eslint-disable-next-line
    const [banner, setBanner] = useState({});
    // eslint-disable-next-line
    const [bannerUrl, setBannerUrl] = useState("");

    useEffect(() => {
          const fetchBanner = async () => {
            try {
              const res = await http.get("/get-blog-details-banner");
    
              setBanner(res.data.data); 
              setBannerUrl(res.data.image_url);
            } catch (error) {
              console.error("Error fetching banner:", error);
            }
          };
    
          fetchBanner();
        }, []);



    useEffect(() => {
        const fetchBlogDetails = async () => {
            try {
                const res = await http.get(`/blog-details/${slug}`);

                setBlog(res.data.data);
                setRelatedBlogs(res.data.related_blogs || []);
                setImageBaseUrl(res.data.image_url);
            } catch (err) {
                console.error(err);
            }
        };

    fetchBlogDetails();
    }, [slug]);



    return (
      <div>
        {/* <section class="hero-sectionc" style={{
            background: `url(${bannerUrl}/${banner?.banner_image}) center center / cover no-repeat`
        }}>
            <div class="container text-center hero-content">

                <h1 class="hero-title">{banner?.title || ""}</h1>

                <p
                    className="hero-description"
                    dangerouslySetInnerHTML={{
                    __html: banner?.description || "",
                    }}
                />
                
            </div>
        </section> */}

        <section class="hero-sectionc gjnfrdgsas" style={{
            background: `url(${blog && blog.blog_image ? `${imageBaseUrl}/${blog.blog_image}` : "/images/default-blog.png"}) center center / cover no-repeat`
        }}>
            <div class="container gfrt text-center hero-content">
                {/* 🔥 Title */}
                <h1 className="blog-title">
                    {blog ? blog.title : ""}
                </h1>

                <div className="fnsdjhf">
                    <button className="btn-sddf">
                        <i className="fa-regular fa-calendar"></i>{" "}
                        {blog?.created_at
                            ? new Date(blog.created_at).toDateString()
                            : ""}
                        <i className="fa-solid fa-minus rotate-line"></i>{" "}
                        {blog ? blog.category_name : ""}
                    </button>
                </div>
            </div>
        </section>

        
        <section class="blog-detail">
            <div class="container ">
                <div class="row">
                    <div class="col-lg-9">
                        <div className="blog-main">
                            {/* 🔥 Description (HTML from backend) */}
                            {blog && blog.blog_description && (
                                <div
                                    dangerouslySetInnerHTML={{ __html: blog.blog_description }}
                                />
                            )}
                        </div>
                    </div>

                    {/* Related Blogs section  */}

                    <div class="col-lg-3">
                        <div class="blog-sidepart">
                
                            <h3 class="sidepart-title">Related Blog</h3>

                            {relatedBlogs && relatedBlogs.length > 0 ? (
                                relatedBlogs.map((item) => (
                                    <div className="related-item" key={item.id}>

                                    <img
                                        src={`${imageBaseUrl}/${item.blog_image}`}
                                        alt={item.title}
                                    />

                                    <span className="categori">
                                        {item.category_name || "Category"}
                                    </span>
                                    <a href={`/blog/${blog.slug}`}>
                                        <p>{item.title}</p>
                                    </a>

                                    </div>
                                ))
                                ) : (
                                <p>No related blogs found</p>
                                )}
                        </div>
                    </div>
                </div>
            </div>
        </section>


        {/* <section class="journey-section">
            <div class="container">
                <div class="section-heading">
                    <span class="sub-title">About Travel Agency</span>
                    <h2>Our Journey Memorable <br /> Adventures Worldwide</h2>
                </div>
        
                <div class="journey-grid">
                    <div class="left-card">
                        <img src="../images/inspire1.png" alt="" />
        
                        <div class="card-cont">
                            <span class="tag">Inspiration</span>
                            <h3>Our Main Inspire Runner With Autism Graces Of Women's Running</h3>
                            <p>
                                Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit, Sed Do
                                Eiusmod Excepteur Sint Occaecat Cupidatat Non Proident. Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit, Sed Do
                                Eiusmod Excepteur Sint Occaecat Cupidatat Non Proident.
                            </p>
        
                            <div class="author-row">
                                <div class="author">
                                    <img src="../images/author.png" alt="" />
                                    <span>David Rocos</span>
                                </div>
        
                                <button class="btn-tour">Read More...</button>
                            </div>
                        </div>
                    </div>
        
                    <div class="right-cards">
        
                        <div class="ins-card">
                            <img src="../images/inspire2.png" alt="" />
                            <span class="tag">Inspiration</span>
                            <h4>Our Main Inspire Runner With Autism Graces Of</h4>
                        </div>
        
                        <div class="ins-card">
                            <img src="../images/inspire3.png" alt="" />
                            <span class="tag">Inspiration</span>
                            <h4>Our Main Inspire Runner With Autism Graces Of</h4>
                        </div>
        
                        <div class="ins-card">
                            <img src="../images/inspire4.png" alt="" />
                            <span class="tag">Inspiration</span>
                            <h4>Our Main Inspire Runner With Autism Graces Of</h4>
                        </div>
        
                        <div class="ins-card">
                            <img src="../images/inspire5.png" alt="" />
                            <span class="tag">Inspiration</span>
                            <h4>Our Main Inspire Runner With Autism Graces Of</h4>
                        </div>
        
                    </div>
        
                </div>
            </div>
        </section> */}


        <FollowUsInstagram />
      </div>
    )
};
