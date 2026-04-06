export type TabKey = 'home' | 'browse' | 'saved' | 'inbox' | 'profile';

export type AppView =
  | { name: 'tabs' }
  | { name: 'listing'; listingId: string; sourceTab: TabKey }
  | { name: 'thread'; threadId: string };

export type Listing = {
  id: string;
  title: string;
  price: string;
  location: string;
  category: string;
  distance: string;
  seller: string;
  badge?: string;
  condition: string;
  description?: string;
  image?: string;
  sellerId?: string;
};

export type MessagePreview = {
  id: string;
  name: string;
  listingTitle: string;
  preview: string;
  time: string;
  unread?: boolean;
};

export type ThreadMessage = {
  id: string;
  senderName: string;
  message: string;
  createdAt: string;
  outgoing?: boolean;
};
