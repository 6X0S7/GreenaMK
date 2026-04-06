import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getSavedListings, saveSavedListings } from '@/lib/file-db';
import { makeId } from '@/lib/format';

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();
  const formData = await request.formData();
  const listingId = String(formData.get('listingId') || '');
  const returnTo = String(formData.get('returnTo') || '/saved');
  const origin = new URL(request.url).origin;

  if (!currentUser) {
    return NextResponse.redirect(new URL(`/sign-in?next=${encodeURIComponent(returnTo)}`, origin));
  }

  if (!listingId) {
    return NextResponse.redirect(new URL(returnTo, origin));
  }

  const saved = await getSavedListings();
  const existing = saved.find((item) => item.userId === currentUser.id && item.listingId === listingId);

  const nextSaved = existing
    ? saved.filter((item) => item.id !== existing.id)
    : [
        {
          id: makeId(),
          userId: currentUser.id,
          listingId,
          createdAt: new Date().toISOString(),
        },
        ...saved,
      ];

  await saveSavedListings(nextSaved);
  return NextResponse.redirect(new URL(returnTo, origin));
}
