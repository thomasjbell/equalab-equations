'use client';

import { useState, useEffect, useCallback } from 'react';
import { FavouritesService } from '@/lib/storage/favouritesService';

export function useFavourites() {
  const [favouriteIds, setFavouriteIds] = useState<string[]>([]);

  const refresh = useCallback(() => {
    setFavouriteIds(FavouritesService.getFavouriteIds());
  }, []);

  useEffect(() => {
    refresh();
    window.addEventListener('equalab:favourites-changed', refresh);
    return () => window.removeEventListener('equalab:favourites-changed', refresh);
  }, [refresh]);

  const toggleFavourite = useCallback((id: string) => {
    if (FavouritesService.isFavourite(id)) {
      FavouritesService.removeFavourite(id);
    } else {
      FavouritesService.addFavourite(id);
    }
  }, []);

  const isFavourite = useCallback(
    (id: string) => favouriteIds.includes(id),
    [favouriteIds]
  );

  return { favouriteIds, toggleFavourite, isFavourite, clearAll: FavouritesService.clearAll };
}
