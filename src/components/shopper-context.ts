import { createContext, useContext } from 'react';
import type { SearchResponse, ShopResult } from '@/lib/shopper';

export type ShopperContext = {
  area: string; query: string; setQuery: (q: string) => void;
  response: SearchResponse | null; loading: boolean; error: string; offline: boolean;
  search: (q: string) => Promise<void>; locationOpen: boolean; setLocationOpen: (v: boolean) => void;
  hasLocation: boolean;
  resetSearch: () => void; nearby: ShopResult[];
};
export const Context = createContext<ShopperContext | null>(null);
export function useShopper() {
  const value = useContext(Context);
  if (!value) throw new Error('Shopper context is missing');
  return value;
}
