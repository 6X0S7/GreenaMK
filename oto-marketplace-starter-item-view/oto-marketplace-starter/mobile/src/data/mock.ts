import { Listing } from '../types';

export const featuredListings: Listing[] = [
  {
    id: '1',
    title: 'Bosch combi drill set',
    price: 'GBP 48',
    location: 'Brixton',
    category: 'Tools',
    distance: '1.4 mi',
    seller: 'Marco',
    badge: 'Quick pickup',
    condition: 'Used - good',
  },
  {
    id: '2',
    title: 'Vintage oak sideboard',
    price: 'GBP 120',
    location: 'Clapham',
    category: 'Furniture',
    distance: '2.1 mi',
    seller: 'Amelia',
    badge: 'Delivery available',
    condition: 'Used - very good',
  },
  {
    id: '3',
    title: 'Patio pressure washer',
    price: 'GBP 18/day',
    location: 'Camberwell',
    category: 'Rentals',
    distance: '2.7 mi',
    seller: 'Darnell',
    badge: 'Rent',
    condition: 'Available to rent',
  },
];

export const browseListings: Listing[] = [
  ...featuredListings,
  {
    id: '4',
    title: 'Nintendo Switch bundle',
    price: 'GBP 165',
    location: 'Peckham',
    category: 'Electronics',
    distance: '3.1 mi',
    seller: 'Sana',
    badge: 'Popular',
    condition: 'Used - very good',
  },
  {
    id: '5',
    title: 'City bike with lock',
    price: 'GBP 90',
    location: 'Kennington',
    category: 'Sports',
    distance: '1.9 mi',
    seller: 'Jon',
    condition: 'Used - good',
  },
];

export const savedListings: Listing[] = [featuredListings[1], browseListings[3]];

export const categories = ['Tools', 'Furniture', 'Electronics', 'Garden', 'Fashion', 'Free Stuff'];

export const allListings = [...browseListings];

export function getListingById(id: string) {
  return allListings.find((listing) => listing.id === id) ?? null;
}
