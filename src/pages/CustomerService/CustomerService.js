import http from "../../http";
import Loader from "../../component/Loader/Loader";
import { useEffect, useState } from "react";
import { PolicyComponent } from "../PolicyComponent/PolicyComponent";
export const CustomerService = () => {

    const [loading, setLoading] = useState(false);
    const [customerServiceDetails, setCustomerServiceDetails] = useState({});

    useEffect(() => {
        const fetchCustomerServiceData = async () => {
            setLoading(true);
        try {
            const getresponse = await http.get("/get-customer-service-content");
            setCustomerServiceDetails(getresponse.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
        };

        fetchCustomerServiceData();
    }, []);
 
    return (
      <>
        {loading && <Loader/>}
        
      <div className="legal-pages-wrapper">
        <PolicyComponent PolicyDetails={customerServiceDetails}/>
      </div>
      </>
    )
}
