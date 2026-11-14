import { createContext, useContext, useReducer, useMemo, useCallback } from 'react';
import { hotelFilterReducer, initialState, FILTER_ACTION_TYPES } from '../reducers/hotelFilterReducer';

const HotelFilterContext = createContext();

export const HotelFilterProvider = ({ children }) => {
  const [state, dispatch] = useReducer(hotelFilterReducer, initialState);

  // Helper actions for cleaner usage in components
  const toggleSuggestedForYou = (option) => {
    dispatch({ type: FILTER_ACTION_TYPES.SET_SUGGESTED_FOR_YOU, payload: option });
  };

  const togglePricePerNight = (rangeValue) => {
    dispatch({ type: FILTER_ACTION_TYPES.SET_PRICE_PER_NIGHT, payload: rangeValue });
  };

  const setPriceRange = (range) => {
    dispatch({ type: FILTER_ACTION_TYPES.SET_PRICE_RANGE, payload: range });
  };

  const toggleStarCategory = (star) => {
    dispatch({ type: FILTER_ACTION_TYPES.SET_STAR_CATEGORY, payload: star });
  };

  const togglePropertyType = (type) => {
    dispatch({ type: FILTER_ACTION_TYPES.SET_PROPERTY_TYPE, payload: type });
  };

  const toggleTopLocation = (location) => {
    dispatch({ type: FILTER_ACTION_TYPES.SET_TOP_LOCATIONS, payload: location });
  };

  const toggleGuestsLove = (amenity) => {
    dispatch({ type: FILTER_ACTION_TYPES.SET_GUESTS_LOVE, payload: amenity });
  };

  const toggleBookingPreference = (preference) => {
    dispatch({ type: FILTER_ACTION_TYPES.SET_BOOKING_PREFERENCE, payload: preference });
  };

  const toggleHouseRule = (rule) => {
    dispatch({ type: FILTER_ACTION_TYPES.SET_HOUSE_RULES, payload: rule });
  };

  const toggleDealsOffers = (deal) => {
    dispatch({ type: FILTER_ACTION_TYPES.SET_DEALS_OFFERS, payload: deal });
  };

  const resetFilters = useCallback(() => {
    dispatch({ type: FILTER_ACTION_TYPES.RESET_FILTERS });
  }, []);

  const hasActiveFilters = useMemo(
    () =>
      state.suggestedForYou.length > 0 ||
      state.pricePerNight.length > 0 ||
      state.starCategory.length > 0 ||
      state.propertyType.length > 0 ||
      state.topLocations.length > 0 ||
      state.guestsLove.length > 0 ||
      state.bookingPreference.length > 0 ||
      state.houseRules.length > 0 ||
      state.dealsOffers.length > 0 ||
      state.priceRange[0] !== initialState.priceRange[0] ||
      state.priceRange[1] !== initialState.priceRange[1],
    [state]
  );

  return (
    <HotelFilterContext.Provider
      value={{
        filters: state,
        hasActiveFilters,
        dispatch,
        toggleSuggestedForYou,
        togglePricePerNight,
        setPriceRange,
        toggleStarCategory,
        togglePropertyType,
        toggleTopLocation,
        toggleGuestsLove,
        toggleBookingPreference,
        toggleHouseRule,
        toggleDealsOffers,
        resetFilters,
      }}
    >
      {children}
    </HotelFilterContext.Provider>
  );
};

// Custom Hook for easy component consumption
export const useHotelFilters = () => {
  const context = useContext(HotelFilterContext);
  if (!context) {
    throw new Error('useHotelFilters must be used within a HotelFilterProvider');
  }
  return context;
};