import "./TermsCondition.css";
import http from "../../http";
import Loader from "../../component/Loader/Loader";
import { useEffect, useState } from "react";
import { PolicyComponent } from "../PolicyComponent/PolicyComponent";
export const TermsCondition = () => {

    const [loading, setLoading] = useState(false);
    const [termsConditionDetails, setTermsConditionDetails] = useState({});

    useEffect(() => {
        const fetchContactUsData = async () => {
            setLoading(true);
        try {
            const getresponse = await http.get("/get-terms-condition-content");
            setTermsConditionDetails(getresponse.data);
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
        <PolicyComponent PolicyDetails={termsConditionDetails}/>
      </div>
      </>
    )
}
