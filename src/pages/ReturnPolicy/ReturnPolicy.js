import http from "../../http";
import Loader from "../../component/Loader/Loader";
import { useEffect, useState } from "react";
import { PolicyComponent } from "../PolicyComponent/PolicyComponent";
export const ReturnPolicy = () => {

    const [loading, setLoading] = useState(false);
    const [returnPolicyDetails, setReturnPolicyDetails] = useState({});

    useEffect(() => {
        const fetchReturnPolicyData = async () => {
            setLoading(true);
        try {
            const getresponse = await http.get("/get-return-policy-content");
            setReturnPolicyDetails(getresponse.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
        };

        fetchReturnPolicyData();
    }, []);
 
    return (
      <>
        {loading && <Loader/>}
        
      <div className="legal-pages-wrapper">
        <PolicyComponent PolicyDetails={returnPolicyDetails}/>
      </div>
      </>
    )
}
