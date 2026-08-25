import { useEffect, useState } from "react";
import http from "../../http";

export const Faq = () => {

    const [activeIndex, setActiveIndex] = useState(0);
      // eslint-disable-next-line
    const [loading, setLoading] = useState(false);
    const [faqDetails, setFaqDetails] = useState([]);

    useEffect(() => {
        const fetchFaqData = async () => {
            setLoading(true);
        try {
            const getresponse = await http.get("/get-faq-details");
            setFaqDetails(getresponse.data.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
        };

        fetchFaqData();
    }, []);

    const toggleFAQ = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

  return (
    <div>
      <div class="faq-accordion">
        {faqDetails.map((faq, index) => (
        <div
            key={index}
            className={`faq-item ${activeIndex === index ? "active" : ""}`}
        >
        <div
            className="faq-question"
            onClick={() => toggleFAQ(index)}
        >
            {faq.question}
            <span className="faq-icon">
            {activeIndex === index ? "-" : "+"}
            </span>
        </div>

        {activeIndex === index && (
            <div className="faq-answer">
            {faq.answer}
            </div>
        )}

        </div>
    ))}
      </div>
    </div>
  );
};
