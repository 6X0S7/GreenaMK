export type ListingType = 'sale' | 'rent' | 'rent-to-own';
export type PriceUnit = 'hour' | 'day' | 'month' | null;

export type User = {
  id: string;
  name: string;
  email: string;
  username?: string;
  password?: string;
  location: string;
  bio?: string;
  accountType?: 'private' | 'business';
  rating?: number;
  ratingCount?: number;
  addresses?: UserAddress[];
};

export type UserAddress = {
  id: string;
  label: string;
  line1: string;
  line2?: string;
  city: string;
  postcode: string;
};

export type Listing = {
  id: string;
  title: string;
  price: string;
  priceAmount?: number;
  priceUnit?: PriceUnit;
  rating?: number;
  ratingCount?: number;
  condition?: string;
  fulfillment?: string[];
  acceptsOffers?: boolean;
  minimumOfferAmount?: number | null;
  quantityAvailable?: number;
  soldCount?: number;
  galleryImages?: string[];
  type: ListingType;
  location: string;
  category: string;
  sellerId: string;
  sellerName: string;
  distanceMiles: number;
  image: string;
  description: string;
  createdAt: string;
};

export type Order = {
  id: string;
  listingId: string;
  listingTitle: string;
  buyerId: string;
  sellerId: string;
  quantity: number;
  amountPaid: string;
  shippingAddressLabel?: string;
  shippingAddressSummary?: string;
  purchasedAt: string;
};

export type Offer = {
  id: string;
  listingId: string;
  listingTitle: string;
  sellerId: string;
  buyerId: string;
  buyerName: string;
  amount: string;
  createdAt: string;
};

export type Message = {
  id: string;
  senderId: string;
  senderName: string;
  senderEmail: string;
  recipientId: string;
  recipientName: string;
  recipientEmail: string;
  listingId: string;
  listingTitle: string;
  message: string;
  createdAt: string;
};

export type Review = {
  id: string;
  listingId: string;
  sellerId: string;
  buyerId: string;
  buyerName: string;
  rating: number;
  comment: string;
  createdAt: string;
};

export type SavedListing = {
  id: string;
  userId: string;
  listingId: string;
  createdAt: string;
};

export type ApiResponse<T> = {
  ok: boolean;
  data?: T;
  error?: string;
};
