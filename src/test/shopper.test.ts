import { describe, expect, it } from 'vitest';
import { alternatives, demoSearch, exampleShops, sortNearby } from '@/lib/shopper';
describe('Shopper rules', () => {
  it('sorts by distance only with valid shopper coordinates', () => {
    const shops = sortNearby(exampleShops, { latitude: 10.0254, longitude: 76.3083 });
    expect(shops[0].id).toBe('green-basket');
    expect(shops[0].distanceKm).toBe(0);
    expect(shops.map(s => s.distanceKm)).toEqual(shops.map(s => s.distanceKm).sort((a, b) => (a ?? 0) - (b ?? 0)));
  });
  it('does not imply exact distances without valid coordinates', () => {
    expect(sortNearby(exampleShops, { latitude: NaN, longitude: 76 })[0].distanceKm).toBeUndefined();
    expect(sortNearby(exampleShops).map(s => s.id)).toEqual(exampleShops.map(s => s.id));
  });
  it('refers an out-of-stock product only to in-stock same-product results', () => {
    const result = demoSearch('rice', 'Edappally');
    const out = result.shops.find(s => s.status === 'out');
    if (!out) throw new Error('Expected an out-of-stock fixture');
    expect(alternatives(result.shops, out).map(s => s.id)).toEqual(['green-basket']);
  });
  it('never fabricates alternatives when none are returned', () => {
    expect(alternatives([exampleShops[2]], exampleShops[2])).toEqual([]);
  });
  it('marks demo availability explicitly', () => { expect(demoSearch('rice', 'Edappally').demo).toBe(true); });
  it('limits area-based results to the selected area', () => { expect(demoSearch('rice', 'Kakkanad').shops.map(s => s.id)).toEqual(['daily']); });
  it('returns no products for empty or unknown searches', () => { expect(demoSearch('', 'Edappally').shops).toEqual([]); expect(demoSearch('unknown', 'Edappally').shops).toEqual([]); });
  it('does not expose private retailer fields', () => {
    const keys = Object.keys(demoSearch('rice', 'Edappally').shops[0]);
    expect(keys).toEqual(['id', 'name', 'area', 'address', 'product', 'price', 'status', 'coordinates', 'updatedMinutes']);
  });
});