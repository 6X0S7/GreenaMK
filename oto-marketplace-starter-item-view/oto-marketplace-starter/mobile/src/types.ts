export type TabKey = 'home' | 'browse' | 'saved' | 'inbox' | 'profile';

export type AppView =
  | { name: 'tabs' }
  | { name: 'listing'; listingId: string; sourceTab: TabKey }
  | { name: 'thread'; threadId: string }
  | { name: 'contact'; contactName: string; initials: string; subtitle?: string; sellerId?: string; threadId?: string }
  | { name: 'seller'; sellerId: string; sellerName: string; initials: string; backToThreadId?: string; backToListingId?: string; backToSourceTab?: TabKey };

export type Listing = {
  id: string;
  title: string;
  price: string;
  type?: 'sale' | 'rent' | 'rent-to-own';
  location: string;
  category: string;
  distance: string;
  distanceMiles?: number;
  seller: string;
  rating?: number;
  badge?: string;
  condition: string;
  description?: string;
  image?: string;
  sellerId?: string;
};

export type MessagePreview = {
  id: string;
  listingId?: string;
  participantId?: string;
  name: string;
  listingTitle: string;
  preview: string;
  time: string;
  unread?: boolean;
  imageUrl?: string;
  mode?: 'buying' | 'selling';
  initials?: string;
};

export type ThreadMessage = {
  id: string;
  senderName: string;
  message: string;
  createdAt: string;
  outgoing?: boolean;
};
