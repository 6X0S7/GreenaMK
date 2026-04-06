import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { addMessage, getListingById, getUserById } from '@/lib/file-db';
import { makeId } from '@/lib/format';
import { Message } from '@/lib/types';

function withError(path: string, error: string) {
  const separator = path.includes('?') ? '&' : '?';
  return `${path}${separator}error=${encodeURIComponent(error)}`;
}

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();
  const formData = await request.formData();
  const listingId = String(formData.get('listingId') || '');
  const listingTitle = String(formData.get('listingTitle') || '');
  const recipientId = String(formData.get('recipientId') || '');
  const message = String(formData.get('message') || '').trim();
  const returnTo = String(formData.get('returnTo') || '/messages');
  const origin = new URL(request.url).origin;

  if (!currentUser) {
    return NextResponse.redirect(new URL(withError('/sign-in', 'Sign in to message another user.'), origin));
  }

  if (!recipientId || !listingId || !listingTitle || !message) {
    return NextResponse.redirect(new URL(withError(returnTo, 'All message fields are required.'), origin));
  }

  if (recipientId === currentUser.id) {
    return NextResponse.redirect(new URL(withError(returnTo, 'You cannot message yourself.'), origin));
  }

  const [recipient, listing] = await Promise.all([getUserById(recipientId), getListingById(listingId)]);

  if (!recipient || !listing) {
    return NextResponse.redirect(new URL(withError(returnTo, 'Listing or recipient not found.'), origin));
  }

  const newMessage: Message = {
    id: makeId(),
    senderId: currentUser.id,
    senderName: currentUser.name,
    senderEmail: currentUser.email,
    recipientId: recipient.id,
    recipientName: recipient.name,
    recipientEmail: recipient.email,
    listingId,
    listingTitle,
    message,
    createdAt: new Date().toISOString(),
  };

  await addMessage(newMessage);
  return NextResponse.redirect(new URL(returnTo, origin));
}
