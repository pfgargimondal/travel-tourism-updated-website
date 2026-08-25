export const initialState = {
  stops: [], // e.g., ['NON_STOP', '1_CHANGE']
  farePolicy: [], // e.g., ['NON_REFUNDABLE', 'REFUNDABLE']
  priceRange: [6115, 43746],
  departureTime: [], // e.g., ['BEFORE_6AM', '6AM_12PM', '12PM_6PM', 'AFTER_6PM']
  arrivalTime: [], // e.g., ['BEFORE_6AM', '6AM_12PM', '12PM_6PM', 'AFTER_6PM']
  airlines: [],
  others: [], // e.g., ['SAME_DAY_ARRIVAL']
  selectedDate: null
};

export const FILTER_ACTION_TYPES = {
  SET_STOPS: 'SET_STOPS',
  SET_FARE_POLICY: 'SET_FARE_POLICY',
  SET_PRICE_RANGE: 'SET_PRICE_RANGE',
  SET_DEPARTURE_TIME: 'SET_DEPARTURE_TIME',
  SET_ARRIVAL_TIME: 'SET_ARRIVAL_TIME',
  SET_AIRLINES: 'SET_AIRLINES',
  SET_OTHERS: 'SET_OTHERS',
  SET_SELECTED_DATE: 'SET_SELECTED_DATE',
  RESET_FILTERS: 'RESET_FILTERS',
};

// Helper for multi-select toggle array values
const toggleArrayItem = (array, value) =>
  array.includes(value) ? array.filter((item) => item !== value) : [...array, value];

export function flightFilterReducer(state, action) {
  switch (action.type) {
    case FILTER_ACTION_TYPES.SET_STOPS:
      return {
        ...state,
        stops: toggleArrayItem(state.stops, action.payload),
      };

    case FILTER_ACTION_TYPES.SET_FARE_POLICY:
      return {
        ...state,
        farePolicy: toggleArrayItem(state.farePolicy, action.payload),
      };

    case FILTER_ACTION_TYPES.SET_PRICE_RANGE:
      return {
        ...state,
        priceRange: action.payload, // [min, max]
      };

    case FILTER_ACTION_TYPES.SET_DEPARTURE_TIME:
      return {
        ...state,
        departureTime: toggleArrayItem(state.departureTime, action.payload),
      };

    case FILTER_ACTION_TYPES.SET_ARRIVAL_TIME:
      return {
        ...state,
        arrivalTime: toggleArrayItem(state.arrivalTime, action.payload),
      };

    case FILTER_ACTION_TYPES.SET_AIRLINES:
      return {
        ...state,
        airlines: toggleArrayItem(state.airlines, action.payload),
      };

    case FILTER_ACTION_TYPES.SET_OTHERS:
      return {
        ...state,
        others: toggleArrayItem(state.others, action.payload),
      };
    
    case FILTER_ACTION_TYPES.SET_SELECTED_DATE: {
      const incoming = action.payload;
      const isSameDate =
        state.selectedDate &&
        incoming &&
        new Date(state.selectedDate).toDateString() === new Date(incoming).toDateString();

      return {
        ...state,
        selectedDate: isSameDate ? null : incoming,
      };
    }

    case FILTER_ACTION_TYPES.RESET_FILTERS:
      return initialState;

    default:
      return state;
  }
}