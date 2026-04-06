import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { addOffer, getListingById } from '@/lib/file-db';
import { makeId } from '@/lib/format';

function withError(path: string, error: string) {
  const separator = path.includes('?') ? '&' : '?';
  return `${path}${separator}error=${encodeURIComponent(error)}`;
}

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();
  const formData = await request.formData();
  const listingId = String(formData.get('listingId') || '');
  const returnTo = String(formData.get('returnTo') || '/browse');
  const rawAmount = String(formData.get('amount') || '').trim();
  const amount = Number(rawAmount);
  const origin = new URL(request.url).origin;

  if (!currentUser) {
    return NextResponse.redirect(new URL(`/sign-in?next=${encodeURIComponent(returnTo)}`, origin));
  }

  const listing = await getListingById(listingId);
  if (!listing || listing.sellerId === currentUser.id) {
    return NextResponse.redirect(new URL(returnTo, origin));
  }

  const minimum = listing.minimumOfferAmount ?? 0;
  if (!listing.acceptsOffers) {
    return NextResponse.redirect(new URL(withError(returnTo, 'This seller is not taking offers.'), origin));
  }

  if (!Number.isFinite(amount) || amount < minimum) {
    return NextResponse.redirect(new URL(withError(returnTo, 'That offer is too low for this seller.'), origin));
  }

  await addOffer({
    id: makeId(),
    listingId: listing.id,
    listingTitle: listing.title,
    sellerId: listing.sellerId,
    buyerId: currentUser.id,
    buyerName: currentUser.name,
    amount: new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      maximumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    }).format(amount),
    createdAt: new Date().toISOString(),
  });

  return NextResponse.redirect(new URL(returnTo, origin));
}
