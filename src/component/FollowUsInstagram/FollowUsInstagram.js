import { useEffect, useState } from "react";
import http from "../../http";
import Loader from "../Loader/Loader";
import "./FollowUsInstagram.css";
import { Link } from "react-router-dom";
export const FollowUsInstagram = () => {

      const [imageUrl, setImageUrl] = useState("");
      const [instagramPost, setInstagramPost] = useState([]);
      const [loading, setLoading] = useState(false);
    
      useEffect(() => {
        const fetchInstagramData = async () => {
          setLoading(true);
          try {
            const response = await http.get("/get-instagram-profile");
    
            if (response.data.success) {
              setImageUrl(response.data.data.instagram_postimage_url);
              setInstagramPost(response.data.data.instagram_post);
            } else {
              console.error(response.data.message);
            }
          } catch (error) {
            console.error("Error fetching categories:", error);
          } finally {
            setLoading(false);
          }
        };
    
        fetchInstagramData();
      }, []);
    
      if (loading) {
        return <Loader />;
      }

    return (
      <div>
        <section className="insta-section text-center">
            <img src="./images/footertop.png" className="footer-wave" alt="" />

            <div className="container position-relative">
                <div className="row justify-content-center g-4">
                    {instagramPost.map((item) => (
                        <Link to={item.title}>
                            <div className="col-auto">
                                <img src={`${imageUrl}/${item.image}`} alt={item.title} />
                            </div>
                        </Link>
                    ))}
                </div>

                <button className="follow-btn">
                    <i className="bi bi-instagram"></i> Follow On Instagram
                </button>
            </div>
        </section>
      </div>
    )
}
