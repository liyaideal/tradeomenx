import { useState, useCallback, useMemo, useEffect } from "react";
import { 
  activeEvents, 
  eventOptionsMap, 
  type TradingEvent, 
  type EventOption 
} from "@/data/events";

// Local storage keys
const STORAGE_KEYS = {
  FAVORITES: "trading_favorites",
  LAST_EVENT: "trading_last_event",
  LAST_OPTION: "trading_last_option",
} as const;

// Helper functions for localStorage
const getStoredFavorites = (): Set<string> => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return new Set(parsed);
      }
    }
  } catch (e) {
    console.warn("Failed to parse stored favorites:", e);
  }
  return new Set(["1"]); // Default favorites
};

const setStoredFavorites = (favorites: Set<string>): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify([...favorites]));
  } catch (e) {
    console.warn("Failed to store favorites:", e);
  }
};

const getStoredLastEvent = (): string | null => {
  try {
    return localStorage.getItem(STORAGE_KEYS.LAST_EVENT);
  } catch (e) {
    return null;
  }
};

const setStoredLastEvent = (eventId: string): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.LAST_EVENT, eventId);
  } catch (e) {
    console.warn("Failed to store last event:", e);
  }
};

const getStoredLastOption = (eventId: string): string | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.LAST_OPTION);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed[eventId] || null;
    }
  } catch (e) {
    return null;
  }
  return null;
};

const setStoredLastOption = (eventId: string, optionId: string): void => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.LAST_OPTION);
    const parsed = stored ? JSON.parse(stored) : {};
    parsed[eventId] = optionId;
    localStorage.setItem(STORAGE_KEYS.LAST_OPTION, JSON.stringify(parsed));
  } catch (e) {
    console.warn("Failed to store last option:", e);
  }
};

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
  // Initialize from localStorage or use defaults
  const getInitialEvent = (): TradingEvent => {
    if (initialEventId) {
      const event = activeEvents.find(e => e.id === initialEventId);
      if (event) return event;
    }
    
    const storedEventId = getStoredLastEvent();
    if (storedEventId) {
      const event = activeEvents.find(e => e.id === storedEventId);
      if (event) return event;
    }
    
    return activeEvents[0];
  };

  const getInitialOption = (eventId: string): string => {
    const stored = getStoredLastOption(eventId);
    return stored || "1";
  };

  // State
  const [selectedEvent, setSelectedEventState] = useState<TradingEvent>(getInitialEvent);
  const [selectedOption, setSelectedOptionState] = useState<string>(() => 
    getInitialOption(getInitialEvent().id)
  );
  const [favorites, setFavorites] = useState<Set<string>>(getStoredFavorites);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Persist favorites to localStorage
  useEffect(() => {
    setStoredFavorites(favorites);
  }, [favorites]);

  // Persist selected event to localStorage
  useEffect(() => {
    setStoredLastEvent(selectedEvent.id);
  }, [selectedEvent.id]);

  // Persist selected option to localStorage
  useEffect(() => {
    setStoredLastOption(selectedEvent.id, selectedOption);
  }, [selectedEvent.id, selectedOption]);

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
      setSelectedEventState(event);
      const storedOption = getStoredLastOption(eventId);
      setSelectedOptionState(storedOption || "1");
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

  // Handle selected event change with option restore
  const handleSetSelectedEvent = useCallback((event: TradingEvent) => {
    setSelectedEventState(event);
    const storedOption = getStoredLastOption(event.id);
    setSelectedOptionState(storedOption || "1");
  }, []);

  // Handle selected option change
  const handleSetSelectedOption = useCallback((optionId: string) => {
    setSelectedOptionState(optionId);
  }, []);

  return {
    events: activeEvents,
    selectedEvent,
    setSelectedEvent: handleSetSelectedEvent,
    selectEventById,
    selectedOption,
    setSelectedOption: handleSetSelectedOption,
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
