import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getListingById, addMessage, getMessages, getUserById } from '@/lib/file-db';
import { makeId } from '@/lib/format';
import { Message } from '@/lib/types';
import { corsPreflight, withCors } from '@/lib/cors';

export const dynamic = 'force-dynamic';

export async function GET() {
  const messages = await getMessages();
  return withCors(NextResponse.json({ ok: true, data: messages }));
}

export function OPTIONS() {
  return corsPreflight();
}

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();
  const body = await request.json();
  const { recipientId, listingId, listingTitle, message, senderId } = body as Partial<Message> & { senderId?: string };
  const actingUser = currentUser ?? (senderId ? await getUserById(senderId) : null);

  if (!actingUser) {
    return withCors(NextResponse.json({ ok: false, error: 'Sign in to message another user.' }, { status: 401 }));
  }

  if (!recipientId || !listingId || !listingTitle || !message) {
    return withCors(NextResponse.json({ ok: false, error: 'All message fields are required.' }, { status: 400 }));
  }

  if (recipientId === actingUser.id) {
    return withCors(NextResponse.json({ ok: false, error: 'You cannot message yourself.' }, { status: 400 }));
  }

  const [recipient, listing] = await Promise.all([getUserById(recipientId), getListingById(listingId)]);

  if (!recipient || !listing) {
    return withCors(NextResponse.json({ ok: false, error: 'Listing or recipient not found.' }, { status: 404 }));
  }

  const newMessage: Message = {
    id: makeId(),
    senderId: actingUser.id,
    senderName: actingUser.name,
    senderEmail: actingUser.email,
    recipientId: recipient.id,
    recipientName: recipient.name,
    recipientEmail: recipient.email,
    listingId,
    listingTitle,
    message,
    createdAt: new Date().toISOString(),
  };

  await addMessage(newMessage);
  return withCors(NextResponse.json({ ok: true, data: newMessage }, { status: 201 }));
}
