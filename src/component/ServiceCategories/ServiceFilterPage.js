import { useParams } from "react-router-dom";
import { FlightFilter } from "../../pages";
import { Hotel } from "../../pages/Hotel/Hotel";

const ServiceFilterPage = () => {

  const { slug } = useParams();

  const routeComponents = {
    hotels: Hotel,
    flights: FlightFilter,
    trains: () => <div>Train Filter Page</div>,
    buses: () => <div>Bus Filter Page</div>,
    cabs: () => <div>Cab Filter Page</div>,
    tours: () => <div>Tour Page</div>,
    visa: () => <div>Visa Page</div>,
    cruise: () => <div>Cruise Page</div>,
    forex: () => <div>Forex Page</div>,
    insurance: () => <div>Insurance Page</div>,
  };

  const Component = routeComponents[slug];

  return Component ? <Component /> : <div>404 Page Not Found</div>;
};

export default ServiceFilterPage;