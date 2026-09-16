export const initialState = {
  suggestedForYou: [], // e.g., ['LAST_MINUTE_DEALS', 'BREAKFAST_INCLUDED']
  pricePerNight: [], // e.g., ['500-999', '1000-1999']
  priceRange: [0, 50000], // "Your Budget" min/max
  starCategory: [], // e.g., ['3_STAR', '4_STAR']
  propertyType: [], // e.g., ['HOTEL', 'RESORT']
  topLocations: [], // e.g., ['NORTH_GOA', 'BAGA_BEACH']
  guestsLove: [], // e.g., ['WIFI', 'SPA']
  bookingPreference: [], // e.g., ['FREE_CANCELLATION', 'INSTANT_BOOK']
  houseRules: [], // e.g., ['SELF_CHECK_IN', 'PETS_ALLOWED']
  dealsOffers: [], // e.g., ['LIGHTNING_DEALS']
};

export const FILTER_ACTION_TYPES = {
  SET_SUGGESTED_FOR_YOU: 'SET_SUGGESTED_FOR_YOU',
  SET_PRICE_PER_NIGHT: 'SET_PRICE_PER_NIGHT',
  SET_PRICE_RANGE: 'SET_PRICE_RANGE',
  SET_STAR_CATEGORY: 'SET_STAR_CATEGORY',
  SET_PROPERTY_TYPE: 'SET_PROPERTY_TYPE',
  SET_TOP_LOCATIONS: 'SET_TOP_LOCATIONS',
  SET_GUESTS_LOVE: 'SET_GUESTS_LOVE',
  SET_BOOKING_PREFERENCE: 'SET_BOOKING_PREFERENCE',
  SET_HOUSE_RULES: 'SET_HOUSE_RULES',
  SET_DEALS_OFFERS: 'SET_DEALS_OFFERS',
  RESET_FILTERS: 'RESET_FILTERS',
};

// Helper for multi-select toggle array values
const toggleArrayItem = (array, value) =>
  array.includes(value) ? array.filter((item) => item !== value) : [...array, value];

export function hotelFilterReducer(state, action) {
  switch (action.type) {
    case FILTER_ACTION_TYPES.SET_SUGGESTED_FOR_YOU:
      return {
        ...state,
        suggestedForYou: toggleArrayItem(state.suggestedForYou, action.payload),
      };

    case FILTER_ACTION_TYPES.SET_PRICE_PER_NIGHT:
      return {
        ...state,
        pricePerNight: toggleArrayItem(state.pricePerNight, action.payload),
      };

    case FILTER_ACTION_TYPES.SET_PRICE_RANGE:
      return {
        ...state,
        priceRange: action.payload, // [min, max]
      };

    case FILTER_ACTION_TYPES.SET_STAR_CATEGORY:
      return {
        ...state,
        starCategory: toggleArrayItem(state.starCategory, action.payload),
      };

    case FILTER_ACTION_TYPES.SET_PROPERTY_TYPE:
      return {
        ...state,
        propertyType: toggleArrayItem(state.propertyType, action.payload),
      };

    case FILTER_ACTION_TYPES.SET_TOP_LOCATIONS:
      return {
        ...state,
        topLocations: toggleArrayItem(state.topLocations, action.payload),
      };

    case FILTER_ACTION_TYPES.SET_GUESTS_LOVE:
      return {
        ...state,
        guestsLove: toggleArrayItem(state.guestsLove, action.payload),
      };

    case FILTER_ACTION_TYPES.SET_BOOKING_PREFERENCE:
      return {
        ...state,
        bookingPreference: toggleArrayItem(state.bookingPreference, action.payload),
      };

    case FILTER_ACTION_TYPES.SET_HOUSE_RULES:
      return {
        ...state,
        houseRules: toggleArrayItem(state.houseRules, action.payload),
      };

    case FILTER_ACTION_TYPES.SET_DEALS_OFFERS:
      return {
        ...state,
        dealsOffers: toggleArrayItem(state.dealsOffers, action.payload),
      };

    case FILTER_ACTION_TYPES.RESET_FILTERS:
      return initialState;

    default:
      return state;
  }
}