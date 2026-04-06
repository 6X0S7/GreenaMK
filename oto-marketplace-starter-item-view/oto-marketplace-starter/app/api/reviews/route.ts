import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { addReview, getOrders, getReviews } from '@/lib/file-db';
import { makeId } from '@/lib/format';

function withError(path: string, error: string) {
  const separator = path.includes('?') ? '&' : '?';
  return `${path}${separator}error=${encodeURIComponent(error)}`;
}

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();
  const formData = await request.formData();
  const listingId = String(formData.get('listingId') || '');
  const sellerId = String(formData.get('sellerId') || '');
  const returnTo = String(formData.get('returnTo') || '/dashboard');
  const rating = Number(formData.get('rating') || 0);
  const comment = String(formData.get('comment') || '').trim();
  const origin = new URL(request.url).origin;

  if (!currentUser) {
    return NextResponse.redirect(new URL(`/sign-in?next=${encodeURIComponent(returnTo)}`, origin));
  }

  const [orders, reviews] = await Promise.all([getOrders(), getReviews()]);
  const matchingOrder = orders.find(
    (order) => order.listingId === listingId && order.buyerId === currentUser.id
  );

  if (!matchingOrder) {
    return NextResponse.redirect(new URL(withError(returnTo, 'You can only review items you have bought.'), origin));
  }

  const reviewAvailableAt = new Date(matchingOrder.purchasedAt).getTime() + 24 * 60 * 60 * 1000;
  if (Date.now() < reviewAvailableAt) {
    return NextResponse.redirect(new URL(withError(returnTo, 'Reviews open the day after purchase.'), origin));
  }

  const existingReview = reviews.find(
    (review) => review.listingId === listingId && review.buyerId === currentUser.id
  );
  if (existingReview) {
    return NextResponse.redirect(new URL(withError(returnTo, 'You have already reviewed this item.'), origin));
  }

  if (rating < 1 || rating > 5 || !comment) {
    return NextResponse.redirect(new URL(withError(returnTo, 'Please add a rating and a short review.'), origin));
  }

  await addReview({
    id: makeId(),
    listingId,
    sellerId,
    buyerId: currentUser.id,
    buyerName: currentUser.name,
    rating,
    comment,
    createdAt: new Date().toISOString(),
  });

  return NextResponse.redirect(new URL(returnTo, origin));
}
