import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getListingById, addMessage, getMessages, getUserById } from '@/lib/file-db';
import { makeId } from '@/lib/format';
import { Message } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  const messages = await getMessages();
  return NextResponse.json({ ok: true, data: messages });
}

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.json({ ok: false, error: 'Sign in to message another user.' }, { status: 401 });
  }

  const body = await request.json();
  const { recipientId, listingId, listingTitle, message } = body as Partial<Message>;

  if (!recipientId || !listingId || !listingTitle || !message) {
    return NextResponse.json({ ok: false, error: 'All message fields are required.' }, { status: 400 });
  }

  if (recipientId === currentUser.id) {
    return NextResponse.json({ ok: false, error: 'You cannot message yourself.' }, { status: 400 });
  }

  const [recipient, listing] = await Promise.all([getUserById(recipientId), getListingById(listingId)]);

  if (!recipient || !listing) {
    return NextResponse.json({ ok: false, error: 'Listing or recipient not found.' }, { status: 404 });
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
  return NextResponse.json({ ok: true, data: newMessage }, { status: 201 });
}
