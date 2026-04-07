import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getListingById, getListings, getUserById, saveListings } from '@/lib/file-db';
import { Listing } from '@/lib/types';
import { corsPreflight, withCors } from '@/lib/cors';

export const dynamic = 'force-dynamic';

export function OPTIONS() {
  return corsPreflight();
}

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const listing = await getListingById(params.id);

  if (!listing) {
    return withCors(NextResponse.json({ ok: false, error: 'Listing not found.' }, { status: 404 }));
  }

  return withCors(NextResponse.json({ ok: true, data: listing }));
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const currentUser = await getCurrentUser();
  const body = (await request.json()) as Partial<Listing> & { actorId?: string };
  const actingUser = currentUser ?? (body.actorId ? await getUserById(body.actorId) : null);

  if (!actingUser) {
    return withCors(NextResponse.json({ ok: false, error: 'Sign in to update a listing.' }, { status: 401 }));
  }

  const listings = await getListings();
  const listingIndex = listings.findIndex((item) => item.id === params.id);

  if (listingIndex === -1) {
    return withCors(NextResponse.json({ ok: false, error: 'Listing not found.' }, { status: 404 }));
  }

  const listing = listings[listingIndex];
  if (listing.sellerId !== actingUser.id) {
    return withCors(NextResponse.json({ ok: false, error: 'Only the seller can update this listing.' }, { status: 403 }));
  }

  const nextCondition = typeof body.condition === 'string' ? body.condition.trim() : '';
  if (!nextCondition) {
    return withCors(NextResponse.json({ ok: false, error: 'A valid condition is required.' }, { status: 400 }));
  }

  const nextListing: Listing = {
    ...listing,
    condition: nextCondition,
  };

  listings[listingIndex] = nextListing;
  await saveListings(listings);

  return withCors(NextResponse.json({ ok: true, data: nextListing }));
}
