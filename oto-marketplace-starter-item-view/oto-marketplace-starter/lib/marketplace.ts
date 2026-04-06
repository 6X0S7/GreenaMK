import { Listing, Message, Review } from './types';

export function getPriceValue(price: string) {
  const match = price.replace(/,/g, '').match(/\d+(\.\d+)?/);
  return match ? Number(match[0]) : Number.POSITIVE_INFINITY;
}

export function getListingPriceValue(listing: Listing) {
  if (typeof listing.priceAmount === 'number' && Number.isFinite(listing.priceAmount)) {
    return listing.priceAmount;
  }

  return getPriceValue(listing.price);
}

export function matchesPriceRange(listing: Listing, minPrice: string, maxPrice: string) {
  const value = getListingPriceValue(listing);
  const min = minPrice.trim() === '' ? Number.NaN : Number(minPrice);
  const max = maxPrice.trim() === '' ? Number.NaN : Number(maxPrice);

  if (Number.isFinite(min) && value < min) {
    return false;
  }

  if (Number.isFinite(max) && value > max) {
    return false;
  }

  return true;
}

export function matchesDistance(listing: Listing, distance: string) {
  if (!distance) {
    return true;
  }

  const maxDistance = Number(distance);
  if (!Number.isFinite(maxDistance)) {
    return true;
  }

  return listing.distanceMiles <= maxDistance;
}

export function isFreeStuffListing(listing: Listing) {
  if (listing.category === 'Free Stuff') {
    return true;
  }

  if (typeof listing.priceAmount === 'number') {
    return listing.priceAmount <= 0;
  }

  return listing.price.trim().toLowerCase().includes('free');
}

export function getThreadKey(message: Message) {
  const pair = [message.senderId, message.recipientId].sort().join(':');
  return `${message.listingId}:${pair}`;
}

const oversizedCategories = new Set(['Cars']);

export function isDeliveryAvailable(listing: Listing) {
  return (listing.fulfillment || []).some((option) => option.toLowerCase().includes('delivery'));
}

export function supportsBuyNow(listing: Listing) {
  return listing.type === 'sale' && isDeliveryAvailable(listing) && !oversizedCategories.has(listing.category);
}

export function canBuyNow(listing: Listing) {
  return supportsBuyNow(listing) && (listing.quantityAvailable ?? 1) > 0;
}

export function canCounterOffer(listing: Listing) {
  return listing.type === 'sale' && Boolean(listing.acceptsOffers);
}

export function getAverageRating(reviews: Review[]) {
  if (reviews.length === 0) {
    return 0;
  }

  const total = reviews.reduce((sum, review) => sum + review.rating, 0);
  return total / reviews.length;
}
