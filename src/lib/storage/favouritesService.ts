'use client';

import { LocalStorageService } from './localStorageService';

const KEY = 'favourites';

export class FavouritesService {
  static getFavouriteIds(): string[] {
    return LocalStorageService.get<string[]>(KEY, []);
  }

  static addFavourite(id: string): void {
    const ids = this.getFavouriteIds();
    if (!ids.includes(id)) {
      LocalStorageService.set(KEY, [...ids, id]);
      window.dispatchEvent(new Event('equalab:favourites-changed'));
    }
  }

  static removeFavourite(id: string): void {
    const ids = this.getFavouriteIds().filter((fid) => fid !== id);
    LocalStorageService.set(KEY, ids);
    window.dispatchEvent(new Event('equalab:favourites-changed'));
  }

  static isFavourite(id: string): boolean {
    return this.getFavouriteIds().includes(id);
  }

  static clearAll(): void {
    LocalStorageService.set(KEY, []);
    window.dispatchEvent(new Event('equalab:favourites-changed'));
  }
}
