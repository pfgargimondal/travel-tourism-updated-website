import { createContext, useContext, useReducer } from 'react';
import { flightFilterReducer, initialState, FILTER_ACTION_TYPES } from '../reducers/flightFilterReducer';



const FlightFilterContext = createContext();

export const FlightFilterProvider = ({ children }) => {
  const [state, dispatch] = useReducer(flightFilterReducer, initialState);

  // Helper actions for cleaner usage in components
  const toggleStop = (stopValue) => {
    dispatch({ type: FILTER_ACTION_TYPES.SET_STOPS, payload: stopValue });
  };

  const toggleFarePolicy = (policyValue) => {
    dispatch({ type: FILTER_ACTION_TYPES.SET_FARE_POLICY, payload: policyValue });
  };

  const setPriceRange = (range) => {
    dispatch({ type: FILTER_ACTION_TYPES.SET_PRICE_RANGE, payload: range });
  };

  const toggleDepartureTime = (timeSlot) => {
    dispatch({ type: FILTER_ACTION_TYPES.SET_DEPARTURE_TIME, payload: timeSlot });
  };

  const toggleArrivalTime = (timeSlot) => {
    dispatch({ type: FILTER_ACTION_TYPES.SET_ARRIVAL_TIME, payload: timeSlot });
  };

  const toggleAirline = (airlineCode) => {
    dispatch({ type: FILTER_ACTION_TYPES.SET_AIRLINES, payload: airlineCode });
  };

  const toggleOtherFilter = (option) => {
    dispatch({ type: FILTER_ACTION_TYPES.SET_OTHERS, payload: option });
  };

  const setSelectedDate = (date) => {
    dispatch({ type: FILTER_ACTION_TYPES.SET_SELECTED_DATE, payload: date });
  };

  const resetFilters = () => {
    dispatch({ type: FILTER_ACTION_TYPES.RESET_FILTERS });
  };

  return (
    <FlightFilterContext.Provider
      value={{
        filters: state,
        dispatch,
        toggleStop,
        toggleFarePolicy,
        setPriceRange,
        toggleDepartureTime,
        toggleArrivalTime,
        toggleAirline,
        toggleOtherFilter,
        setSelectedDate,
        resetFilters,
      }}
    >
      {children}
    </FlightFilterContext.Provider>
  );
};

// Custom Hook for easy component consumption
export const useFlightFilters = () => {
  const context = useContext(FlightFilterContext);
  if (!context) {
    throw new Error('useFlightFilters must be used within a FlightFilterProvider');
  }
  return context;
};