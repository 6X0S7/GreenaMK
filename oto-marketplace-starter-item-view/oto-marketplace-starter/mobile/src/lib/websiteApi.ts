import { apiBaseUrl } from '../config';
import { Listing, MessagePreview, ThreadMessage } from '../types';

type WebsiteListing = {
  id: string;
  title: string;
  price: string;
  type?: 'sale' | 'rent' | 'rent-to-own';
  rating?: number;
  condition?: string;
  location: string;
  category: string;
  sellerId: string;
  sellerName: string;
  distanceMiles: number;
  image: string;
  description: string;
  createdAt: string;
};

type WebsiteMessage = {
  id: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  recipientName: string;
  listingId: string;
  listingTitle: string;
  message: string;
  createdAt: string;
};

type CreateMessageInput = {
  senderId: string;
  recipientId: string;
  listingId: string;
  listingTitle: string;
  message: string;
};

type UpdateListingConditionInput = {
  actorId: string;
  condition: string;
};

type ApiResponse<T> = {
  ok: boolean;
  data?: T;
  error?: string;
};

function makeAbsoluteUrl(path?: string) {
  if (!path) {
    return undefined;
  }

  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  return `${apiBaseUrl}${path.startsWith('/') ? path : `/${path}`}`;
}

function formatTimeAgo(isoDate: string) {
  const diffMs = Date.now() - new Date(isoDate).getTime();
  const minutes = Math.max(1, Math.floor(diffMs / 60000));

  if (minutes < 60) {
    return `${minutes}m`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}h`;
  }

  const days = Math.floor(hours / 24);
  return days === 1 ? 'Yesterday' : `${days}d`;
}

export function mapListing(listing: WebsiteListing): Listing {
  return {
    id: listing.id,
    title: listing.title,
    price: listing.price.replace(/\bGBP\s?/g, '£').replace('Â£', '£'),
    type: listing.type,
    location: listing.location,
    category: listing.category,
    distance: `${listing.distanceMiles} mi`,
    distanceMiles: listing.distanceMiles,
    seller: listing.sellerName,
    rating: listing.rating ?? 4.2,
    badge: listing.price.includes('/') ? 'Rent' : 'Live listing',
    condition: listing.condition || 'Available',
    description: listing.description,
    image: makeAbsoluteUrl(listing.image),
    sellerId: listing.sellerId,
  };
}

function buildThreadId(message: WebsiteMessage) {
  const pair = [message.senderId, message.recipientId].sort().join(':');
  return `${message.listingId}:${pair}`;
}

export function buildThreadIdFromParts(listingId: string, firstUserId: string, secondUserId: string) {
  const pair = [firstUserId, secondUserId].sort().join(':');
  return `${listingId}:${pair}`;
}

export function mapThreadPreviews(messages: WebsiteMessage[]): MessagePreview[] {
  const byThread = new Map<string, WebsiteMessage[]>();

  for (const message of messages) {
    const key = buildThreadId(message);
    const existing = byThread.get(key) || [];
    existing.push(message);
    byThread.set(key, existing);
  }

  return [...byThread.entries()]
    .map(([threadId, threadMessages]) => {
      const sorted = [...threadMessages].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
      const latest = sorted[0];

      return {
        id: threadId,
        listingId: latest.listingId,
        name: latest.senderName,
        listingTitle: latest.listingTitle,
        preview: latest.message,
        time: formatTimeAgo(latest.createdAt),
        unread: false,
      };
    })
    .sort((a, b) => {
      const aLatest = byThread.get(a.id)?.sort((x, y) => +new Date(y.createdAt) - +new Date(x.createdAt))[0];
      const bLatest = byThread.get(b.id)?.sort((x, y) => +new Date(y.createdAt) - +new Date(x.createdAt))[0];
      return +new Date(bLatest?.createdAt || 0) - +new Date(aLatest?.createdAt || 0);
    });
}

export function mapThreadMessages(messages: WebsiteMessage[], threadId: string): ThreadMessage[] {
  return messages
    .filter((message) => buildThreadId(message) === threadId)
    .sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt))
    .map((message, index) => ({
      id: message.id,
      senderName: message.senderName,
      message: message.message,
      createdAt: message.createdAt,
      outgoing: index % 2 === 1,
    }));
}

async function fetchJson<T>(path: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  let response: Response;

  try {
    response = await fetch(`${apiBaseUrl}${path}`, { signal: controller.signal });
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`Timed out reaching ${apiBaseUrl}`);
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }

  const payload = (await response.json()) as ApiResponse<T>;

  if (!response.ok || !payload.ok || !payload.data) {
    throw new Error(payload.error || `Request failed for ${path}`);
  }

  return payload.data;
}

export async function fetchListings() {
  const listings = await fetchJson<WebsiteListing[]>('/api/listings');
  return listings.map(mapListing);
}

export async function fetchMessages() {
  return fetchJson<WebsiteMessage[]>('/api/messages');
}

export async function createMessage(input: CreateMessageInput) {
  const response = await fetch(`${apiBaseUrl}/api/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  const payload = (await response.json()) as ApiResponse<WebsiteMessage>;

  if (!response.ok || !payload.ok || !payload.data) {
    throw new Error(payload.error || 'Failed to create message.');
  }

  return payload.data;
}

export async function updateListingCondition(listingId: string, input: UpdateListingConditionInput) {
  const response = await fetch(`${apiBaseUrl}/api/listings/${listingId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  const payload = (await response.json()) as ApiResponse<WebsiteListing>;

  if (!response.ok || !payload.ok || !payload.data) {
    throw new Error(payload.error || 'Failed to update listing.');
  }

  return mapListing(payload.data);
}
