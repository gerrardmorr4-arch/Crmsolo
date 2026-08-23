import { useState, useEffect, useCallback } from 'react';

export interface CRMFilterPreferences {
  selectedCategory: string;
  selectedPriceTier: string;
  selectedPlatform: string;
  sortBy: string;
  checklistSelectedIds: string[];
  checklistCategoryFilter: string;
  checklistSearchQuery: string;
}

export const DEFAULT_FILTER_PREFERENCES: CRMFilterPreferences = {
  selectedCategory: 'All',
  selectedPriceTier: 'All',
  selectedPlatform: 'All',
  sortBy: 'score-desc',
  checklistSelectedIds: [
    'kanban_pipeline',
    'two_way_email_sync',
    'speedy_mobile_app',
    'cheap_starter_tiers'
  ],
  checklistCategoryFilter: 'All',
  checklistSearchQuery: ''
};

const FILTER_PREFS_KEY = 'crmsolo_filter_preferences';

export function getCRMFilterPreferences(): CRMFilterPreferences {
  try {
    const data = localStorage.getItem(FILTER_PREFS_KEY);
    if (!data) return DEFAULT_FILTER_PREFERENCES;
    return { ...DEFAULT_FILTER_PREFERENCES, ...JSON.parse(data) };
  } catch (e) {
    console.warn('Failed to parse CRM filter preferences from localStorage', e);
    return DEFAULT_FILTER_PREFERENCES;
  }
}

export function saveCRMFilterPreferences(prefs: Partial<CRMFilterPreferences>): CRMFilterPreferences {
  try {
    const current = getCRMFilterPreferences();
    const updated = { ...current, ...prefs };
    localStorage.setItem(FILTER_PREFS_KEY, JSON.stringify(updated));
    // Dispatch custom event for cross-component reactive updates
    window.dispatchEvent(new CustomEvent('crmsolo_filter_prefs_changed', { detail: updated }));
    return updated;
  } catch (e) {
    console.warn('Failed to save CRM filter preferences to localStorage', e);
    return DEFAULT_FILTER_PREFERENCES;
  }
}

/**
 * Custom React Hook to retrieve and sync user-selected CRM filter preferences in LocalStorage.
 * Keeps user filters persistent across visits to reviews, checklists, and comparison tools.
 */
export function useCRMFilterPreferences() {
  const [preferences, setPreferencesState] = useState<CRMFilterPreferences>(() => getCRMFilterPreferences());

  useEffect(() => {
    const handleStorageChange = (e: CustomEvent<CRMFilterPreferences> | StorageEvent) => {
      if ('detail' in e && e.detail) {
        setPreferencesState(e.detail);
      } else if ('key' in e && e.key === FILTER_PREFS_KEY) {
        setPreferencesState(getCRMFilterPreferences());
      }
    };

    window.addEventListener('crmsolo_filter_prefs_changed', handleStorageChange as EventListener);
    window.addEventListener('storage', handleStorageChange as EventListener);

    return () => {
      window.removeEventListener('crmsolo_filter_prefs_changed', handleStorageChange as EventListener);
      window.removeEventListener('storage', handleStorageChange as EventListener);
    };
  }, []);

  const setPreferences = useCallback((updates: Partial<CRMFilterPreferences>) => {
    const updated = saveCRMFilterPreferences(updates);
    setPreferencesState(updated);
  }, []);

  const resetPreferences = useCallback(() => {
    saveCRMFilterPreferences(DEFAULT_FILTER_PREFERENCES);
    setPreferencesState(DEFAULT_FILTER_PREFERENCES);
  }, []);

  return {
    preferences,
    setPreferences,
    resetPreferences
  };
}
