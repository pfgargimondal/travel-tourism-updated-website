import "./PrivacyPolicy.css";
import http from "../../http";
import Loader from "../../component/Loader/Loader";
import { useEffect, useState } from "react";
import { PolicyComponent } from "../PolicyComponent/PolicyComponent";
export const PrivacyPolicy = () => {

    const [loading, setLoading] = useState(false);
    const [privacyPolicyDetails, setPrivacyPolicyDetails] = useState({});

    useEffect(() => {
        const fetchContactUsData = async () => {
            setLoading(true);
        try {
            const getresponse = await http.get("/get-privacy-policy-content");
            setPrivacyPolicyDetails(getresponse.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
        };

        fetchContactUsData();
    }, []);
 
    return (
      <>
        {loading && <Loader/>}
        
      <div className="legal-pages-wrapper">
        <PolicyComponent PolicyDetails={privacyPolicyDetails}/>
      </div>
      </>
    )
}
