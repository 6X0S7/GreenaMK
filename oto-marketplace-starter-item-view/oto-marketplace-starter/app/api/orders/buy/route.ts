import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { addOrder, getListings, saveListings } from '@/lib/file-db';
import { makeId } from '@/lib/format';
import { canBuyNow, getPriceValue } from '@/lib/marketplace';

function withError(path: string, error: string) {
  const separator = path.includes('?') ? '&' : '?';
  return `${path}${separator}error=${encodeURIComponent(error)}`;
}

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();
  const formData = await request.formData();
  const listingId = String(formData.get('listingId') || '');
  const quantity = Number(formData.get('quantity') || 1);
  const addressId = String(formData.get('addressId') || '');
  const returnTo = String(formData.get('returnTo') || '/dashboard');
  const successTo = String(formData.get('successTo') || '/orders');
  const origin = new URL(request.url).origin;

  if (!currentUser) {
    return NextResponse.redirect(new URL(`/sign-in?next=${encodeURIComponent(returnTo)}`, origin));
  }

  if (!Number.isInteger(quantity) || quantity < 1) {
    return NextResponse.redirect(new URL(withError(returnTo, 'Quantity must be at least 1.'), origin));
  }

  const selectedAddress = (currentUser.addresses || []).find((address) => address.id === addressId);
  if (!selectedAddress) {
    return NextResponse.redirect(new URL(withError(returnTo, 'Choose a saved shipping address first.'), origin));
  }

  const listings = await getListings();
  const listing = listings.find((item) => item.id === listingId);
  if (!listing || !canBuyNow(listing) || listing.sellerId === currentUser.id) {
    return NextResponse.redirect(new URL(returnTo, origin));
  }

  const currentStock = listing.quantityAvailable ?? 1;
  if (currentStock < quantity) {
    return NextResponse.redirect(new URL(withError(returnTo, 'Not enough stock left for that quantity.'), origin));
  }

  const totalAmount =
    Number.isFinite(listing.priceAmount) && typeof listing.priceAmount === 'number'
      ? listing.priceAmount * quantity
      : getPriceValue(listing.price) * quantity;
  const amountPaid = Number.isFinite(totalAmount)
    ? new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: 'GBP',
        maximumFractionDigits: Number.isInteger(totalAmount) ? 0 : 2,
      }).format(totalAmount)
    : listing.price;

  await addOrder({
    id: makeId(),
    listingId: listing.id,
    listingTitle: listing.title,
    buyerId: currentUser.id,
    sellerId: listing.sellerId,
    quantity,
    amountPaid,
    shippingAddressLabel: selectedAddress.label,
    shippingAddressSummary: `${selectedAddress.line1}${selectedAddress.line2 ? `, ${selectedAddress.line2}` : ''}, ${selectedAddress.city}, ${selectedAddress.postcode}`,
    purchasedAt: new Date().toISOString(),
  });

  const nextListings = listings.map((item) =>
    item.id === listing.id
      ? {
          ...item,
          quantityAvailable: Math.max(0, (item.quantityAvailable ?? 1) - quantity),
          soldCount: (item.soldCount ?? 0) + quantity,
        }
      : item
  );
  await saveListings(nextListings);

  return NextResponse.redirect(new URL(successTo, origin));
}
