import { useState, useCallback, useMemo } from "react";
import { 
  activeEvents, 
  eventOptionsMap, 
  type TradingEvent, 
  type EventOption 
} from "@/data/events";

interface UseEventsReturn {
  // Event list
  events: TradingEvent[];
  
  // Selected event state
  selectedEvent: TradingEvent;
  setSelectedEvent: (event: TradingEvent) => void;
  selectEventById: (eventId: string) => void;
  
  // Selected option state
  selectedOption: string;
  setSelectedOption: (optionId: string) => void;
  
  // Options for current event
  options: EventOption[];
  selectedOptionData: EventOption;
  
  // Favorites
  favorites: Set<string>;
  toggleFavorite: (eventId: string, e?: React.MouseEvent) => void;
  isFavorite: (eventId: string) => boolean;
  
  // Search/filter
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredEvents: TradingEvent[];
  
  // Helpers
  getEventById: (eventId: string) => TradingEvent | undefined;
  getOptionsForEvent: (eventId: string) => EventOption[];
}

export const useEvents = (initialEventId?: string): UseEventsReturn => {
  // Find initial event or default to first
  const initialEvent = initialEventId 
    ? activeEvents.find(e => e.id === initialEventId) || activeEvents[0]
    : activeEvents[0];

  // State
  const [selectedEvent, setSelectedEvent] = useState<TradingEvent>(initialEvent);
  const [selectedOption, setSelectedOption] = useState<string>("1");
  const [favorites, setFavorites] = useState<Set<string>>(new Set(["1"]));
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Get options for current event
  const options = useMemo(() => {
    return eventOptionsMap[selectedEvent.id] || [];
  }, [selectedEvent.id]);

  // Get selected option data
  const selectedOptionData = useMemo(() => {
    return options.find(opt => opt.id === selectedOption) || options[0] || { id: "1", label: "", price: "0" };
  }, [options, selectedOption]);

  // Filter events by search query
  const filteredEvents = useMemo(() => {
    if (!searchQuery.trim()) return activeEvents;
    const query = searchQuery.toLowerCase();
    return activeEvents.filter(event => 
      event.name.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // Select event by ID
  const selectEventById = useCallback((eventId: string) => {
    const event = activeEvents.find(e => e.id === eventId);
    if (event) {
      setSelectedEvent(event);
      setSelectedOption("1"); // Reset option when switching events
    }
  }, []);

  // Toggle favorite
  const toggleFavorite = useCallback((eventId: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(eventId)) {
        newFavorites.delete(eventId);
      } else {
        newFavorites.add(eventId);
      }
      return newFavorites;
    });
  }, []);

  // Check if event is favorite
  const isFavorite = useCallback((eventId: string) => {
    return favorites.has(eventId);
  }, [favorites]);

  // Get event by ID
  const getEventById = useCallback((eventId: string) => {
    return activeEvents.find(e => e.id === eventId);
  }, []);

  // Get options for any event
  const getOptionsForEvent = useCallback((eventId: string) => {
    return eventOptionsMap[eventId] || [];
  }, []);

  // Handle selected event change with option reset
  const handleSetSelectedEvent = useCallback((event: TradingEvent) => {
    setSelectedEvent(event);
    setSelectedOption("1"); // Reset to first option when switching events
  }, []);

  return {
    events: activeEvents,
    selectedEvent,
    setSelectedEvent: handleSetSelectedEvent,
    selectEventById,
    selectedOption,
    setSelectedOption,
    options,
    selectedOptionData,
    favorites,
    toggleFavorite,
    isFavorite,
    searchQuery,
    setSearchQuery,
    filteredEvents,
    getEventById,
    getOptionsForEvent,
  };
};

export default useEvents;
