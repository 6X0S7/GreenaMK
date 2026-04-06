import { promises as fs } from 'fs';
import path from 'path';
import { Listing, Message, Offer, Order, Review, SavedListing, User } from './types';

const dataDir = path.join(process.cwd(), 'data');
const listingsPath = path.join(dataDir, 'listings.json');
const messagesPath = path.join(dataDir, 'messages.json');
const usersPath = path.join(dataDir, 'users.json');
const ordersPath = path.join(dataDir, 'orders.json');
const reviewsPath = path.join(dataDir, 'reviews.json');
const savedListingsPath = path.join(dataDir, 'saved-listings.json');
const offersPath = path.join(dataDir, 'offers.json');

async function ensureFile(filePath: string, fallback: unknown) {
  try {
    await fs.access(filePath);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(fallback, null, 2), 'utf8');
  }
}

export async function getListings(): Promise<Listing[]> {
  await ensureFile(listingsPath, []);
  const raw = await fs.readFile(listingsPath, 'utf8');
  return JSON.parse(raw) as Listing[];
}

export async function getListingById(id: string): Promise<Listing | null> {
  const listings = await getListings();
  return listings.find((listing) => listing.id === id) ?? null;
}

export async function saveListings(listings: Listing[]) {
  await ensureFile(listingsPath, []);
  await fs.writeFile(listingsPath, JSON.stringify(listings, null, 2), 'utf8');
}

export async function addListing(listing: Listing) {
  const listings = await getListings();
  listings.unshift(listing);
  await saveListings(listings);
  return listing;
}

export async function getMessages(): Promise<Message[]> {
  await ensureFile(messagesPath, []);
  const raw = await fs.readFile(messagesPath, 'utf8');
  return JSON.parse(raw) as Message[];
}

export async function saveMessages(messages: Message[]) {
  await ensureFile(messagesPath, []);
  await fs.writeFile(messagesPath, JSON.stringify(messages, null, 2), 'utf8');
}

export async function addMessage(message: Message) {
  const messages = await getMessages();
  messages.unshift(message);
  await saveMessages(messages);
  return message;
}

export async function getUsers(): Promise<User[]> {
  await ensureFile(usersPath, []);
  const raw = await fs.readFile(usersPath, 'utf8');
  return JSON.parse(raw) as User[];
}

export async function saveUsers(users: User[]) {
  await ensureFile(usersPath, []);
  await fs.writeFile(usersPath, JSON.stringify(users, null, 2), 'utf8');
}

export async function getUserById(id: string) {
  const users = await getUsers();
  return users.find((user) => user.id === id) ?? null;
}

export async function getUserByCredentials(username: string, password: string) {
  const users = await getUsers();
  const normalizedUsername = username.trim().toLowerCase();

  return (
    users.find(
      (user) =>
        user.username?.trim().toLowerCase() === normalizedUsername && user.password === password
    ) ?? null
  );
}

export async function getOrders(): Promise<Order[]> {
  await ensureFile(ordersPath, []);
  const raw = await fs.readFile(ordersPath, 'utf8');
  return JSON.parse(raw) as Order[];
}

export async function saveOrders(orders: Order[]) {
  await ensureFile(ordersPath, []);
  await fs.writeFile(ordersPath, JSON.stringify(orders, null, 2), 'utf8');
}

export async function addOrder(order: Order) {
  const orders = await getOrders();
  orders.unshift(order);
  await saveOrders(orders);
  return order;
}

export async function getOffers(): Promise<Offer[]> {
  await ensureFile(offersPath, []);
  const raw = await fs.readFile(offersPath, 'utf8');
  return JSON.parse(raw) as Offer[];
}

export async function saveOffers(offers: Offer[]) {
  await ensureFile(offersPath, []);
  await fs.writeFile(offersPath, JSON.stringify(offers, null, 2), 'utf8');
}

export async function addOffer(offer: Offer) {
  const offers = await getOffers();
  offers.unshift(offer);
  await saveOffers(offers);
  return offer;
}

export async function getReviews(): Promise<Review[]> {
  await ensureFile(reviewsPath, []);
  const raw = await fs.readFile(reviewsPath, 'utf8');
  return JSON.parse(raw) as Review[];
}

export async function saveReviews(reviews: Review[]) {
  await ensureFile(reviewsPath, []);
  await fs.writeFile(reviewsPath, JSON.stringify(reviews, null, 2), 'utf8');
}

export async function addReview(review: Review) {
  const reviews = await getReviews();
  reviews.unshift(review);
  await saveReviews(reviews);
  return review;
}

export async function getSavedListings(): Promise<SavedListing[]> {
  await ensureFile(savedListingsPath, []);
  const raw = await fs.readFile(savedListingsPath, 'utf8');
  return JSON.parse(raw) as SavedListing[];
}

export async function saveSavedListings(items: SavedListing[]) {
  await ensureFile(savedListingsPath, []);
  await fs.writeFile(savedListingsPath, JSON.stringify(items, null, 2), 'utf8');
}
